-- ==============================================================================
-- Migration: Standalone Google OAuth Support
-- Description: Decouple profiles table from Supabase auth.users and add google_id / avatar_url
-- ==============================================================================

-- 1. Remove foreign key constraint linking profiles.id to auth.users if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Ensure default UUID generator on profiles.id
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Add Google OAuth fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 4. Create unique indexes for quick lookup and data integrity
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email_lower ON public.profiles(lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_google_id ON public.profiles(google_id) WHERE google_id IS NOT NULL;

-- 5. RLS policies
--
-- Authentication is standalone Google OAuth, so there is no Supabase auth.uid()
-- to key an ownership predicate on. That makes "USING (true)" especially
-- dangerous here: an earlier draft of this migration granted anonymous
-- UPDATE with USING (true) WITH CHECK (true), which let any visitor holding
-- only the publishable key set role = 'admin' on any row, and admin
-- authorization in lib/admin/actions.ts trusts profiles.role straight from the
-- database. Do not add unqualified policies to this table.
--
-- Every read and write the application actually performs goes through the
-- service-role client, which bypasses RLS entirely:
--   lib/auth/session.ts, lib/auth/user-sync.ts, app/admin/customers/page.tsx
--
-- So the only policy the Data API needs is INSERT, to let a Google sign-in
-- create its own row. Reads, updates and deletes stay closed to anon and
-- authenticated; there is no client-side code path that needs them.

-- Anonymous callers may create a profile for a completed Google sign-in.
-- Columns are pinned so a caller cannot self-assign a privileged role: this
-- table is the authorization source, so role must only ever be set by the
-- server (ADMIN_EMAILS env or an existing admin row).
DROP POLICY IF EXISTS "Public insert for Google OAuth profiles" ON public.profiles;

CREATE POLICY "Public insert for Google OAuth profiles" ON public.profiles
    FOR INSERT TO anon, authenticated
    WITH CHECK (role = 'customer');

-- 6. Explicit grants
--
-- Supabase is changing the platform default so new tables in public are no
-- longer auto-exposed to the Data API (enforced for all projects 2026-10-30).
-- Granting per role keeps this project working once that lands.
--
-- Note profiles deliberately gets INSERT only for anon/authenticated. The
-- application reaches it through the service-role key, which needs no grant.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fabrication_requests TO anon, authenticated;

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT ON public.profiles TO anon, authenticated;

-- Sequences, and the two functions the app calls over the Data API.
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
