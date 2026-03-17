/**
 * Push Notification Service
 *
 * Issue #132: Push notifications for invite acceptance.
 * Uses Expo Push Notifications (free, server-side).
 * 
 * Notifications sent:
 * - Partner accepted invite → "Your partner has joined! Start your first session."
 * - Partner sent a message → "You have a new mediated message" (no content preview for privacy)
 * - Safety halt → suppressed (never notify about crisis events)
 */

import type { Request, Response } from 'express';

// ── Types ────────────────────────────────────────────────────
interface PushToken {
  userId: string;
  expoPushToken: string;
  platform: 'ios' | 'android';
  registeredAt: string;
}

// In-memory store (until DB connected)
const tokenStore = new Map<string, PushToken>();

// ── Token Registration ───────────────────────────────────────

export function registerPushToken(userId: string, token: string, platform: 'ios' | 'android'): void {
  tokenStore.set(userId, {
    userId,
    expoPushToken: token,
    platform,
    registeredAt: new Date().toISOString(),
  });
}

export function removePushToken(userId: string): void {
  tokenStore.delete(userId);
}

// ── Send Notifications ───────────────────────────────────────

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: 'default';
  badge?: number;
}

/**
 * Send a push notification via Expo Push API.
 * Expo handles APNs (iOS) and FCM (Android) routing.
 */
async function sendPushNotification(message: PushMessage): Promise<boolean> {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const data = await response.json() as any;
    if (data.data?.status === 'error') {
      console.error('[Push] Error:', data.data.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Push] Failed to send:', err);
    return false;
  }
}

// ── Notification Triggers ────────────────────────────────────

/**
 * Notify partner when invite is accepted.
 */
export async function notifyInviteAccepted(inviterUserId: string, partnerName: string): Promise<void> {
  const token = tokenStore.get(inviterUserId);
  if (!token) return;

  await sendPushNotification({
    to: token.expoPushToken,
    title: 'Partner Joined! 🎉',
    body: `${partnerName || 'Your partner'} has accepted your invite. Start your first session!`,
    data: { type: 'invite_accepted' },
    sound: 'default',
  });
}

/**
 * Notify partner of new mediated message.
 * PRIVACY: Never include message content in push notifications.
 */
export async function notifyNewMessage(recipientUserId: string): Promise<void> {
  const token = tokenStore.get(recipientUserId);
  if (!token) return;

  await sendPushNotification({
    to: token.expoPushToken,
    title: 'New Message',
    body: 'You have a new mediated message waiting.',
    data: { type: 'new_message' },
    sound: 'default',
    badge: 1,
  });
}

export { tokenStore };
