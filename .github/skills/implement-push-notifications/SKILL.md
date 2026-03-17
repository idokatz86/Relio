---
name: implement-push-notifications
description: Implements Expo Push Notifications for invite acceptance and new message alerts, with privacy-safe content (never includes message text in push payloads).
agents: [backend-developer, native-mobile-developer, data-protection-officer]
---
# Skill: Implement Push Notifications

You implement push notifications using Expo Push API for critical user events.

## Step 1: Push Token Registration
- POST `/api/v1/push/register` — accepts `{ expoPushToken, platform }`
- Validate token starts with `ExponentPushToken[`
- Store per-user: userId → { expoPushToken, platform, registeredAt }
- Auth middleware required

## Step 2: Push Service (`backend/src/server/push-notifications.ts`)
- `registerPushToken(userId, token, platform)` — store
- `removePushToken(userId)` — cleanup on logout/deletion
- `sendPushNotification(message)` — POST to `https://exp.host/--/api/v2/push/send`
- Handle Expo API errors gracefully

## Step 3: Notification Triggers
- `notifyInviteAccepted(inviterUserId, partnerName)` — "Your partner has joined!"
- `notifyNewMessage(recipientUserId)` — "You have a new mediated message waiting."
- NEVER send safety halt notifications via push
- NEVER include message content in push body (privacy)

## Step 4: Mobile Registration
- On app start after auth, request push permissions via `expo-notifications`
- Send token to `/api/v1/push/register`
- Handle token refresh

## Constraints
- Push content must be privacy-safe: no Tier 1/2/3 data in push payloads
- Silent fail on send errors (don't block user flows)
- Expo Push API is free and handles APNs/FCM routing
