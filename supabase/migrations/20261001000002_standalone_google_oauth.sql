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

-- 5. RLS policies supporting both Secret Key (bypasses RLS) and Publishable/Anon Key
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Public read for basic profiles'
    ) THEN
        CREATE POLICY "Public read for basic profiles" ON public.profiles
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Public insert for Google OAuth profiles'
    ) THEN
        CREATE POLICY "Public insert for Google OAuth profiles" ON public.profiles
            FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Public update for Google OAuth profiles'
    ) THEN
        CREATE POLICY "Public update for Google OAuth profiles" ON public.profiles
            FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;
