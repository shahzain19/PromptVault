# Quick Setup for Privacy Features

## 🚀 Quick Start

To enable the privacy features and Explore page, you need to add one column to your existing `prompts` table in Supabase.

### Step 1: Add Privacy Column

Go to your Supabase dashboard → SQL Editor and run this query:

```sql
ALTER TABLE prompts 
ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
```

### Step 2: Update RLS Policy (if needed)

If you have Row Level Security enabled, update the policy to allow reading public prompts:

```sql
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view own prompts" ON prompts;

-- Create new policy that allows viewing own prompts OR public prompts
CREATE POLICY "Users can view own prompts and public prompts" 
ON prompts FOR SELECT 
USING (auth.uid() = user_id OR is_public = true);
```

### Step 3: Test the Features

1. **Create a prompt** and mark it as "Public" using the toggle
2. **Visit the Explore page** to see public prompts from the community
3. **Search and filter** public prompts

## ✅ That's it!

Your PromptVault now supports:
- ✅ Private prompts (default)
- ✅ Public prompts (shareable)
- ✅ Community Explore page
- ✅ Search and discovery

## 🔧 Optional Enhancements

For better author names instead of user IDs, see the full `DATABASE_SCHEMA.md` file for profiles table setup.