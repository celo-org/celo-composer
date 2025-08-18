// Auth disabled; export stubs for compatibility
export type UserType = "guest" | "regular";

export async function auth() {
  return { user: { id: "public-user", type: "guest" as UserType } } as any;
}

export async function signIn() {
  return { ok: true } as any;
}

export async function signOut() {
  return { ok: true } as any;
}

export const handlers = {
  GET: async () => new Response("Auth disabled"),
  POST: async () => new Response("Auth disabled"),
} as any;
export const GET = handlers.GET;
export const POST = handlers.POST;
