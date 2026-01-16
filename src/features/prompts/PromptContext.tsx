import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { getErrorMessage } from "../../lib/errors";
import type { Prompt, Folder, Collection, Profile, Agent, PromptVersion } from "../../types/prompt";

export type { Prompt, Folder, Collection, Profile, Agent, PromptVersion };

type PromptContextType = {
  prompts: Prompt[];
  folders: Folder[];
  collections: Collection[];
  agents: Agent[];
  filteredPrompts: Prompt[];
  loading: boolean;
  error: string | null;
  isAddOpen: boolean;
  isEditOpen: boolean;
  selectedPrompt: Prompt | null;
  setIsAddOpen: (open: boolean) => void;
  setIsEditOpen: (open: boolean) => void;
  setSelectedPrompt: (prompt: Prompt | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: 'all' | 'favorites' | 'public' | 'folder') => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;

  // Prompt Actions
  addPrompt: (data: Partial<Prompt>) => Promise<void>;
  updatePrompt: (id: string, data: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  incrementCopyCount: (id: string) => Promise<void>;

  // Folder Actions
  addFolder: (name: string, icon?: string) => Promise<void>;
  updateFolder: (id: string, name: string, icon?: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  // Collection Actions
  addCollection: (name: string, description?: string, isPublic?: boolean) => Promise<void>;

  // Profile Actions
  getProfile: (username: string) => Promise<Profile | null>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;

  // Agent Actions
  addAgent: (name: string, description?: string, config?: any, isPublic?: boolean) => Promise<void>;
  updateAgent: (id: string, data: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;

  clearError: () => void;
  refetch: () => Promise<void>;
};

const PromptContext = createContext<PromptContextType | null>(null);

export function PromptProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'public' | 'folder'>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [promptsRes, foldersRes, collectionsRes, agentsRes] = await Promise.all([
        supabase.from("prompts").select("*, author:profiles(*)").order("created_at", { ascending: false }),
        supabase.from("folders").select("*").order("name", { ascending: true }),
        supabase.from("collections").select("*").order("created_at", { ascending: false }),
        supabase.from("agents").select("*").order("updated_at", { ascending: false })
      ]);

      if (promptsRes.error) throw promptsRes.error;
      if (foldersRes.error) throw foldersRes.error;
      if (collectionsRes.error) throw collectionsRes.error;
      if (agentsRes.error) throw agentsRes.error;

      setPrompts(promptsRes.data || []);
      setFolders(foldersRes.data || []);
      setCollections(collectionsRes.data || []);
      setAgents(agentsRes.data || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = prompts;
    if (filterType === 'favorites') {
      filtered = filtered.filter(p => p.is_favorite);
    } else if (filterType === 'public') {
      filtered = filtered.filter(p => p.is_public);
    } else if (filterType === 'folder' && selectedFolderId) {
      filtered = filtered.filter(p => p.folder_id === selectedFolderId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    setFilteredPrompts(filtered);
  }, [searchQuery, filterType, prompts, selectedFolderId]);

  const addPrompt = useCallback(async (data: Partial<Prompt>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Authentication required");
      const { error } = await supabase.from("prompts").insert([{ ...data, user_id: userData.user.id }]);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchData]);

  const updatePrompt = useCallback(async (id: string, data: Partial<Prompt>) => {
    try {
      const { error } = await supabase.from("prompts").update(data).eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchData]);

  const incrementCopyCount = useCallback(async (id: string) => {
    try {
      const prompt = prompts.find(p => p.id === id);
      if (!prompt) return;
      await supabase.from("prompts").update({ copy_count: (prompt.copy_count || 0) + 1 }).eq("id", id);
      setPrompts(prev => prev.map(p => p.id === id ? { ...p, copy_count: (p.copy_count || 0) + 1 } : p));
    } catch (err: any) {
      console.error("Error incrementing copy count:", err);
    }
  }, [prompts]);

  const deletePrompt = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("prompts").delete().eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchData]);

  const addFolder = useCallback(async (name: string, icon: string = 'folder') => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Authentication required");
      const { error } = await supabase.from("folders").insert([{ name, icon, user_id: userData.user.id }]);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  }, [fetchData]);

  const updateFolder = useCallback(async (id: string, name: string, icon?: string) => {
    try {
      const { error } = await supabase.from("folders").update({ name, icon }).eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  }, [fetchData]);

  const deleteFolder = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("folders").delete().eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  }, [fetchData]);

  const addCollection = useCallback(async (name: string, description?: string, isPublic: boolean = false) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Authentication required");
      const { error } = await supabase.from("collections").insert([{ name, description, is_public: isPublic, user_id: userData.user.id }]);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  }, [fetchData]);

  const getProfile = useCallback(async (username: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      return null;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Authentication required");
      const { error } = await supabase.from("profiles").update(data).eq("id", userData.user.id);
      if (error) throw error;
      if (data.username || data.full_name) {
        await supabase.auth.updateUser({
          data: {
            username: data.username,
            full_name: data.full_name,
            avatar_url: data.avatar_url,
            cover_url: data.cover_url
          }
        });
      }
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchData]);

  const addAgent = useCallback(async (name: string, description: string = "", config: any = { nodes: [], edges: [] }, isPublic: boolean = false) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Authentication required");
      const { error } = await supabase.from("agents").insert([{ name, description, config, is_public: isPublic, user_id: userData.user.id }]);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  }, [fetchData]);

  const updateAgent = useCallback(async (id: string, data: Partial<Agent>) => {
    try {
      const { error } = await supabase.from("agents").update(data).eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  }, [fetchData]);

  const deleteAgent = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("agents").delete().eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return (
    <PromptContext.Provider
      value={{
        prompts,
        folders,
        collections,
        agents,
        filteredPrompts,
        loading,
        error,
        isAddOpen,
        isEditOpen,
        selectedPrompt,
        setIsAddOpen,
        setIsEditOpen,
        setSelectedPrompt,
        searchQuery,
        setSearchQuery,
        setFilterType,
        selectedFolderId,
        setSelectedFolderId,
        addPrompt,
        updatePrompt,
        incrementCopyCount,
        deletePrompt,
        addFolder,
        updateFolder,
        deleteFolder,
        addCollection,
        addAgent,
        updateAgent,
        deleteAgent,
        getProfile,
        updateProfile,
        clearError,
        refetch,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePrompts must be used within a PromptProvider");
  }
  return context;
}