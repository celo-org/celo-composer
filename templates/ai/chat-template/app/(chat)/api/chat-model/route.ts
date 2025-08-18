import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { model } = await request.json();
    if (typeof model !== "string" || model.length < 1 || model.length > 100) {
      return NextResponse.json({ ok: false, error: "invalid_model" }, { status: 400 });
    }
    const cookieStore = await cookies();
    cookieStore.set("chat-model", model);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
