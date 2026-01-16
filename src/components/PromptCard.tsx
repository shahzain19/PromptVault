import { useState } from 'react';
import { Copy, Check, Edit3, Trash2, Star } from 'lucide-react';
import { usePrompts } from '../features/prompts/PromptContext';
import PromptViewer from './PromptViewer';
import { motion } from 'framer-motion';
import Markdown from './Markdown';

type PromptCardProps = {
  id: string;
  title: string;
  content: string;
  description?: string | null;
  date: string;
  isPublic?: boolean;
  tags?: string[];
  isFavorite?: boolean;
  copyCount?: number;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PromptCard({
  id,
  title,
  content,
  description,
  date,
  isPublic = false,
  tags = [],
  isFavorite = false,
  copyCount = 0,
  onEdit,
  onDelete,
}: PromptCardProps) {
  const { incrementCopyCount, updatePrompt } = usePrompts();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      incrementCopyCount(id);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updatePrompt(id, { is_favorite: !isFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <>
      <PromptViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        title={title}
        content={content}
        date={date}
      />
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsViewerOpen(true)}
        className="group relative bg-white border border-gray-100 p-8 rounded-[32px] hover:border-black transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[320px] selection:bg-black selection:text-white"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tighter leading-tight line-clamp-2">
                {title || "Untitled"}
              </h3>
              {description && (
                <p className="text-sm text-gray-400 font-medium tracking-tight line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            {isPublic && (
              <span className="shrink-0 px-3 py-1 bg-gray-50 text-[10px] font-bold uppercase tracking-widest rounded-full border border-gray-100">
                Public
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-50 text-[10px] font-bold uppercase tracking-widest rounded-md text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="text-gray-400 font-medium tracking-tight">
            <Markdown content={content} isPreview={true} />
          </div>
        </div>

        <div className="pt-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-gray-500 transition-colors">
              {date}
            </span>
            {copyCount > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
                {copyCount} copies
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={toggleFavorite}
              className={`p-3 rounded-full transition-all ${isFavorite ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'}`}
              title={isFavorite ? "Unfavorite" : "Favorite"}
            >
              <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={copyToClipboard}
              className={`p-3 rounded-full transition-all ${copied ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'}`}
              title="Copy prompt"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-3 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
              title="Edit prompt"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Delete prompt"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}