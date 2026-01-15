import { useState } from 'react';
import { Copy, Check, Eye, Edit3, Trash2 } from 'lucide-react';
import PromptViewer from './PromptViewer';
import { motion } from 'framer-motion';

type PromptCardProps = {
  title: string;
  content: string;
  date: string;
  isPublic?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PromptCard({
  title,
  content,
  date,
  isPublic = false,
  onEdit,
  onDelete,
}: PromptCardProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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
            <h3 className="text-2xl font-semibold tracking-tighter leading-tight line-clamp-2">
              {title || "Untitled"}
            </h3>
            {isPublic && (
              <span className="shrink-0 px-3 py-1 bg-gray-50 text-[10px] font-bold uppercase tracking-widest rounded-full border border-gray-100">
                Public
              </span>
            )}
          </div>
          <p className="text-gray-400 font-medium tracking-tight line-clamp-4 leading-relaxed">
            {content}
          </p>
        </div>

        <div className="pt-8 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-gray-500 transition-colors">
            {date}
          </span>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
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