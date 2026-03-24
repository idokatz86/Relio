/**
 * Tier 3 Repository — Shared Database
 *
 * Handles: rooms, room_members, tier3 (Socratic) messages, sessions, invites.
 * No RLS on this DB — access control is at the application layer.
 *
 * @see schema-tier3.sql
 */

import { v4 as uuidv4 } from 'uuid';
import { getTier3Pool, isInMemoryMode } from '../pool.js';

// ── Types ────────────────────────────────────────────────────

export interface Room {
  id: string;
  name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RoomMember {
  room_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface Tier3Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  agents_invoked: string[];
  processing_ms: number | null;
  safety_severity: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  room_id: string | null;
  connected_at: string;
  disconnected_at: string | null;
  last_heartbeat: string;
}

export interface RoomInvite {
  id: string;
  room_id: string;
  invite_code: string;
  created_by: string;
  claimed_by: string | null;
  expires_at: string;
  created_at: string;
}

// ── Room Operations ──────────────────────────────────────────

export async function createRoom(name?: string): Promise<Room> {
  if (isInMemoryMode()) throw new Error('createRoom requires PostgreSQL');

  const pool = getTier3Pool();
  const result = await pool.query<Room>(
    `INSERT INTO rooms (name) VALUES ($1) RETURNING *`,
    [name ?? null],
  );
  return result.rows[0];
}

export async function addRoomMember(
  roomId: string,
  userId: string,
  role: string = 'participant',
): Promise<RoomMember> {
  if (isInMemoryMode()) throw new Error('addRoomMember requires PostgreSQL');

  const pool = getTier3Pool();
  const result = await pool.query<RoomMember>(
    `INSERT INTO room_members (room_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (room_id, user_id) DO UPDATE SET role = EXCLUDED.role
     RETURNING *`,
    [roomId, userId, role],
  );
  return result.rows[0];
}

export async function getRoomMembers(roomId: string): Promise<RoomMember[]> {
  if (isInMemoryMode()) return [];

  const pool = getTier3Pool();
  const result = await pool.query<RoomMember>(
    `SELECT * FROM room_members WHERE room_id = $1`,
    [roomId],
  );
  return result.rows;
}

// ── Tier 3 Messages ──────────────────────────────────────────

export async function insertTier3Message(
  roomId: string,
  senderId: string,
  content: string,
  agentsInvoked: string[],
  processingMs: number | null,
  safetySeverity: string = 'SAFE',
): Promise<Tier3Message> {
  if (isInMemoryMode()) throw new Error('insertTier3Message requires PostgreSQL');

  const pool = getTier3Pool();
  const result = await pool.query<Tier3Message>(
    `INSERT INTO tier3_messages (room_id, sender_id, content, agents_invoked, processing_ms, safety_severity)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [roomId, senderId, content, agentsInvoked, processingMs, safetySeverity],
  );
  return result.rows[0];
}

export async function getTier3Messages(
  roomId: string,
  limit = 50,
): Promise<Tier3Message[]> {
  if (isInMemoryMode()) return [];

  const pool = getTier3Pool();
  const result = await pool.query<Tier3Message>(
    `SELECT * FROM tier3_messages
     WHERE room_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [roomId, limit],
  );
  return result.rows;
}

// ── Sessions ─────────────────────────────────────────────────

export async function createSession(
  userId: string,
  roomId: string | null,
): Promise<Session> {
  if (isInMemoryMode()) throw new Error('createSession requires PostgreSQL');

  const pool = getTier3Pool();
  const result = await pool.query<Session>(
    `INSERT INTO sessions (user_id, room_id)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, roomId],
  );
  return result.rows[0];
}

export async function endSession(sessionId: string): Promise<void> {
  if (isInMemoryMode()) return;

  const pool = getTier3Pool();
  await pool.query(
    `UPDATE sessions SET disconnected_at = now() WHERE id = $1`,
    [sessionId],
  );
}

export async function updateHeartbeat(sessionId: string): Promise<void> {
  if (isInMemoryMode()) return;

  const pool = getTier3Pool();
  await pool.query(
    `UPDATE sessions SET last_heartbeat = now() WHERE id = $1`,
    [sessionId],
  );
}

// ── Invites ──────────────────────────────────────────────────

function generateInviteCode(): string {
  // 8-char alphanumeric, uppercase for readability
  return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
}

export async function createInvite(
  roomId: string,
  createdBy: string,
): Promise<RoomInvite> {
  if (isInMemoryMode()) throw new Error('createInvite requires PostgreSQL');

  const pool = getTier3Pool();
  const code = generateInviteCode();
  const result = await pool.query<RoomInvite>(
    `INSERT INTO room_invites (room_id, invite_code, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [roomId, code, createdBy],
  );
  return result.rows[0];
}

export async function getInviteByCode(code: string): Promise<RoomInvite | null> {
  if (isInMemoryMode()) return null;

  const pool = getTier3Pool();
  const result = await pool.query<RoomInvite>(
    `SELECT * FROM room_invites WHERE invite_code = $1`,
    [code],
  );
  return result.rows[0] ?? null;
}

export async function claimInvite(
  inviteCode: string,
  claimedBy: string,
): Promise<RoomInvite | null> {
  if (isInMemoryMode()) return null;

  const pool = getTier3Pool();
  const result = await pool.query<RoomInvite>(
    `UPDATE room_invites
     SET claimed_by = $2
     WHERE invite_code = $1
       AND claimed_by IS NULL
       AND expires_at > now()
     RETURNING *`,
    [inviteCode, claimedBy],
  );
  return result.rows[0] ?? null;
}

// ── Additional Room Queries ──────────────────────────────────

export async function getRoom(roomId: string): Promise<Room | null> {
  if (isInMemoryMode()) return null;

  const pool = getTier3Pool();
  const result = await pool.query<Room>(
    `SELECT * FROM rooms WHERE id = $1`,
    [roomId],
  );
  return result.rows[0] ?? null;
}

export async function getUserRoom(userId: string): Promise<{ room: Room; members: RoomMember[] } | null> {
  if (isInMemoryMode()) return null;

  const pool = getTier3Pool();
  const roomResult = await pool.query<Room>(
    `SELECT r.* FROM rooms r
     JOIN room_members rm ON rm.room_id = r.id
     WHERE rm.user_id = $1 AND r.status != 'archived'
     LIMIT 1`,
    [userId],
  );
  if (!roomResult.rows[0]) return null;

  const room = roomResult.rows[0];
  const memberResult = await pool.query<RoomMember>(
    `SELECT * FROM room_members WHERE room_id = $1`,
    [room.id],
  );
  return { room, members: memberResult.rows };
}

export async function getPendingInviteForRoom(
  roomId: string,
  createdBy: string,
): Promise<RoomInvite | null> {
  if (isInMemoryMode()) return null;

  const pool = getTier3Pool();
  const result = await pool.query<RoomInvite>(
    `SELECT * FROM room_invites
     WHERE room_id = $1 AND created_by = $2
       AND claimed_by IS NULL AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [roomId, createdBy],
  );
  return result.rows[0] ?? null;
}

export async function updateRoomStatus(roomId: string, status: string): Promise<void> {
  if (isInMemoryMode()) return;

  const pool = getTier3Pool();
  await pool.query(
    `UPDATE rooms SET status = $2, updated_at = now() WHERE id = $1`,
    [roomId, status],
  );
}

export async function countRooms(): Promise<{ total: number; paired: number }> {
  if (isInMemoryMode()) return { total: 0, paired: 0 };

  const pool = getTier3Pool();
  const result = await pool.query<{ total: string; paired: string }>(
    `SELECT
       COUNT(DISTINCT r.id) AS total,
       COUNT(DISTINCT r.id) FILTER (
         WHERE (SELECT COUNT(*) FROM room_members rm WHERE rm.room_id = r.id) >= 2
       ) AS paired
     FROM rooms r WHERE r.status != 'archived'`,
  );
  return {
    total: parseInt(result.rows[0]?.total || '0', 10),
    paired: parseInt(result.rows[0]?.paired || '0', 10),
  };
}
