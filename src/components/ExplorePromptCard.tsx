import { useState } from 'react';
import { Copy, Check, User } from 'lucide-react';
import { usePrompts } from '../features/prompts/PromptContext';
import PromptViewer from './PromptViewer';
import { motion } from 'framer-motion';

type ExplorePromptCardProps = {
  id: string;
  title: string;
  content: string;
  date: string;
  authorName: string;
  tags?: string[];
  copyCount?: number;
};

export default function ExplorePromptCard({
  id,
  title,
  content,
  date,
  authorName,
  tags = [],
  copyCount = 0,
}: ExplorePromptCardProps) {
  const { incrementCopyCount } = usePrompts();
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsViewerOpen(true)}
        className="group relative bg-white border border-gray-100 p-8 rounded-[32px] hover:border-black transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[320px] selection:bg-black selection:text-white overflow-hidden"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
              <User size={10} className="text-gray-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{authorName}</span>
          </div>

          <h3 className="text-2xl font-semibold tracking-tighter leading-tight line-clamp-2">
            {title || "Untitled"}
          </h3>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-50 text-[10px] font-bold uppercase tracking-widest rounded-md text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-400 font-medium tracking-tight line-clamp-4 leading-relaxed">
            {content}
          </p>
        </div>

        <div className="pt-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
              {date}
            </span>
            {copyCount > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
                {copyCount} copies
              </span>
            )}
          </div>

          <button
            onClick={copyToClipboard}
            className={`opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 p-3 rounded-full ${copied ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'}`}
            title="Copy prompt"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </motion.div>
    </>
  );
}