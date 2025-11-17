import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

interface MarkdownRendererSimpleProps {
  content: string;
  className?: string;
}

// Configure marked once
marked.setOptions({
  gfm: true,
  breaks: true,
});

export async function MarkdownRendererSimple({ content, className = '' }: MarkdownRendererSimpleProps) {
  // Parse markdown to HTML (synchronously)
  const rawHtml = marked.parse(content) as string;
  
  // Sanitize HTML to prevent XSS
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  return (
    <div 
      className={`prose prose-slate dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}

