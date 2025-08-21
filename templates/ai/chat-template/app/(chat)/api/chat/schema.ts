import { z } from 'zod';

const textPartSchema = z.object({
  type: z.enum(['text']),
  text: z.string().min(1).max(2000),
});

const filePartSchema = z.object({
  type: z.enum(['file']),
  mediaType: z.enum(['image/jpeg', 'image/png']),
  name: z.string().min(1).max(100),
  url: z.string().url(),
});

const partSchema = z.union([textPartSchema, filePartSchema]);

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  message: z.object({
    id: z.string().uuid(),
    role: z.enum(['user']),
    parts: z.array(partSchema),
  }),
  // Allow any model id; server will validate and fallback
  selectedChatModel: z.string().min(1).max(100),
  selectedVisibilityType: z.enum(['public', 'private']),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/i, 'Invalid wallet address')
    .optional(),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
