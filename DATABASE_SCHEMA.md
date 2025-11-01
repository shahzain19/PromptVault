# Database Schema Updates

## Required Schema Changes

To support the new privacy features, you need to add the following column to your `prompts` table in Supabase:

### 1. Add Privacy Column

```sql
-- Add is_public column to prompts table
ALTER TABLE prompts
ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
```

### 2. Update RLS Policies for Prompts

Update your prompts table policies to handle public prompts:

```sql
-- Allow everyone to read public prompts
CREATE POLICY "Public prompts are viewable by everyone"
ON prompts FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- Keep existing policies for insert/update/delete (users can only modify their own prompts)
```

### 3. Create Index for Performance

```sql
-- Add index for better performance when querying public prompts
CREATE INDEX idx_prompts_public ON prompts(is_public, created_at DESC);
```

## Optional: Enhanced Author Names

If you want to display real author names instead of user IDs, you can create a profiles table:

### 4. Add User Profiles Table (Optional)

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

Then update the Explore page query to join with profiles table.

## Features Added

1. **Privacy Toggle**: Users can mark prompts as public or private
2. **Explore Page**: Browse and search public prompts from the community
3. **Author Attribution**: Public prompts show the author's name
4. **Enhanced UI**: Privacy indicators on prompt cards

## Usage

- **Private prompts** (default): Only visible to the creator
- **Public prompts**: Visible to everyone in the Explore page
- Users can toggle privacy when creating or editing prompts
- The Explore page allows searching and filtering public prompts
