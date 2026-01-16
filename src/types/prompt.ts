export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  cover_url: string | null;
  is_pro: boolean;
  created_at: string;
};

export type Folder = {
  id: string;
  name: string;
  icon: string;
  user_id: string;
  created_at: string;
};

export type Prompt = {
  id: string;
  title: string;
  content: string;
  description: string | null;
  user_id: string;
  folder_id: string | null;
  is_public: boolean;
  is_favorite: boolean;
  variables: string[];
  copy_count: number;
  created_at: string;
  updated_at: string;
  tags?: string[];
  author?: Profile;
};

export type PromptVersion = {
  id: string;
  prompt_id: string;
  content: string;
  version_number: number;
  created_at: string;
};

export type Collection = {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  prompts?: Prompt[];
};

export type ApiKey = {
  id: string;
  user_id: string;
  key_hash: string;
  name: string;
  last_used_at: string | null;
  created_at: string;
};

export type Agent = {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  config: {
    nodes: any[];
    edges: any[];
  };
  is_public: boolean;
  created_at: string;
  updated_at: string;
};