export default function QuestionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header Skeleton */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters Skeleton */}
        <div className="mb-8 flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 animate-pulse rounded-lg bg-white dark:bg-slate-900"></div>
          ))}
        </div>

        {/* Question Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
              <div className="mb-3 h-4 w-16 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="mb-2 h-6 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="mb-4 space-y-2">
                <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
                <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

