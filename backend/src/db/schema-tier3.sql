-- Relio Database Schema: Tier 3 Shared Database
-- Per architect-dual-context-db skill: "No foreign keys directly link Private State to Shared Room"
-- This database contains ONLY Tier 3 Socratic outputs safe for partner viewing.
--
-- Issue #65: Backend DB Integration

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Rooms (mediation sessions between 2 users + AI mediator)
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'archived')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Room members (which users are in which room)
CREATE TABLE room_members (
    room_id UUID NOT NULL REFERENCES rooms(id),
    user_id UUID NOT NULL,  -- No FK to tier1 users table (separate DB, no JOINs)
    role TEXT NOT NULL CHECK (role IN ('participant', 'mediator')) DEFAULT 'participant',
    joined_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (room_id, user_id)
);

-- Tier 3: Actionable messages (Socratic translations — safe for partner to see)
-- Per communication-coach.agent.md: "Generate Tier 3 Socratic, de-escalated questions"
CREATE TABLE tier3_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id),
    sender_id UUID NOT NULL,    -- Who originated the message (no FK to tier1 DB)
    content TEXT NOT NULL,       -- The Socratic rephrased message
    agents_invoked TEXT[] NOT NULL DEFAULT '{}',
    processing_ms INTEGER,
    safety_severity TEXT NOT NULL DEFAULT 'SAFE',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tier3_room ON tier3_messages(room_id, created_at DESC);

-- Sessions (WebSocket connection state — survives container restarts)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    room_id UUID REFERENCES rooms(id),
    connected_at TIMESTAMPTZ DEFAULT now(),
    disconnected_at TIMESTAMPTZ,
    last_heartbeat TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sessions_user ON sessions(user_id, connected_at DESC);

-- Invite codes for partner linking
CREATE TABLE room_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id),
    invite_code TEXT UNIQUE NOT NULL,
    created_by UUID NOT NULL,
    claimed_by UUID,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_invite_code ON room_invites(invite_code) WHERE claimed_by IS NULL;
