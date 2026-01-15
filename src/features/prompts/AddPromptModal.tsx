import { useState, useEffect, useRef } from "react";
import { usePrompts } from "./PromptContext";
import { useAuth } from "../auth/useAuth";
import { getErrorMessage, isValidationError } from "../../lib/errors";
import LoadingSpinner from "../../components/LoadingSpinner";
import RichTextEditor from "../../components/RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Lock } from "lucide-react";

export function AddPromptModal() {
  const { isAddOpen, setIsAddOpen, addPrompt } = usePrompts();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublic: false,
    tags: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddOpen) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isAddOpen]);

  useEffect(() => {
    if (!isAddOpen) {
      setFormData({ title: "", content: "", isPublic: false, tags: "" });
      setFieldErrors({});
      setIsSubmitting(false);
    }
  }, [isAddOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAddOpen && !isSubmitting) {
        setIsAddOpen(false);
      }
    };
    if (isAddOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isAddOpen, isSubmitting, setIsAddOpen]);

  if (!isAddOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.content.trim()) errors.content = "Content is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFieldErrors({ general: "Authentication required" });
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      await addPrompt(
        formData.title.trim(),
        formData.content.trim(),
        user.id,
        formData.isPublic,
        formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      );
      setIsAddOpen(false);
    } catch (error) {
      if (isValidationError(error)) {
        setFieldErrors({ [error.field || "general"]: error.message });
      } else {
        setFieldErrors({ general: getErrorMessage(error) });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 overflow-hidden selection:bg-black selection:text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isSubmitting && setIsAddOpen(false)}
          className="absolute inset-0 bg-white/80 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="relative w-full max-w-4xl bg-white border border-gray-100 rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-full"
        >
          <div className="p-8 sm:p-12 flex items-center justify-between border-b border-gray-50">
            <div className="space-y-1">
              <h2 className="text-3xl font-semibold tracking-tighter">New Prompt</h2>
              <p className="text-gray-400 font-medium tracking-tight">Expand your knowledge base.</p>
            </div>
            <button
              onClick={() => !isSubmitting && setIsAddOpen(false)}
              className="p-4 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleAddPrompt} className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <input
                  ref={titleRef}
                  type="text"
                  placeholder="The objective..."
                  className="w-full text-4xl sm:text-5xl font-semibold tracking-tighter placeholder:text-gray-100 border-none outline-none focus:ring-0"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={isSubmitting}
                />
                {fieldErrors.title && <p className="text-xs font-bold uppercase tracking-widest text-red-500">{fieldErrors.title}</p>}
              </div>

              <div className="space-y-4">
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => handleInputChange("content", value)}
                  placeholder="The methodology..."
                  disabled={isSubmitting}
                  className="text-xl font-medium tracking-tight text-gray-600"
                />
                {fieldErrors.content && <p className="text-xs font-bold uppercase tracking-widest text-red-500">{fieldErrors.content}</p>}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tags (comma separated)..."
                  className="w-full text-xl font-medium tracking-tight text-gray-400 placeholder:text-gray-100 border-none outline-none focus:ring-0"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t border-gray-50">
              <div
                onClick={() => !isSubmitting && handleInputChange("isPublic", !formData.isPublic)}
                className="flex items-center gap-6 cursor-pointer group"
              >
                <div className={`p-4 rounded-3xl transition-all duration-500 ${formData.isPublic ? 'bg-black text-white shadow-xl shadow-black/10' : 'bg-gray-50 text-gray-300'}`}>
                  {formData.isPublic ? <Globe size={24} /> : <Lock size={24} />}
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold tracking-tight">Public Visibility</p>
                  <p className="text-sm text-gray-400 font-medium tracking-tight">
                    {formData.isPublic ? 'Visible to the community.' : 'Stored in your private vault.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => !isSubmitting && setIsAddOpen(false)}
                  className="flex-1 sm:flex-none px-8 py-5 border border-gray-100 rounded-full font-semibold hover:bg-gray-50 transition-all text-gray-400 hover:text-black"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="flex-1 sm:flex-none px-12 py-5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-30 flex items-center justify-center min-w-[160px]"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Save Prompt"}
                </button>
              </div>
            </div>

            {fieldErrors.general && (
              <div className="p-6 bg-red-50 rounded-3xl">
                <p className="text-sm text-red-600 font-semibold">{fieldErrors.general}</p>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
