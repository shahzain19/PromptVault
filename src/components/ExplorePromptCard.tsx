import { useState } from 'react';
import { Copy, Check, User, Globe } from 'lucide-react';
import PromptViewer from './PromptViewer';

type ExplorePromptCardProps = {
  title: string;
  content: string;
  date: string;
  authorName: string;
};

// Function to render formatted markdown for card preview
const renderCardPreview = (text: string): string => {
  if (!text || text.trim() === '') return 'No content available.';
  
  let processedText = text.trim();
  
  if (processedText.length > 180) {
    processedText = processedText.substring(0, 180);
    const lastSpace = processedText.lastIndexOf(' ');
    if (lastSpace > 100) {
      processedText = processedText.substring(0, lastSpace) + '...';
    } else {
      processedText = processedText + '...';
    }
  }
  
  return processedText
    .replace(/```[\s\S]*?```/g, '<span class="inline-block bg-gray-800 text-white px-2 py-1 rounded text-xs font-mono mr-1">Code</span>')
    .replace(/^### (.*$)/gm, '<span class="font-semibold text-gray-800">$1</span>')
    .replace(/^## (.*$)/gm, '<span class="font-semibold text-gray-800">$1</span>')
    .replace(/^# (.*$)/gm, '<span class="font-bold text-gray-800">$1</span>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/^> (.*$)/gm, '<span class="text-blue-700 italic border-l-2 border-blue-300 pl-2">$1</span>')
    .replace(/^- (.*$)/gm, '• $1')
    .replace(/^\d+\. (.*$)/gm, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '<span class="text-blue-600 font-medium">$1</span>')
    .replace(/\n\n+/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function ExplorePromptCard({
  title,
  content,
  date,
  authorName,
}: ExplorePromptCardProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
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

  return (
    <>
      <PromptViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        title={title}
        content={content}
        date={date}
      />
      
      <div className="group prompt-card relative overflow-hidden rounded-2xl shadow-soft hover:shadow-soft-lg">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative p-6">
          {/* Badges */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <User size={12} />
                {authorName}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
              <Globe size={12} />
              Public
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate pr-2 group-hover:text-gray-800 transition-colors">
                {title || "Untitled"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                <p className="text-xs text-gray-500 font-medium">{date}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={() => setIsViewerOpen(true)}
                className="action-button p-2 text-emerald-600 hover:text-emerald-700 rounded-lg focus-ring bounce-on-hover"
                title="View full prompt"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button
                onClick={copyToClipboard}
                className={`action-button p-2 rounded-lg focus-ring bounce-on-hover transition-colors duration-200 ${
                  copied 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-gray-700'
                }`}
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Content preview */}
          <div 
            className="content-preview text-gray-600 text-sm leading-relaxed line-clamp-3 cursor-pointer hover:text-gray-700 transition-colors duration-200 mb-4"
            onClick={() => setIsViewerOpen(true)}
            dangerouslySetInnerHTML={{ 
              __html: content ? renderCardPreview(content) : "No content available." 
            }}
          />

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </>
  );
}