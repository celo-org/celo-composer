import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { availableChatModels, DEFAULT_ALIAS_CHAT_MODEL_ID, DEFAULT_ALIAS_REASONING_MODEL_ID } from "@/lib/ai/providers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const current = cookieStore.get("chat-model")?.value || DEFAULT_ALIAS_CHAT_MODEL_ID;
  const models = [
    { id: DEFAULT_ALIAS_CHAT_MODEL_ID, name: "Default Chat", description: "Alias to the current default chat model", reasoning: false },
    { id: DEFAULT_ALIAS_REASONING_MODEL_ID, name: "Default Reasoning", description: "Alias to the current default reasoning model", reasoning: true },
    ...availableChatModels,
  ];
  return NextResponse.json({ models, selected: current });
}
