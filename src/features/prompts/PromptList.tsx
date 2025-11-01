import { usePrompts } from "./PromptContext";

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
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading prompts...
      </div>
    );

  if (!filteredPrompts || filteredPrompts.length === 0)
    return (
      <p className="text-gray-500 mt-10 text-center">
        No prompts found — try adding one or adjusting your search.
      </p>
    );

  return (
    <div className="grid gap-4 mt-6">
      {filteredPrompts.map((prompt) => (
        <div
          key={prompt.id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {prompt.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                {prompt.content}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setIsEditOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => deletePrompt(prompt.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            {new Date(prompt.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
