/**
 * Relio Mobile Types
 * Matches backend API contract.
 */

export type SafetySeverity = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AttachmentStyle = 'anxious' | 'avoidant' | 'secure' | 'disorganized';
export type ActivationState = 'baseline' | 'elevated' | 'flooding';

/** Response from POST /api/v1/mediate */
export interface MediationResponse {
  senderId: string;
  safetyHalt: boolean;
  safetySeverity: SafetySeverity;
  tier3Output: string | null;
  profile: {
    attachmentStyle: AttachmentStyle;
    activationState: ActivationState;
  } | null;
  processingTimeMs: number;
  agentsInvoked: string[];
}

/** WebSocket incoming message types */
export type WSIncoming =
  | { type: 'connected'; roomId: string; userId: string; timestamp: string }
  | { type: 'processing'; timestamp: string }
  | { type: 'pipeline_result'; data: MediationResponse; timestamp: string }
  | { type: 'tier3_message'; data: { content: string; fromUserId: string; safetyLevel: SafetySeverity; timestamp: string } }
  | { type: 'error'; message: string };

/** WebSocket outgoing message */
export interface WSOutgoing {
  type: 'message';
  content: string;
}

/** Chat message for UI display */
export interface ChatMessage {
  id: string;
  content: string;
  fromUserId: string;
  isMine: boolean;
  tier: 1 | 3;
  timestamp: Date;
  safetyLevel?: SafetySeverity;
  isProcessing?: boolean;
}

/** User profile stored locally */
export interface UserProfile {
  userId: string;
  displayName: string;
  attachmentStyle?: AttachmentStyle;
  activationState?: ActivationState;
  roomId?: string;
  partnerId?: string;
}

/** Private journal entry — Tier 1 only, never shared */
export interface JournalEntry {
  id: string;
  rawMessage: string;
  tier3Translation: string | null;
  attachmentStyle?: AttachmentStyle;
  activationState?: ActivationState;
  timestamp: Date;
  safetyLevel: SafetySeverity;
}
