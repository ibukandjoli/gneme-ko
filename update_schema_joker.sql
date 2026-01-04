-- Add custom_category to goals
ALTER TABLE goals ADD COLUMN IF NOT EXISTS custom_category TEXT;

-- Add is_joker to daily_logs to track purchased jokers
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS is_joker BOOLEAN DEFAULT FALSE;

-- Simply ensure ai_validation_status can accept 'joker' if strictly typed, 
-- or we will just use 'valid' and rely on is_joker=TRUE to distinguish.
-- Ideally:
-- ALTER TYPE ai_validation_status ADD VALUE 'joker'; 
-- But keeping it simple for MVP, we'll mark them as 'valid' so they count for the streak, 
-- and is_joker = true distinguishes them.
