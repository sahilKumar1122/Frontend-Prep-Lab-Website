'use client';

import { Suspense, lazy } from 'react';

// Ultra-lazy loading - only load when component mounts
const MarkdownRenderer = lazy(() => 
  import('@/components/markdown/MarkdownRenderer').then(mod => ({
    default: mod.MarkdownRenderer,
  }))
);

interface QuestionContentWrapperProps {
  content: string;
  title: string;
}

function LoadingFallback() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-slate-200 rounded w-3/4 dark:bg-slate-700"></div>
      <div className="h-4 bg-slate-200 rounded w-full dark:bg-slate-700"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6 dark:bg-slate-700"></div>
      <div className="h-4 bg-slate-200 rounded w-4/5 dark:bg-slate-700"></div>
      <div className="h-4 bg-slate-200 rounded w-full dark:bg-slate-700"></div>
      <div className="h-4 bg-slate-200 rounded w-2/3 dark:bg-slate-700"></div>
    </div>
  );
}

export function QuestionContentWrapper({ content }: QuestionContentWrapperProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MarkdownRenderer content={content} />
    </Suspense>
  );
}

