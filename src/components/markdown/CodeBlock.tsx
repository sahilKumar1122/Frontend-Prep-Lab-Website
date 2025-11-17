'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.Prism)
);

const loadVscDarkPlus = async () => {
  const mod = await import('react-syntax-highlighter/dist/esm/styles/prism');
  return mod.vscDarkPlus;
};

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
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
    <div className="group relative my-6 rounded-xl border border-slate-200 bg-slate-900 dark:border-slate-800">
      {/* Language badge and copy button */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2">
        {language && (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="ml-auto rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-slate-600 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <span className="mr-1">✓</span>
              Copied!
            </>
          ) : (
            <>
              <span className="mr-1">📋</span>
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
            color: '#6b7280',
            userSelect: 'none',
          }}
          wrapLines={true}
          wrapLongLines={false}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

