-- Relio Account Deletion Schema
-- Issue #125: GDPR Article 17 Right to Erasure
-- 24h grace period with cascade purge

CREATE TABLE IF NOT EXISTS deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    reason TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    scheduled_purge_at TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ,
    purged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_deletion_pending
    ON deletion_requests(scheduled_purge_at)
    WHERE cancelled_at IS NULL AND purged_at IS NULL;

-- Cascade purge function: removes ALL user data across all tiers
CREATE OR REPLACE FUNCTION purge_user_data(target_user_id UUID) RETURNS VOID AS $$
BEGIN
    -- Tier 1: Private data
    DELETE FROM tier1_messages WHERE sender_id = target_user_id;
    DELETE FROM journal_entries WHERE user_id = target_user_id;
    DELETE FROM safety_audit_log WHERE user_id = target_user_id;

    -- Auth & Consent
    DELETE FROM consent_audit WHERE user_id = target_user_id;
    DELETE FROM consent_records WHERE user_id = target_user_id;
    DELETE FROM refresh_tokens WHERE user_id = target_user_id;

    -- Deletion record: mark as purged (keep for audit)
    UPDATE deletion_requests SET purged_at = now() WHERE user_id = target_user_id;

    -- Finally: remove user identity
    DELETE FROM users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Scheduled job: process expired grace periods
-- Run via pg_cron or Azure Function every hour
-- SELECT purge_user_data(user_id) FROM deletion_requests
--   WHERE scheduled_purge_at <= now() AND cancelled_at IS NULL AND purged_at IS NULL;
