import {
  getChatsByUserId,
  getChatsByWalletAddress,
  getOrCreatePublicUser,
  PUBLIC_USER_ID,
  getOrCreateUserByWalletAddress,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const startingAfter = searchParams.get("starting_after");
  const endingBefore = searchParams.get("ending_before");
  let walletAddress = searchParams.get("walletAddress") || undefined;

  if (startingAfter && endingBefore) {
    return new ChatSDKError(
      "bad_request:api",
      "Only one of starting_after or ending_before can be provided."
    ).toResponse();
  }

  // If not provided via query, try cookie
  if (!walletAddress) {
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
        })
    );
    const fromCookie = cookies.walletAddress as string | undefined;
    if (fromCookie && /^0x[a-fA-F0-9]{40}$/.test(fromCookie)) {
      walletAddress = fromCookie.toLowerCase();
    }
  }

  // If wallet provided, fetch by wallet (case-insensitive). Else use public user id.
  let chats;
  if (walletAddress) {
    chats = await getChatsByWalletAddress({
      walletAddress,
      limit,
      startingAfter,
      endingBefore,
    });
  } else {
    await getOrCreatePublicUser();
    chats = await getChatsByUserId({
      id: PUBLIC_USER_ID,
      limit,
      startingAfter,
      endingBefore,
    });
  }

  return Response.json(chats);
}
