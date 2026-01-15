import { X, Copy, Check, Type } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [variableList, setVariableList] = useState<string[]>([]);

  useEffect(() => {
    const matches = content.match(/{{(.*?)}}/g);
    if (matches) {
      const uniqueVars = Array.from(new Set(matches.map(m => m.slice(2, -2).trim())));
      setVariableList(uniqueVars);
      const initialVars: Record<string, string> = {};
      uniqueVars.forEach(v => initialVars[v] = "");
      setVariables(initialVars);
    } else {
      setVariableList([]);
      setVariables({});
    }
  }, [content, isOpen]);

  const getProcessedContent = () => {
    let processed = content;
    Object.entries(variables).forEach(([key, value]) => {
      if (value) {
        processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    });
    return processed;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getProcessedContent());
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
            transition={{ duration: 0.8, ease: "circOut" }}
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
                dangerouslySetInnerHTML={{ __html: renderFormattedContent(getProcessedContent()) }}
              />

              {variableList.length > 0 && (
                <div className="mt-24 pt-24 border-t border-gray-50 space-y-12">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-black">
                      <Type size={20} />
                      <h3 className="text-xl font-semibold tracking-tight">Variables</h3>
                    </div>
                    <p className="text-gray-400 font-medium tracking-tight">Fill these placeholders to personalize the prompt.</p>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2">
                    {variableList.map(v => (
                      <div key={v} className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{v}</label>
                        <input
                          type="text"
                          placeholder={`Enter ${v}...`}
                          value={variables[v]}
                          onChange={(e) => setVariables(prev => ({ ...prev, [v]: e.target.value }))}
                          className="w-full py-4 border-b border-gray-100 outline-none focus:border-black transition-colors text-xl font-medium tracking-tight placeholder:text-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer gradient */}
            <div className="h-12 bg-gradient-to-t from-white pointer-events-none absolute bottom-0 left-0 right-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}