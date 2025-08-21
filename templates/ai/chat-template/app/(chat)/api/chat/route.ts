import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
// Auth removed: run in public mode
import type { VisibilityType } from "@/components/visibility-selector";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import { systemPrompt } from "@/lib/ai/prompts";
import { myProvider, isModelAvailable, isReasoningModel, DEFAULT_ALIAS_CHAT_MODEL_ID } from "@/lib/ai/providers";
import { createDocument } from "@/lib/ai/tools/create-document";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { isProductionEnvironment } from "@/lib/constants";
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  getOrCreateUserByWalletAddress,
  getOrCreatePublicUser,
  PUBLIC_USER_ID,
  reassignChatToUser,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
// geolocation removed for web3-focused app
import { after } from "next/server";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";
import { generateTitleFromUserMessage } from "../../actions";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { getBalance } from "@/lib/ai/tools/get-balance";
import { getBlockNumber } from "@/lib/ai/tools/get-block-number";
import { getTokenBalance } from "@/lib/ai/tools/get-token-balance";
import { resolveENSName } from "@/lib/ai/tools/resolve-ens-name";
import { lookupENSName } from "@/lib/ai/tools/lookup-ens-name";
import { resolveTokenAddress } from "@/lib/ai/tools/resolve-token-address";

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL"
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
      walletAddress,
    } = requestBody;

    // Resolve user identity
    let session: any = {
      user: { id: PUBLIC_USER_ID, type: "guest" as const, walletAddress: undefined as string | undefined },
    };
    let userType: "guest" | "regular" = "guest";

    // Prefer body.walletAddress, otherwise read from cookie set by /api/wallet
    let resolvedWallet = walletAddress;
    if (!resolvedWallet) {
      const cookieHeader = request.headers.get("cookie") || "";
      const cookies = Object.fromEntries(
        cookieHeader
          .split(";")
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => {
            const idx = p.indexOf("=");
            const k = idx >= 0 ? p.slice(0, idx) : p;
            const v = idx >= 0 ? decodeURIComponent(p.slice(idx + 1)) : "";
            return [k, v] as const;
          }),
      );
      if (cookies.walletAddress && /^0x[a-fA-F0-9]{40}$/.test(cookies.walletAddress)) {
        resolvedWallet = cookies.walletAddress.toLowerCase();
      }
    }

    if (resolvedWallet) {
      const user = await getOrCreateUserByWalletAddress({ walletAddress: resolvedWallet });
      session = {
        user: { id: user.id, type: "regular" as const, walletAddress: resolvedWallet },
      };
      userType = "regular";
    } else {
      // Ensure public user exists in DB for guest mode
      await getOrCreatePublicUser();
    }

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError("rate_limit:chat").toResponse();
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      // If this chat was created as public and user connects wallet later, migrate ownership
      if (session.user?.id && chat.userId !== session.user.id) {
        await reassignChatToUser({ chatId: id, userId: session.user.id });
      }
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    // request geolocation removed; not used in web3 context

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: message.parts,
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    const chosenModelId = isModelAvailable(selectedChatModel)
      ? selectedChatModel
      : DEFAULT_ALIAS_CHAT_MODEL_ID;

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: myProvider.languageModel(chosenModelId),
          system: systemPrompt({ selectedChatModel: chosenModelId, walletAddress: session.user.walletAddress }),
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(5),
          experimental_activeTools: isReasoningModel(chosenModelId)
            ? []
            : [
                "createDocument",
                "updateDocument",
                "getBalance",
                "getBlockNumber",
                "getTokenBalance",
                "resolveENSName",
                "lookupENSName",
                "resolveTokenAddress",
              ],
          experimental_transform: smoothStream({ chunking: "word" }),
          tools: {
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            getBalance: getBalance({ session }),
            getBlockNumber: getBlockNumber(),
            getTokenBalance: getTokenBalance({ session }),
            resolveENSName: resolveENSName(),
            lookupENSName: lookupENSName(),
            resolveTokenAddress: resolveTokenAddress(),
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          })
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        await saveMessages({
          messages: messages.map((message) => ({
            id: message.id,
            role: message.role,
            parts: message.parts,
            createdAt: new Date(),
            attachments: [],
            chatId: id,
          })),
        });
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () =>
          stream.pipeThrough(new JsonToSseTransformStream())
        )
      );
    } else {
      return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    }
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error(error);
    return new Response(
      JSON.stringify({ code: "internal_error", message: "Unexpected error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const session: any = { user: { id: PUBLIC_USER_ID, type: "guest" } };

  const chat = await getChatById({ id });

  // Public mode allows delete by anyone

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
