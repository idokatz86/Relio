/**
 * Partner Invite Router
 * 
 * Manages couple linking: create invite codes, accept invites,
 * check pairing status, and generate QR codes.
 * 
 * Issues #118 (invite API), #122 (QR endpoint)
 * @see .github/agents/backend-developer.agent.md
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { randomBytes } from 'node:crypto';
import type { AuthenticatedUser } from '../auth/auth-service.js';

const router = Router();

// ── In-Memory Store (until DB connected) ─────────────────────
interface InviteRecord {
  code: string;
  roomId: string;
  createdBy: string;
  createdByName: string;
  claimedBy: string | null;
  expiresAt: number;
  createdAt: string;
}

interface RoomRecord {
  id: string;
  userA: string;
  userB: string | null;
  phase: string;
  status: 'active' | 'pending' | 'archived';
  createdAt: string;
}

const invites = new Map<string, InviteRecord>();
const rooms = new Map<string, RoomRecord>();
const userRooms = new Map<string, string>(); // userId → roomId

// ── Helpers ──────────────────────────────────────────────────
function generateInviteCode(): string {
  return randomBytes(3).toString('hex').toUpperCase(); // 6-char hex code
}

function generateRoomId(): string {
  return randomBytes(16).toString('hex');
}

// ── Schemas ──────────────────────────────────────────────────
const AcceptInviteSchema = z.object({
  code: z.string().length(6, 'Invite code must be 6 characters'),
});

// ── Routes ───────────────────────────────────────────────────

// Create an invite (Partner A creates room + invite code)
router.post('/create', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;

  // Check if user already has a room
  const existingRoom = userRooms.get(user.id);
  if (existingRoom) {
    const room = rooms.get(existingRoom);
    if (room?.userB) {
      res.status(409).json({ error: 'You are already paired with a partner' });
      return;
    }
    // Return existing invite if room exists but no partner yet
    const existingInvite = Array.from(invites.values()).find(
      i => i.createdBy === user.id && !i.claimedBy && i.expiresAt > Date.now()
    );
    if (existingInvite) {
      res.json({
        code: existingInvite.code,
        roomId: existingInvite.roomId,
        expiresAt: new Date(existingInvite.expiresAt).toISOString(),
        deepLink: `relio://invite/${existingInvite.code}`,
      });
      return;
    }
  }

  // Create room + invite
  const roomId = existingRoom || generateRoomId();
  const code = generateInviteCode();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  if (!existingRoom) {
    rooms.set(roomId, {
      id: roomId,
      userA: user.id,
      userB: null,
      phase: 'dating',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    userRooms.set(user.id, roomId);
  }

  invites.set(code, {
    code,
    roomId,
    createdBy: user.id,
    createdByName: user.displayName || 'Your partner',
    claimedBy: null,
    expiresAt,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    code,
    roomId,
    expiresAt: new Date(expiresAt).toISOString(),
    deepLink: `relio://invite/${code}`,
  });
});

// Accept an invite (Partner B joins the room)
router.post('/accept', (req: Request, res: Response) => {
  const parsed = AcceptInviteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid invite code', details: parsed.error.issues });
    return;
  }

  const user = (req as any).user as AuthenticatedUser;
  const code = parsed.data.code.toUpperCase();
  const invite = invites.get(code);

  if (!invite) {
    res.status(404).json({ error: 'Invite code not found or expired' });
    return;
  }

  if (invite.expiresAt < Date.now()) {
    invites.delete(code);
    res.status(410).json({ error: 'Invite code has expired' });
    return;
  }

  if (invite.claimedBy) {
    res.status(409).json({ error: 'Invite code already used' });
    return;
  }

  if (invite.createdBy === user.id) {
    res.status(400).json({ error: 'You cannot accept your own invite' });
    return;
  }

  // Check if Partner B already has a room
  if (userRooms.has(user.id)) {
    res.status(409).json({ error: 'You are already in a room' });
    return;
  }

  // Link partner
  invite.claimedBy = user.id;
  const room = rooms.get(invite.roomId);
  if (room) {
    room.userB = user.id;
    room.status = 'active';
  }
  userRooms.set(user.id, invite.roomId);

  res.json({
    paired: true,
    roomId: invite.roomId,
    partnerName: invite.createdByName,
  });
});

// Get pairing status
router.get('/status', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const roomId = userRooms.get(user.id);

  if (!roomId) {
    res.json({ paired: false, roomId: null, partner: null });
    return;
  }

  const room = rooms.get(roomId);
  if (!room) {
    res.json({ paired: false, roomId: null, partner: null });
    return;
  }

  const partnerId = room.userA === user.id ? room.userB : room.userA;
  const pendingInvite = Array.from(invites.values()).find(
    i => i.roomId === roomId && !i.claimedBy && i.expiresAt > Date.now()
  );

  res.json({
    paired: !!partnerId,
    roomId,
    phase: room.phase,
    status: room.status,
    pendingInviteCode: pendingInvite?.code || null,
  });
});

// QR code generation (#122) — returns SVG data for the invite code
router.get('/qr/:code', (req: Request, res: Response) => {
  const code = req.params.code?.toUpperCase();
  const invite = invites.get(code);

  if (!invite || invite.expiresAt < Date.now()) {
    res.status(404).json({ error: 'Invalid or expired invite code' });
    return;
  }

  // Return data for client-side QR rendering (no server-side QR lib needed)
  res.json({
    code,
    deepLink: `relio://invite/${code}`,
    webLink: `https://relio.app/invite/${code}`,
    expiresAt: new Date(invite.expiresAt).toISOString(),
  });
});

export { router as inviteRouter };
