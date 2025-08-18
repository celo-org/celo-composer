import { ChatSDKError } from "@/lib/errors";
import { getOrCreateUserByWalletAddress } from "@/lib/db/queries";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const walletAddress = (body?.walletAddress as string | undefined)?.toLowerCase();

    if (!walletAddress || typeof walletAddress !== "string") {
      return new ChatSDKError("bad_request:api", "Missing walletAddress").toResponse();
    }

    const user = await getOrCreateUserByWalletAddress({ walletAddress });

    const headers = new Headers({ "content-type": "application/json" });
    // Persist last known wallet on client for subsequent API calls
    headers.append(
      "set-cookie",
      `walletAddress=${walletAddress}; Path=/; Max-Age=2592000; SameSite=Lax`
    );

    return new Response(JSON.stringify({ ok: true, userId: user.id }), {
      status: 200,
      headers,
    });
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
