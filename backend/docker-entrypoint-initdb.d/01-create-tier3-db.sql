-- Create the Tier 3 (shared) database for local development.
-- The default database (relio_tier1_private) is created by POSTGRES_DB env var.
CREATE DATABASE relio_tier3_shared OWNER relioadmin;
