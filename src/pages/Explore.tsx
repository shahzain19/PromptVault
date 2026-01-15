import { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import ExplorePromptCard from "../components/ExplorePromptCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import type { Prompt } from "../types/prompt";
import { motion } from "framer-motion";

type SortOption = "newest" | "oldest";

export default function Explore() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery] = useState("");
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tighter">Explore</h1>
              <p className="text-gray-400 font-medium tracking-tight">Discover shared intelligence.</p>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100">
              <button
                onClick={() => setSortBy("newest")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${sortBy === 'newest' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy("oldest")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${sortBy === 'oldest' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
              >
                Oldest
              </button>
            </div>
          </motion.div>

          {error ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-red-500 font-semibold uppercase tracking-widest text-xs">Error fetching prompts</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="py-32 text-center flex flex-col items-center gap-6">
              <div className="p-6 bg-gray-50 rounded-3xl text-gray-200">
                <Compass size={40} />
              </div>
              <p className="text-gray-400 font-medium tracking-tight">
                {searchQuery ? "No results found for your search." : "The community is quiet. For now."}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPrompts.map((prompt) => (
                <ExplorePromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  content={prompt.content}
                  date={new Date(prompt.created_at).toLocaleDateString()}
                  authorName={prompt.author_name || "Anonymous"}
                  tags={prompt.tags}
                  copyCount={prompt.copy_count}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
