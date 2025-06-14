-- Create recipe_media table
CREATE TABLE IF NOT EXISTS mycheff.recipe_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
    purpose VARCHAR(20) NOT NULL DEFAULT 'main' CHECK (purpose IN ('main', 'step', 'ingredient', 'result')),
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    alt_text VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES mycheff.recipes(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recipe_media_recipe_id ON mycheff.recipe_media(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_media_type ON mycheff.recipe_media(media_type);
CREATE INDEX IF NOT EXISTS idx_recipe_media_purpose ON mycheff.recipe_media(purpose);

-- Check if table was created
SELECT COUNT(*) as table_exists FROM information_schema.tables 
WHERE table_schema = 'mycheff' AND table_name = 'recipe_media'; 