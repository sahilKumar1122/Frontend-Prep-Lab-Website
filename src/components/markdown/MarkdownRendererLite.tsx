'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { memo } from 'react';

/**
 * Lightweight markdown renderer WITHOUT syntax highlighting
 * Use this for previews or non-code content
 */

interface MarkdownRendererLiteProps {
  content: string;
  className?: string;
}

function MarkdownRendererLiteComponent({ content, className = '' }: MarkdownRendererLiteProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, children }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
            const codeString = String(children).replace(/\n$/, '');

            // Inline code
            if (inline) {
              return (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:bg-slate-800 dark:text-pink-400">
                  {children}
                </code>
              );
            }

            // Block code - simple styling without syntax highlighting
            return (
              <pre className="my-4 overflow-x-auto rounded-lg bg-slate-900 p-4">
                <code className="text-sm text-slate-100">
                  {codeString}
                </code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownRendererLite = memo(MarkdownRendererLiteComponent);
MarkdownRendererLite.displayName = 'MarkdownRendererLite';

