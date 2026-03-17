-- Relio Auth & Consent Schema (Tier 3 Shared Database)
-- Issues #110 (consent_audit + RLS), #111 (users table auth columns)
--
-- This extends the Tier 3 schema with auth-specific tables.

-- Extend users table with auth columns (#111)
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT CHECK (auth_provider IN ('b2c_email', 'b2c_apple', 'b2c_google'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS b2c_object_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS age_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Issue #139: User language preference for i18n + AI output
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es', 'pt', 'he'));

-- Consent records (#110)
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    tos_version TEXT NOT NULL,
    tos_accepted_at TIMESTAMPTZ NOT NULL,
    privacy_version TEXT NOT NULL,
    privacy_accepted_at TIMESTAMPTZ NOT NULL,
    age_verified BOOLEAN DEFAULT false,
    age_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- Immutable consent audit log (#110)
-- This table is APPEND-ONLY — no updates or deletes allowed
CREATE TABLE IF NOT EXISTS consent_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL CHECK (action IN ('accept_tos', 'accept_privacy', 'verify_age', 'withdraw_consent', 're_accept_tos', 're_accept_privacy')),
    version TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consent_audit_user ON consent_audit(user_id, created_at DESC);

-- Row-Level Security on consent tables
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_audit ENABLE ROW LEVEL SECURITY;

-- Users can only see their own consent
CREATE POLICY consent_user_isolation ON consent_records
    FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);

-- Audit log: users see their own, admins see all
CREATE POLICY audit_user_read ON consent_audit
    FOR SELECT USING (
        user_id = current_setting('app.current_user_id')::uuid
        OR current_setting('app.current_user_role', true) = 'admin'
    );

-- Only the app can insert audit entries (not users directly)
CREATE POLICY audit_app_insert ON consent_audit
    FOR INSERT WITH CHECK (true);

-- Prevent updates and deletes on audit log (immutable)
-- No UPDATE or DELETE policies = those operations are denied by default with RLS enabled

-- Refresh token tracking (for token rotation)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash TEXT NOT NULL UNIQUE,
    device_id TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens(user_id, expires_at DESC) WHERE revoked_at IS NULL;
