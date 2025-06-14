-- Fix missing columns in languages table
ALTER TABLE mycheff.languages 
ADD COLUMN IF NOT EXISTS native_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;

-- Fix missing columns in recipe_media table
ALTER TABLE mycheff.recipe_media 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS file_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS purpose VARCHAR(50) DEFAULT 'main',
ADD COLUMN IF NOT EXISTS alt_text TEXT;

-- Update existing records to have default values
UPDATE mycheff.languages SET native_name = name WHERE native_name IS NULL;
UPDATE mycheff.languages SET is_default = FALSE WHERE is_default IS NULL;
UPDATE mycheff.recipe_media SET sort_order = display_order WHERE sort_order IS NULL;
UPDATE mycheff.recipe_media SET purpose = 'main' WHERE purpose IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN mycheff.languages.native_name IS 'Native language name';
COMMENT ON COLUMN mycheff.languages.is_default IS 'Whether this is the default language';
COMMENT ON COLUMN mycheff.recipe_media.sort_order IS 'Sort order for media items';
COMMENT ON COLUMN mycheff.recipe_media.original_name IS 'Original file name';
COMMENT ON COLUMN mycheff.recipe_media.file_name IS 'File name on disk';
COMMENT ON COLUMN mycheff.recipe_media.mime_type IS 'MIME type of the file';
COMMENT ON COLUMN mycheff.recipe_media.file_size IS 'File size in bytes';
COMMENT ON COLUMN mycheff.recipe_media.file_path IS 'File path on disk';
COMMENT ON COLUMN mycheff.recipe_media.purpose IS 'Media purpose (main, step, ingredient)';
COMMENT ON COLUMN mycheff.recipe_media.alt_text IS 'Alt text for accessibility'; 