export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="mb-4 flex gap-3">
              <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="mb-4 h-12 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-6 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="mb-8 rounded-xl bg-white p-8 shadow-lg dark:bg-slate-900">
            <div className="mb-4 h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>

          {/* Answer skeleton */}
          <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-slate-900">
            <div className="mb-4 h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

