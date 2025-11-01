type PromptCardProps = {
  title: string;
  content: string;
  date: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PromptCard({
  title,
  content,
  date,
  onEdit,
  onDelete,
}: PromptCardProps) {
  return (
    <div className="group border border-gray-200 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all hover:-translate-y-[2px]">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 truncate max-w-[80%]">
          {title || "Untitled"}
        </h3>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 font-medium text-sm rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3">
        {content || "No content available."}
      </p>

      <p className="text-xs text-gray-400 mt-3">{date}</p>
    </div>
  );
}