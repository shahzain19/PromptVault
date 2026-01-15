import { useState, useEffect } from "react";
import { usePrompts } from "./PromptContext";
import { supabase } from "../../lib/supabaseClient";
import RichTextEditor from "../../components/RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Lock } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

type EditPromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  prompt: any;
};

export function EditPromptModal({ isOpen, onClose, prompt }: EditPromptModalProps) {
  const { refetch } = usePrompts();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setContent(prompt.content);
      setIsPublic(prompt.is_public || false);
    }
  }, [prompt]);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase
        .from("prompts")
        .update({ title: title.trim(), content: content.trim(), is_public: isPublic })
        .eq("id", prompt.id);
      if (error) throw error;

      await refetch();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 overflow-hidden selection:bg-black selection:text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !loading && onClose()}
          className="absolute inset-0 bg-white/80 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="relative w-full max-w-4xl bg-white border border-gray-100 rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-full"
        >
          <div className="p-8 sm:p-12 flex items-center justify-between border-b border-gray-50">
            <div className="space-y-1">
              <h2 className="text-3xl font-semibold tracking-tighter">Edit Prompt</h2>
              <p className="text-gray-400 font-medium tracking-tight">Refine your intelligence.</p>
            </div>
            <button
              onClick={() => !loading && onClose()}
              className="p-4 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-12">
            <div className="space-y-8">
              <input
                type="text"
                placeholder="The objective..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-4xl sm:text-5xl font-semibold tracking-tighter placeholder:text-gray-100 border-none outline-none focus:ring-0"
                required
                disabled={loading}
              />
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="The methodology..."
                disabled={loading}
                className="text-xl font-medium tracking-tight text-gray-600"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t border-gray-50">
              <div
                onClick={() => !loading && setIsPublic(!isPublic)}
                className="flex items-center gap-6 cursor-pointer group"
              >
                <div className={`p-4 rounded-3xl transition-all duration-500 ${isPublic ? 'bg-black text-white shadow-xl shadow-black/10' : 'bg-gray-50 text-gray-300'}`}>
                  {isPublic ? <Globe size={24} /> : <Lock size={24} />}
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold tracking-tight">Public Visibility</p>
                  <p className="text-sm text-gray-400 font-medium tracking-tight">
                    {isPublic ? 'Visible to the community.' : 'Stored in your private vault.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-8 py-5 border border-gray-100 rounded-full font-semibold hover:bg-gray-50 transition-all text-gray-400 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim() || !content.trim()}
                  className="flex-1 sm:flex-none px-12 py-5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-30 flex items-center justify-center min-w-[170px]"
                >
                  {loading ? <LoadingSpinner size="sm" color="white" /> : "Save Changes"}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-6 bg-red-50 rounded-3xl">
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}