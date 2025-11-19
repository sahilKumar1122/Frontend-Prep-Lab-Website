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
  const [darkStyle, setDarkStyle] = useState<Record<string, React.CSSProperties> | null>(null);

  useEffect(() => {
    // Always load dark theme for code blocks (like LeetCode, TUF, etc.)
    loadVscDarkPlus().then(setDarkStyle);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const showLineNumbers = value.split('\n').length > 3;

  return (
    <div className="group relative my-3 overflow-hidden rounded-lg bg-[#1e1e1e]">
      {/* Premium Header Bar - LeetCode/TUF style */}
      <div className="flex items-center justify-between border-b border-slate-700/50 bg-[#252526] px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* macOS-style window controls */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56] transition-all hover:bg-[#ff3b30]"></div>
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e] transition-all hover:bg-[#ffcc00]"></div>
            <div className="h-3 w-3 rounded-full bg-[#27c93f] transition-all hover:bg-[#28cd41]"></div>
          </div>
          
          {/* Language badge */}
          {language && (
            <div className="ml-2 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-500"></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {language}
              </span>
            </div>
          )}
        </div>

        {/* Copy button - LeetCode style */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border border-slate-600 bg-[#2d2d30] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-slate-500 hover:bg-[#3e3e42] hover:text-white active:scale-95"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg 
                className="h-3.5 w-3.5 text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg 
                className="h-3.5 w-3.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content - Always dark theme */}
      <div className="relative overflow-x-auto">
        {/* Line number gutter background */}
        <div className="absolute inset-y-0 left-0 w-12 border-r border-slate-700/30 bg-[#252526]/80" style={{ display: showLineNumbers ? 'block' : 'none' }}></div>
        <SyntaxHighlighter
          language={language || 'text'}
          style={darkStyle || undefined}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1.25rem 1.5rem',
            paddingLeft: showLineNumbers ? '4.5rem' : '1.5rem',
            background: '#1e1e1e',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            fontWeight: '400',
          }}
          lineNumberStyle={{
            minWidth: '3.5em',
            paddingRight: '1.5em',
            paddingLeft: '0.5em',
            color: '#858585',
            userSelect: 'none',
            textAlign: 'right',
            fontSize: '0.875rem',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          }}
          wrapLines={true}
          wrapLongLines={true}
          PreTag="div"
          CodeTag="code"
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

