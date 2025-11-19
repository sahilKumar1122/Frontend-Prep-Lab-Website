'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React from 'react';
import dynamic from 'next/dynamic';

// Lazy load code highlighter only when code blocks are rendered
const CodeBlock = dynamic(() => import('./CodeBlock').then(mod => ({ default: mod.CodeBlock })));

const Mermaid = dynamic(() => import('./MermaidChart').then(mod => ({ default: mod.MermaidChart })));

interface MarkdownRendererCoreProps {
  content: string;
  className?: string;
}

export function MarkdownRendererCore({ content, className = '' }: MarkdownRendererCoreProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none prose-pre:my-0 prose-pre:p-0 prose-pre:bg-transparent ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const codeString = String(children).replace(/\n$/, '');
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            // Inline code
            if (inline) {
              return (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:bg-slate-800 dark:text-pink-400">
                  {children}
                </code>
              );
            }

            // Check if it's a mermaid diagram
            if (language === 'mermaid') {
              return <Mermaid chart={codeString} />;
            }

            // Code block with syntax highlighting
            return <CodeBlock language={language} value={codeString} />;
          },
          h1: ({ children }) => (
            <h1 className="mb-6 mt-8 text-4xl font-bold text-slate-900 dark:text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 mt-8 text-3xl font-bold text-slate-900 dark:text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-6 text-2xl font-semibold text-slate-900 dark:text-white">
              {children}
            </h3>
          ),
          p: ({ children }: any) => {
            // Don't wrap paragraphs at all - let react-markdown handle structure
            // This prevents div-in-p errors for code blocks
            return (
              <div className="mb-4 leading-7 text-slate-700 dark:text-slate-300">
                {children}
              </div>
            );
          },
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 text-slate-700 dark:text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 text-slate-700 dark:text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-7">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-blue-500 bg-blue-50 py-3 pl-4 pr-4 italic text-slate-700 dark:border-blue-400 dark:bg-blue-950 dark:text-slate-300">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 dark:bg-slate-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr>{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
              {children}
            </td>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          hr: () => (
            <hr className="my-8 border-slate-200 dark:border-slate-700" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

