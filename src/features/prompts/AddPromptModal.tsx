import { useState, useEffect, useRef } from "react";
import { usePrompts } from "./PromptContext";
import { useAuth } from "../auth/useAuth";
import { getErrorMessage, isValidationError } from "../../lib/errors";
import LoadingSpinner from "../../components/LoadingSpinner";

export function AddPromptModal() {
  const { isAddOpen, setIsAddOpen, addPrompt } = usePrompts();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  // Focus title input when modal opens
  useEffect(() => {
    if (isAddOpen) {
      titleRef.current?.focus();
    }
  }, [isAddOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isAddOpen) {
      setFormData({ title: "", content: "" });
      setFieldErrors({});
      setIsSubmitting(false);
    }
  }, [isAddOpen]);

  // Handle escape key
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length > 200) {
      errors.title = "Title must be less than 200 characters";
    }
    
    if (!formData.content.trim()) {
      errors.content = "Content is required";
    } else if (formData.content.trim().length > 10000) {
      errors.content = "Content must be less than 10,000 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setFieldErrors({ general: "You must be logged in to add prompts" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      await addPrompt(formData.title.trim(), formData.content.trim(), user.id);
      setIsAddOpen(false);
    } catch (error) {
      if (isValidationError(error)) {
        setFieldErrors({ [error.field || 'general']: error.message });
      } else {
        setFieldErrors({ general: getErrorMessage(error) });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsAddOpen(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      setIsAddOpen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scaleIn max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add a New Prompt
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddPrompt} className="space-y-4">
          <div>
            <input
              ref={titleRef}
              type="text"
              placeholder="Prompt title"
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.title
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={isSubmitting}
              maxLength={200}
              aria-invalid={!!fieldErrors.title}
              aria-describedby={fieldErrors.title ? "title-error" : undefined}
            />
            {fieldErrors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.title}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/200 characters
            </p>
          </div>

          <div>
            <textarea
              placeholder="Write your prompt..."
              className={`w-full border p-3 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.content
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              disabled={isSubmitting}
              maxLength={10000}
              aria-invalid={!!fieldErrors.content}
              aria-describedby={fieldErrors.content ? "content-error" : undefined}
            />
            {fieldErrors.content && (
              <p id="content-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.content}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.content.length}/10,000 characters
            </p>
          </div>

          {fieldErrors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{fieldErrors.general}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                "Add Prompt"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}