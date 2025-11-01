import { usePrompts } from "./PromptContext";
import PromptCard from "../../components/PromptCard";
import LoadingSpinner from "../../components/LoadingSpinner";

type PromptListProps = {
  setSelectedPrompt: (prompt: any) => void;
  setIsEditOpen: (open: boolean) => void;
};

export default function PromptList({
  setSelectedPrompt,
  setIsEditOpen,
}: PromptListProps) {
  const { filteredPrompts, deletePrompt, loading } = usePrompts();

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <div className="relative loading-container">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 shadow-soft">
            <LoadingSpinner size="lg" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
        </div>
        <p className="text-gray-600 font-medium">Loading your prompts...</p>
        <p className="text-gray-400 text-sm mt-1">This won't take long</p>
      </div>
    );

  if (!filteredPrompts || filteredPrompts.length === 0)
    return (
      <div className="text-center py-16 empty-state-container">
        <div className="relative inline-block">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl flex items-center justify-center border border-gray-100 shadow-soft scale-on-hover">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 gradient-text">
          No prompts found
        </h3>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          Get started by creating your first prompt, or try adjusting your
          search terms to find what you're looking for.
        </p>

        <div className="mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium shadow-soft bounce-on-hover">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Press Ctrl+N to create a new prompt
          </div>
        </div>
      </div>
    );

  const handleDelete = async (promptId: string) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      try {
        await deletePrompt(promptId);
      } catch (error) {
        console.error("Failed to delete prompt:", error);
        // You could add a toast notification here
      }
    }
  };

  return (
    <div className="prompts-grid mt-8">
      {filteredPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          title={prompt.title}
          content={prompt.content}
          date={new Date(prompt.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
          isPublic={prompt.is_public}
          onEdit={() => {
            setSelectedPrompt(prompt);
            setIsEditOpen(true);
          }}
          onDelete={() => handleDelete(prompt.id)}
        />
      ))}
    </div>
  );
}
