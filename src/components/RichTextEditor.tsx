import { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Code, 
  List, 
  ListOrdered, 
  Quote,
  Heading1,
  Heading2,
  Link,
  Eye,
  Edit3
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your prompt...",
  disabled = false,
  className = "",
  maxLength = 10000
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  }, [value]);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const formatText = (type: string) => {
    switch (type) {
      case 'bold':
        insertText('**', '**', 'bold text');
        break;
      case 'italic':
        insertText('*', '*', 'italic text');
        break;
      case 'code':
        insertText('`', '`', 'code');
        break;
      case 'codeblock':
        insertText('\n```\n', '\n```\n', 'code block');
        break;
      case 'h1':
        insertText('\n# ', '', 'Heading 1');
        break;
      case 'h2':
        insertText('\n## ', '', 'Heading 2');
        break;
      case 'quote':
        insertText('\n> ', '', 'Quote');
        break;
      case 'ul':
        insertText('\n- ', '', 'List item');
        break;
      case 'ol':
        insertText('\n1. ', '', 'List item');
        break;
      case 'link':
        insertText('[', '](url)', 'link text');
        break;
    }
  };

  const renderPreview = (text: string) => {
    // Simple markdown-like rendering
    let html = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-800 mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-800 mt-4 mb-2">$1</h1>')
      
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2"><code class="text-sm font-mono">$1</code></pre>')
      
      // Quotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-2">$1</blockquote>')
      
      // Lists
      .replace(/^\- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Line breaks
      .replace(/\n/g, '<br>');

    return html;
  };

  const toolbarButtons = [
    { icon: Bold, action: () => formatText('bold'), title: 'Bold (Ctrl+B)' },
    { icon: Italic, action: () => formatText('italic'), title: 'Italic (Ctrl+I)' },
    { icon: Code, action: () => formatText('code'), title: 'Inline Code' },
    { icon: Heading1, action: () => formatText('h1'), title: 'Heading 1' },
    { icon: Heading2, action: () => formatText('h2'), title: 'Heading 2' },
    { icon: Quote, action: () => formatText('quote'), title: 'Quote' },
    { icon: List, action: () => formatText('ul'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => formatText('ol'), title: 'Numbered List' },
    { icon: Link, action: () => formatText('link'), title: 'Link' },
  ];

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'k':
          e.preventDefault();
          formatText('link');
          break;
      }
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-3 py-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              disabled={disabled}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-colors disabled:opacity-50"
              title={button.title}
            >
              <button.icon size={16} />
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-colors ${
              isPreview 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
          >
            {isPreview ? <Edit3 size={12} /> : <Eye size={12} />}
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-3 min-h-[120px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="w-full p-3 min-h-[120px] resize-none focus:outline-none bg-white"
            style={{ minHeight: '120px' }}
          />
        )}
      </div>

      {/* Character count */}
      <div className="flex justify-between items-center bg-gray-50 border-t border-gray-200 px-3 py-1 text-xs text-gray-500">
        <div className="text-gray-400">
          Supports **bold**, *italic*, `code`, # headers, quotes, - lists, [links](url)
        </div>
        <div>
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
}