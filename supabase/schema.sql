-- Create reels_script_library table
CREATE TABLE reels_script_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  brand TEXT NOT NULL,
  product_type TEXT NOT NULL,
  theme TEXT NOT NULL,
  script_type TEXT NOT NULL CHECK (script_type IN ('hack', 'pain', 'new', 'knowledge', 'fomo', 'other')),
  hook TEXT NOT NULL,
  structure_breakdown TEXT,
  emotion_design TEXT,
  cta TEXT,
  reusable_points TEXT,
  rewritten_version TEXT,
  suggested_product TEXT,
  performance_rating INTEGER CHECK (performance_rating BETWEEN 1 AND 5),
  is_recommended BOOLEAN DEFAULT FALSE,
  notes TEXT,
  views_count INTEGER
);

-- Create index for faster searching
CREATE INDEX idx_reels_script_type ON reels_script_library(script_type);
CREATE INDEX idx_reels_recommended ON reels_script_library(is_recommended);
CREATE INDEX idx_reels_brand ON reels_script_library(brand);
CREATE INDEX idx_reels_hook_text ON reels_script_library USING GIN(to_tsvector('english', hook));
