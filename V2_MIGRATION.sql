-- 1. ENHANCE PROFILES
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- 2. AGENTS TABLE (Node-based Agent Builder)
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  config JSONB DEFAULT '{"nodes": [], "edges": []}',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS FOR AGENTS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public agents are viewable by everyone" ON agents FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can manage own agents" ON agents FOR ALL USING (auth.uid() = user_id);

-- 4. UPDATED_AT TRIGGER FOR AGENTS
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
