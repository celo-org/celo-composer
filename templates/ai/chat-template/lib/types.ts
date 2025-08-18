import { z } from 'zod';
import type { createDocument } from './ai/tools/create-document';
import type { updateDocument } from './ai/tools/update-document';
import type { InferUITool, UIMessage } from 'ai';
import type { getBlockNumber } from './ai/tools/get-block-number';
import type { getTokenBalance } from './ai/tools/get-token-balance';
import type { resolveENSName } from './ai/tools/resolve-ens-name';
import type { lookupENSName } from './ai/tools/lookup-ens-name';
import type { resolveTokenAddress } from './ai/tools/resolve-token-address';

import type { ArtifactKind } from '@/components/artifact';
import type { Suggestion } from './db/schema';

export type DataPart = { type: 'append-message'; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;
type getBlockNumberTool = InferUITool<ReturnType<typeof getBlockNumber>>;
type getTokenBalanceTool = InferUITool<ReturnType<typeof getTokenBalance>>;
type resolveENSNameTool = InferUITool<ReturnType<typeof resolveENSName>>;
type lookupENSNameTool = InferUITool<ReturnType<typeof lookupENSName>>;
type resolveTokenAddressTool = InferUITool<ReturnType<typeof resolveTokenAddress>>;

export type ChatTools = {
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  getBalance: any; // already present at runtime
  getBlockNumber: getBlockNumberTool;
  getTokenBalance: getTokenBalanceTool;
  resolveENSName: resolveENSNameTool;
  lookupENSName: lookupENSNameTool;
  resolveTokenAddress: resolveTokenAddressTool;
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: Suggestion;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export interface Attachment {
  name: string;
  url: string;
  contentType: string;
}
