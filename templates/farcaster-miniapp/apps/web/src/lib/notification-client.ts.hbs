import { getUserNotificationDetails } from "@/lib/memory-store";
import {
  FrameNotificationDetails,
  type SendNotificationRequest,
  sendNotificationResponseSchema,
} from "@farcaster/frame-sdk";
import { env } from "./env";

const appUrl = env.NEXT_PUBLIC_URL || "";

type SendFrameNotificationResult =
  | {
      state: "error";
      error: unknown;
    }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" };

export async function sendFrameNotification({
  fid,
  title,
  body,
  notificationDetails,
}: {
  fid: number;
  title: string;
  body: string;
  notificationDetails?: FrameNotificationDetails | null;
}): Promise<SendFrameNotificationResult> {
  if (!notificationDetails) {
    notificationDetails = await getUserNotificationDetails(fid);
  }
  if (!notificationDetails) {
    return { state: "no_token" };
  }

  const response = await fetch(notificationDetails.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notificationId: crypto.randomUUID(),
      title,
      body,
      targetUrl: appUrl,
      tokens: [notificationDetails.token],
    } satisfies SendNotificationRequest),
  });

  if (response.status === 429) {
    return { state: "rate_limit" };
  }

  if (!response.ok) {
    return { state: "error", error: await response.text() };
  }

  try {
    const responseData = await response.json();
    const result = sendNotificationResponseSchema.parse(responseData);
    if (result.result.successfulTokens.length > 0) {
      return { state: "success" };
    } else {
      return { state: "error", error: "No successful notifications sent" };
    }
  } catch (error) {
    return { state: "error", error };
  }
}
