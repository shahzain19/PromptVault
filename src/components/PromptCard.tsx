import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import PromptViewer from './PromptViewer';

type PromptCardProps = {
  title: string;
  content: string;
  date: string;
  isPublic?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

// Function to render formatted markdown for card preview
const renderCardPreview = (text: string): string => {
  if (!text || text.trim() === '') return 'No content available.';
  
  // First, let's clean up the text and limit length more intelligently
  let processedText = text.trim();
  
  // If text is too long, truncate at word boundary
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
    // Code blocks first (to avoid conflicts)
    .replace(/```[\s\S]*?```/g, '<span class="inline-block bg-gray-800 text-white px-2 py-1 rounded text-xs font-mono mr-1">Code</span>')
    
    // Headers - simplified for card view
    .replace(/^### (.*$)/gm, '<span class="font-semibold text-gray-800">$1</span>')
    .replace(/^## (.*$)/gm, '<span class="font-semibold text-gray-800">$1</span>')
    .replace(/^# (.*$)/gm, '<span class="font-bold text-gray-800">$1</span>')
    
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    
    // Quotes - simplified
    .replace(/^> (.*$)/gm, '<span class="text-blue-700 italic border-l-2 border-blue-300 pl-2">$1</span>')
    
    // Lists - convert to simple format
    .replace(/^- (.*$)/gm, '• $1')
    .replace(/^\d+\. (.*$)/gm, '$1')
    
    // Links - show as colored text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '<span class="text-blue-600 font-medium">$1</span>')
    
    // Clean up multiple line breaks
    .replace(/\n\n+/g, ' ')
    .replace(/\n/g, ' ')
    
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
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
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-gray-800 transition-colors">
                {title || "Untitled"}
              </h3>
              {isPublic && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Public
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
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
            
            <button
              onClick={onEdit}
              className="action-button p-2 text-blue-600 hover:text-blue-700 rounded-lg focus-ring bounce-on-hover"
              title="Edit prompt"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={onDelete}
              className="action-button p-2 text-red-500 hover:text-red-600 rounded-lg focus-ring bounce-on-hover"
              title="Delete prompt"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
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