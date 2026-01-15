import { usePrompts } from "./PromptContext";
import PromptCard from "../../components/PromptCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { motion } from "framer-motion";

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
      <div className="flex flex-col justify-center items-center py-32">
        <LoadingSpinner size="lg" color="black" />
        <p className="text-gray-400 font-medium tracking-tight mt-6">Loading prompts...</p>
      </div>
    );

  if (!filteredPrompts || filteredPrompts.length === 0)
    return (
      <div className="text-center py-32 space-y-8 border-2 border-dashed border-gray-100 rounded-[40px]">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tighter">No prompts found.</h3>
          <p className="text-gray-400 font-medium tracking-tight max-w-xs mx-auto">
            Your collection is currently empty. Start building your knowledge base.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-black/5">
          Press Ctrl + N to start
        </div>
      </div>
    );

  const handleDelete = async (promptId: string) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      try {
        await deletePrompt(promptId);
      } catch (error) {
        console.error("Failed to delete prompt:", error);
      }
    }
  };

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {filteredPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          title={prompt.title}
          content={prompt.content}
          date={new Date(prompt.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
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
