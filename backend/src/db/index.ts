/**
 * Database Barrel Export
 *
 * Re-exports all DB utilities and repositories for clean imports:
 *   import { initializePools, insertUser, createRoom } from '../db/index.js';
 */

export {
  initializePools,
  shutdownPools,
  getDbHealth,
  isInMemoryMode,
  getTier1Pool,
  getTier3Pool,
  setRlsContext,
  type DbHealth,
} from './pool.js';

export {
  insertUser,
  getUserByExternalId,
  insertTier1Message,
  insertSafetyAuditLog,
  insertJournalEntry,
  getJournalEntries,
  countUsers,
  type User,
  type Tier1Message,
  type SafetyAuditEntry,
  type JournalEntry,
} from './repositories/tier1-repo.js';

export {
  createRoom,
  addRoomMember,
  getRoomMembers,
  insertTier3Message,
  getTier3Messages,
  createSession,
  endSession,
  updateHeartbeat,
  createInvite,
  claimInvite,
  getInviteByCode,
  getRoom,
  getUserRoom,
  getPendingInviteForRoom,
  updateRoomStatus,
  countRooms,
  type Room,
  type RoomMember,
  type Tier3Message,
  type Session,
  type RoomInvite,
} from './repositories/tier3-repo.js';

export {
  insertConsentRecord,
  getConsentRecord,
  insertConsentAudit,
  deleteConsentRecord,
  getConsentAuditEntries,
  type ConsentRecord,
  type ConsentAuditEntry,
} from './repositories/auth-repo.js';

export {
  requestDeletion,
  cancelDeletion,
  executeDeletion,
  getDeletionRequest,
  type DeletionRequest,
} from './repositories/deletion-repo.js';

export { runMigrations } from './migrate.js';
