export default function QuestionDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header Skeleton */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Title Skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="mb-3 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="mb-2 h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* Content Skeleton */}
        <div className="animate-pulse rounded-xl bg-white p-8 shadow-lg dark:bg-slate-900">
          <div className="space-y-4">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 w-4/6 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="my-6 h-32 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div className="mt-8 flex gap-4">
          <div className="h-16 flex-1 animate-pulse rounded-lg bg-white dark:bg-slate-900"></div>
          <div className="h-16 flex-1 animate-pulse rounded-lg bg-white dark:bg-slate-900"></div>
        </div>
      </main>
    </div>
  );
}
