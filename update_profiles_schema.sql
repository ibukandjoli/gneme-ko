-- Add new columns to profiles table for extended user info
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS country text DEFAULT 'Sénégal';

-- Create a secure policy if not exists (usually strictly for the user)
-- Assumes RLS is enabled.
-- ensure user can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);
