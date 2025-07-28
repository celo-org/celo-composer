import type { FrameNotificationDetails } from "@farcaster/frame-sdk";

// In-memory storage to replace Redis
const notificationStore = new Map<string, FrameNotificationDetails>();

const notificationServiceKey = "farcaster:miniapp";

function getUserNotificationDetailsKey(fid: number): string {
  return `${notificationServiceKey}:user:${fid}`;
}

export async function getUserNotificationDetails(
  fid: number
): Promise<FrameNotificationDetails | null> {
  const key = getUserNotificationDetailsKey(fid);
  return notificationStore.get(key) || null;
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails
): Promise<void> {
  const key = getUserNotificationDetailsKey(fid);
  notificationStore.set(key, notificationDetails);
}

export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  const key = getUserNotificationDetailsKey(fid);
  notificationStore.delete(key);
}

// Helper function to get all stored notification details (for debugging)
export function getAllNotificationDetails(): Array<{fid: string, details: FrameNotificationDetails}> {
  const result: Array<{fid: string, details: FrameNotificationDetails}> = [];
  for (const [key, details] of notificationStore.entries()) {
    const fid = key.replace(`${notificationServiceKey}:user:`, '');
    result.push({ fid, details });
  }
  return result;
}
