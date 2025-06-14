-- Fix missing columns in users table
ALTER TABLE mycheff.users 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Update existing records to have default values
UPDATE mycheff.users SET full_name = username WHERE full_name IS NULL;
UPDATE mycheff.users SET is_verified = is_active WHERE is_verified IS NULL;
UPDATE mycheff.users SET is_premium = FALSE WHERE is_premium IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN mycheff.users.full_name IS 'Full name of the user';
COMMENT ON COLUMN mycheff.users.is_verified IS 'Whether the user email is verified';
COMMENT ON COLUMN mycheff.users.is_premium IS 'Whether the user has premium subscription'; 