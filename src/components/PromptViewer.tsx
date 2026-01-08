import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface PromptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  date: string;
}

export default function PromptViewer({ isOpen, onClose, title, content, date }: PromptViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-gray-900 truncate">
              {title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{date}</p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderFormattedContent(content) }}
          />
        </div>
      </div>
    </div>
  );
}