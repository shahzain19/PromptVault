import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
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
import { motion, AnimatePresence } from 'framer-motion';

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

    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const formatText = (type: string) => {
    switch (type) {
      case 'bold': insertText('**', '**', 'bold text'); break;
      case 'italic': insertText('*', '*', 'italic text'); break;
      case 'code': insertText('`', '`', 'code'); break;
      case 'h1': insertText('\n# ', '', 'Heading 1'); break;
      case 'h2': insertText('\n## ', '', 'Heading 2'); break;
      case 'quote': insertText('\n> ', '', 'Quote'); break;
      case 'ul': insertText('\n- ', '', 'List item'); break;
      case 'ol': insertText('\n1. ', '', 'List item'); break;
      case 'link': insertText('[', '](url)', 'link text'); break;
    }
  };

  const renderPreview = (text: string) => {
    const rawHtml = marked.parse(text, { breaks: true }) as string;
    return DOMPurify.sanitize(rawHtml);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => formatText('bold'), title: 'Bold' },
    { icon: Italic, action: () => formatText('italic'), title: 'Italic' },
    { icon: Code, action: () => formatText('code'), title: 'Code' },
    { icon: Heading1, action: () => formatText('h1'), title: 'H1' },
    { icon: Heading2, action: () => formatText('h2'), title: 'H2' },
    { icon: Quote, action: () => formatText('quote'), title: 'Quote' },
    { icon: List, action: () => formatText('ul'), title: 'List' },
    { icon: Link, action: () => formatText('link'), title: 'Link' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              disabled={disabled || isPreview}
              className="p-3 text-gray-300 hover:text-black hover:bg-gray-50 rounded-2xl transition-all disabled:opacity-30"
              title={button.title}
            >
              <button.icon size={18} />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isPreview ? 'bg-black text-white shadow-xl shadow-black/10' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'}`}
        >
          {isPreview ? <Edit3 size={14} /> : <Eye size={14} />}
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          {isPreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="prose prose-xl prose-black max-w-none font-medium tracking-tight text-gray-600 leading-relaxed custom-markdown py-4"
              dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
            />
          ) : (
            <motion.textarea
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              className="w-full text-xl font-medium tracking-tight text-gray-600 placeholder:text-gray-100 border-none outline-none focus:ring-0 bg-transparent resize-none leading-relaxed min-h-[200px]"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-200 pt-8 border-t border-gray-50">
        <span>Markdown Supported</span>
        <span className={value.length > maxLength * 0.9 ? 'text-red-400' : ''}>
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
}