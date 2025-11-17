'use client';

import dynamic from 'next/dynamic';

// Ultra-lazy loading - load markdown renderer only when needed
const MarkdownRendererCore = dynamic(
  () => import('./MarkdownRendererCore').then((mod) => ({ default: mod.MarkdownRendererCore })),
  {
    loading: () => (
      <div className="animate-pulse space-y-4 py-8">
        <div className="h-6 bg-slate-200 rounded w-3/4 dark:bg-slate-700"></div>
        <div className="h-4 bg-slate-200 rounded w-full dark:bg-slate-700"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6 dark:bg-slate-700"></div>
        <div className="h-32 bg-slate-200 rounded w-full dark:bg-slate-700 my-6"></div>
        <div className="h-4 bg-slate-200 rounded w-full dark:bg-slate-700"></div>
        <div className="h-4 bg-slate-200 rounded w-4/5 dark:bg-slate-700"></div>
      </div>
    ),
  }
);

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRendererClient({ content, className = '' }: MarkdownRendererProps) {
  return <MarkdownRendererCore content={content} className={className} />;
}

