-- 1. Enable RLS on profiles if not already
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts/duplicates
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 3. Re-create policies properly

-- SELECT: Everyone can see profiles (or restrict to auth.uid() = id if you prefer privacy)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

-- INSERT: Users can create their own profile (Crucial for first save!)
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);
