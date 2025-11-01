import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import ExplorePromptCard from "../components/ExplorePromptCard";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Prompt } from "../types/prompt";

type SortOption = "newest" | "oldest";

export default function Explore() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: sortBy === "oldest" });

      if (error) setError(error.message);
      else {
        const withAuthors = (data || []).map((p) => ({
          ...p,
          author_name: `User ${p.user_id.slice(0, 8)}`,
        }));
        setPrompts(withAuthors);
        setFilteredPrompts(withAuthors);
      }
      setLoading(false);
    };
    fetchPrompts();
  }, [sortBy]);

  useEffect(() => {
    if (!searchQuery.trim()) return setFilteredPrompts(prompts);
    const q = searchQuery.toLowerCase();
    setFilteredPrompts(
      prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author_name?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, prompts]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-gray-600">
        <p className="text-lg font-semibold mb-1">Error fetching prompts</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Prompts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Discover public prompts shared by the community.
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <Search className="mx-auto mb-4 w-10 h-10 text-gray-400" />
            {searchQuery ? "No results found." : "No public prompts yet."}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <ExplorePromptCard
                key={prompt.id}
                title={prompt.title}
                content={prompt.content}
                date={new Date(prompt.created_at).toLocaleDateString()}
                authorName={prompt.author_name || "Anonymous"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}