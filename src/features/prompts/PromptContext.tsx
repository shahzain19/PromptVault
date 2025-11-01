import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { AppError, NetworkError, getErrorMessage } from "../../lib/errors";
import { validatePromptTitle, validatePromptContent, sanitizeInput } from "../../lib/validation";
import type { Prompt } from "../../types/prompt";

export type { Prompt };

type PromptContextType = {
  prompts: Prompt[];
  filteredPrompts: Prompt[];
  loading: boolean;
  error: string | null;
  isAddOpen: boolean;
  isEditOpen: boolean;
  selectedPrompt: Prompt | null;
  setIsAddOpen: (open: boolean) => void;
  setIsEditOpen: (open: boolean) => void;
  setSelectedPrompt: (prompt: Prompt | null) => void;
  setSearchQuery: (query: string) => void;
  addPrompt: (title: string, content: string, userId: string, isPublic?: boolean) => Promise<void>;
  updatePrompt: (id: string, title: string, content: string, isPublic?: boolean) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  clearError: () => void;
  refetch: () => Promise<void>;
};

const PromptContext = createContext<PromptContextType | null>(null);

export function PromptProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw new NetworkError(`Failed to fetch prompts: ${fetchError.message}`);
      }

      setPrompts(data || []);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  // Real-time filtering based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPrompts(prompts);
    } else {
      const q = searchQuery.toLowerCase().trim();
      const filtered = prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
      setFilteredPrompts(filtered);
    }
  }, [searchQuery, prompts]);

  const addPrompt = useCallback(async (title: string, content: string, userId: string, isPublic: boolean = false) => {
    try {
      setError(null);

      // Validate inputs
      const sanitizedTitle = sanitizeInput(title);
      const sanitizedContent = sanitizeInput(content);
      
      validatePromptTitle(sanitizedTitle);
      validatePromptContent(sanitizedContent);

      if (!userId) {
        throw new AppError("User ID is required");
      }

      const { error: insertError } = await supabase
        .from("prompts")
        .insert([{ 
          title: sanitizedTitle, 
          content: sanitizedContent, 
          user_id: userId,
          is_public: isPublic
        }]);

      if (insertError) {
        throw new NetworkError(`Failed to add prompt: ${insertError.message}`);
      }

      // Refetch to get the latest data
      await fetchPrompts();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      throw error;
    }
  }, [fetchPrompts]);

  const updatePrompt = useCallback(async (id: string, title: string, content: string, isPublic: boolean = false) => {
    try {
      setError(null);

      // Validate inputs
      const sanitizedTitle = sanitizeInput(title);
      const sanitizedContent = sanitizeInput(content);
      
      validatePromptTitle(sanitizedTitle);
      validatePromptContent(sanitizedContent);

      if (!id) {
        throw new AppError("Prompt ID is required");
      }

      const { error: updateError } = await supabase
        .from("prompts")
        .update({ 
          title: sanitizedTitle, 
          content: sanitizedContent,
          is_public: isPublic
        })
        .eq("id", id);

      if (updateError) {
        throw new NetworkError(`Failed to update prompt: ${updateError.message}`);
      }

      // Refetch to get the latest data
      await fetchPrompts();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      throw error;
    }
  }, [fetchPrompts]);

  const deletePrompt = useCallback(async (id: string) => {
    try {
      setError(null);

      if (!id) {
        throw new AppError("Prompt ID is required");
      }

      // Optimistic update
      const previousPrompts = prompts;
      setPrompts(prev => prev.filter(p => p.id !== id));

      const { error: deleteError } = await supabase
        .from("prompts")
        .delete()
        .eq("id", id);

      if (deleteError) {
        // Revert optimistic update
        setPrompts(previousPrompts);
        throw new NetworkError(`Failed to delete prompt: ${deleteError.message}`);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      throw error;
    }
  }, [prompts]);

  const refetch = useCallback(async () => {
    await fetchPrompts();
  }, [fetchPrompts]);

  return (
    <PromptContext.Provider
      value={{
        prompts,
        filteredPrompts,
        loading,
        error,
        isAddOpen,
        isEditOpen,
        selectedPrompt,
        setIsAddOpen,
        setIsEditOpen,
        setSelectedPrompt,
        setSearchQuery,
        addPrompt,
        updatePrompt,
        deletePrompt,
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