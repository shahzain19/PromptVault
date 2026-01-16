import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownProps {
    content: string;
    className?: string;
    isPreview?: boolean;
}

export default function Markdown({ content, className = "", isPreview = false }: MarkdownProps) {
    const rawHtml = marked.parse(content || "", { breaks: true });
    const sanitizedHtml = DOMPurify.sanitize(rawHtml as string);

    return (
        <div
            className={`prose max-w-none ${isPreview ? 'prose-sm line-clamp-4' : 'prose-base'} ${className}`}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
}
