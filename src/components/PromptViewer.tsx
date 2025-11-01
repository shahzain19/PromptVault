import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

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
    // Enhanced markdown-like rendering
    let html = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-3 border-b border-gray-200 pb-1">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3 border-b border-gray-200 pb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-800 mt-6 mb-4 border-b-2 border-gray-300 pb-2">$1</h1>')
      
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      
      // Code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border">$1</code>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 border"><code class="text-sm font-mono whitespace-pre">$1</code></pre>')
      
      // Quotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 italic text-gray-700 my-3 rounded-r">$1</blockquote>')
      
      // Unordered Lists
      .replace(/^- (.*$)/gm, '<li class="ml-6 mb-1 relative"><span class="absolute -left-4 text-blue-500">•</span>$1</li>')
      
      // Ordered Lists
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-6 mb-1 list-decimal">$1</li>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Paragraphs (double line breaks)
      .replace(/\n\n/g, '</p><p class="mb-4">')
      
      // Single line breaks
      .replace(/\n/g, '<br>');

    return `<p class="mb-4">${html}</p>`;
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