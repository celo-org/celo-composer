import type { ArtifactKind } from "@/components/artifact";
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  PUBLIC_USER_ID,
  saveDocument,
  getOrCreateUserByWalletAddress,
  getOrCreatePublicUser,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter id is missing"
    ).toResponse();
  }

  const session: any = { user: { id: PUBLIC_USER_ID } };

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  if (!document) {
    return new ChatSDKError("not_found:document").toResponse();
  }

  // Public mode: allow fetching

  return Response.json(documents, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter id is required."
    ).toResponse();
  }

  const {
    content,
    title,
    kind,
    walletAddress,
  }: { content: string; title: string; kind: ArtifactKind; walletAddress?: string } =
    await request.json();

  let userId = PUBLIC_USER_ID;
  if (walletAddress) {
    const user = await getOrCreateUserByWalletAddress({ walletAddress });
    userId = user.id;
  } else {
    await getOrCreatePublicUser();
  }

  const documents = await getDocumentsById({ id });

  if (documents.length > 0) {
    const [document] = documents;

    // Public mode: allow overwrite
  }

  const document = await saveDocument({
    id,
    content,
    title,
    kind,
    userId,
  });

  return Response.json(document, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const timestamp = searchParams.get("timestamp");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter id is required."
    ).toResponse();
  }

  if (!timestamp) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter timestamp is required."
    ).toResponse();
  }

  const session: any = { user: { id: PUBLIC_USER_ID } };

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  // Public mode: allow delete

  const documentsDeleted = await deleteDocumentsByIdAfterTimestamp({
    id,
    timestamp: new Date(timestamp),
  });

  return Response.json(documentsDeleted, { status: 200 });
}
