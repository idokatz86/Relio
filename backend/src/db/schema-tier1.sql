-- Relio Database Schema: Tier 1 Private Database
-- Per architect-dual-context-db skill: "Design distinct schemas for three separate states"
-- This schema enforces Row-Level Security so one user's private data
-- can NEVER be accessed by another user, even via SQL injection.
--
-- Issue #65: Backend DB Integration

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (identity boundary)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE NOT NULL,    -- from auth provider (Azure AD B2C sub claim)
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tier 1: Raw messages (private — NEVER shared with partner)
-- Per orchestrator-agent.agent.md: "Tier 1 raw transcripts NEVER shared"
CREATE TABLE tier1_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    raw_content TEXT NOT NULL,
    safety_severity TEXT NOT NULL CHECK (safety_severity IN ('SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    safety_halt BOOLEAN NOT NULL DEFAULT false,
    safety_reasoning TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for efficient queries (user can only see their own messages)
CREATE INDEX idx_tier1_sender_room ON tier1_messages(sender_id, room_id, created_at DESC);

-- Safety audit log (for clinical review and compliance)
CREATE TABLE safety_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    severity TEXT NOT NULL,
    halt BOOLEAN NOT NULL,
    reasoning TEXT NOT NULL,
    markers TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_safety_severity ON safety_audit_log(severity, created_at)
    WHERE severity IN ('HIGH', 'CRITICAL');

-- Journal entries (private reflections)
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_journal_user ON journal_entries(user_id, created_at DESC);

-- Row-Level Security: users can ONLY see their own data
-- Per architect-dual-context-db skill: "Mandate physical or logical separation preventing SQL JOIN leakages"
ALTER TABLE tier1_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policies (app connects as 'relio_app' role, sets current user via session variable)
CREATE POLICY tier1_user_isolation ON tier1_messages
    FOR ALL USING (sender_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY journal_user_isolation ON journal_entries
    FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY safety_user_isolation ON safety_audit_log
    FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);

-- Auto-purge: Tier 1 data older than 90 days (per enforce-privacy-mechanisms skill)
-- This will be called by a scheduled Azure Function or pg_cron job
CREATE OR REPLACE FUNCTION purge_expired_tier1() RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM tier1_messages WHERE created_at < now() - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
