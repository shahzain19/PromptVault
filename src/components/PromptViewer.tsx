import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  date: string;
}

export default function PromptViewer({ isOpen, onClose, title, content, date }: PromptViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderFormattedContent = (text: string) => {
    const rawHtml = marked.parse(text, { breaks: true }) as string;
    return DOMPurify.sanitize(rawHtml);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-12 overflow-hidden selection:bg-black selection:text-white">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/90 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="relative w-full max-w-5xl bg-white border border-gray-100 rounded-[48px] shadow-2xl flex flex-col max-h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 sm:p-12 flex items-start justify-between border-b border-gray-50">
              <div className="space-y-4 max-w-3xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{date}</span>
                <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter leading-tight">
                  {title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={copyToClipboard}
                  className={`p-4 rounded-full transition-all ${copied ? 'bg-black text-white shadow-xl shadow-black/10' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'}`}
                  title="Copy prompt"
                >
                  {copied ? <Check size={24} /> : <Copy size={24} />}
                </button>
                <button
                  onClick={onClose}
                  className="p-4 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-24">
              <div
                className="prose prose-2xl prose-black max-w-none font-medium tracking-tight text-gray-600 leading-relaxed custom-markdown"
                dangerouslySetInnerHTML={{ __html: renderFormattedContent(content) }}
              />
            </div>

            {/* Footer gradient */}
            <div className="h-12 bg-gradient-to-t from-white pointer-events-none absolute bottom-0 left-0 right-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}