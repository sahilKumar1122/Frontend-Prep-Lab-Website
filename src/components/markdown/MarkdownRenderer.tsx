'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import dynamic from 'next/dynamic';

// Lazy load SyntaxHighlighter to reduce initial bundle size
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.Prism),
  {
    loading: () => (
      <div className="my-6 rounded-xl border border-slate-200 bg-slate-100 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="text-slate-600 dark:text-slate-400">Loading code...</div>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load the style as well
const loadVscDarkPlus = async () => {
  const mod = await import('react-syntax-highlighter/dist/esm/styles/prism');
  return mod.vscDarkPlus;
};

interface MermaidProps {
  chart: string;
}

function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      
      try {
        // Dynamically import mermaid only on the client side
        const mermaid = (await import('mermaid')).default;
        
        // Always use light theme for mermaid diagrams
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#1e293b',
            primaryBorderColor: '#cbd5e1',
            lineColor: '#64748b',
            secondaryColor: '#f1f5f9',
            tertiaryColor: '#e2e8f0',
            background: '#ffffff',
            mainBkgColor: '#f8fafc',
            secondBkgColor: '#f1f5f9',
            textColor: '#1e293b',
          },
        });

        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(false);
      } catch (err) {
        console.error('Error rendering mermaid chart:', err);
        setError(true);
      }
    };
    
    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="my-3 rounded-lg bg-red-50 p-6 text-center">
        <div className="text-red-600">
          Error rendering diagram
        </div>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-3 rounded-lg bg-slate-50 p-6 text-center">
        <div className="text-slate-600">Loading diagram...</div>
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className="my-3 flex justify-center overflow-x-auto rounded-lg bg-white p-6"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<Record<string, React.CSSProperties> | null>(null);

  useEffect(() => {
    loadVscDarkPlus().then(setStyle);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-slate-200 bg-[#1e1e1e] shadow-lg dark:border-slate-800">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-[#2d2d30] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
          </div>
          {language && (
            <span className="ml-2 text-xs font-semibold text-slate-400">
              {language.toUpperCase()}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-slate-600 active:scale-95"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'text'}
          style={style || undefined}
          showLineNumbers={value.split('\n').length > 3}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: '#1e1e1e',
            fontSize: '0.875rem',
            lineHeight: '1.7',
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#858585',
            userSelect: 'none',
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override pre to prevent wrapping
          pre({ children }) {
            return <>{children}</>;
          },
          code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            // Handle mermaid diagrams
            if (language === 'mermaid') {
              return <Mermaid chart={codeString} />;
            }

            // Handle regular code blocks
            if (!inline) {
              return <CodeBlock language={language} value={codeString} />;
            }

            // Inline code
            return (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:bg-slate-800 dark:text-pink-400" {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="mb-4 mt-8 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              {children}
            </h4>
          ),
          p: ({ children, node }: { children?: React.ReactNode; node?: { children?: Array<{ type?: string; tagName?: string }> } }) => {
            // Check if paragraph contains code blocks or other block elements
            // This prevents hydration errors from <div> inside <p>
            const hasBlockElement = node?.children?.some((child: { type?: string; tagName?: string }) => {
              // Check for code blocks (non-inline code)
              if (child.type === 'element' && child.tagName === 'code') {
                return true;
              }
              // Check for pre tags
              if (child.type === 'element' && child.tagName === 'pre') {
                return true;
              }
              return false;
            });
            
            // Also check if children contains any React elements that are block-level
            const childrenArray = React.Children.toArray(children);
            const hasBlockChild = childrenArray.some((child: React.ReactNode) => {
              // Check if it's a React element with div/pre or custom components
              if (React.isValidElement(child)) {
                const type = child.type;
                if (typeof type === 'string') {
                  return ['div', 'pre', 'table', 'ul', 'ol', 'blockquote'].includes(type);
                }
                // If it's a function component, assume it might render block content
                if (typeof type === 'function') {
                  return true;
                }
              }
              return false;
            });
            
            // If it has block elements, render as div to avoid nesting issues
            if (hasBlockElement || hasBlockChild) {
              return <div className="mb-4 leading-7 text-slate-700 dark:text-slate-300">{children}</div>;
            }
            
            return (
              <p className="mb-4 leading-7 text-slate-700 dark:text-slate-300">
                {children}
              </p>
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
            <li className="mb-1 leading-7">
              {children}
            </li>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:underline dark:text-blue-400"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900 dark:text-slate-100">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 pr-3 italic text-slate-700 dark:border-blue-400 dark:bg-blue-950 dark:text-slate-300">
              {children}
            </blockquote>
          ),
          // Wrap table in a wrapper to prevent it from being inside <p>
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700">
                {children}
              </table>
            </div>
          ),
          // Ensure tbody renders correctly
          tbody: ({ children }) => (
            <tbody>{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {children}
            </tr>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 dark:bg-slate-800">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-300 px-4 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

