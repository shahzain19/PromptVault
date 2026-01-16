import express from 'express';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Supabase with service role to bypass RLS for API key validation
const supabase = createClient(
    "https://flevgwciyphpwxmuhmyr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZXZnd2NpeXBocHd4bXVobXlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTk4NDQxNSwiZXhwIjoyMDc3NTYwNDE1fQ.BQZSTfUJNASxI3zzQ7vx8KSIiucjNOoxf6XT3JMTGFI"
);

app.use(express.json());

// Middleware to validate API Key
async function authenticateApiKey(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const apiKey = authHeader.split(' ')[1];

    try {
        // In a production app, you would hash the incoming 'apiKey' and compare with key_hash
        // For this reference, we're doing a direct lookup since we stored masked keys (demo logic)
        const { data: keyRecord, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('key_hash', apiKey) // Mock logic: in reality, contrast with a hash function
            .single();

        if (error || !keyRecord) {
            return res.status(403).json({ error: 'Unauthorized: Invalid API Key' });
        }

        // Update last_used_at
        await supabase
            .from('api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', keyRecord.id);

        req.user_id = keyRecord.user_id;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// GET /api/prompts
app.get('/api/prompts', authenticateApiKey, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('prompts')
            .select('id, title, content, description, tags, variables, created_at')
            .eq('user_id', req.user_id);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/prompts/:id
app.get('/api/prompts/:id', authenticateApiKey, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('prompts')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user_id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Prompt not found' });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`PromptVault API Reference Server running at http://localhost:${port}`);
});
