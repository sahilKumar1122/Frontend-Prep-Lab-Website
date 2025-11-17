export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header skeleton */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-3">
              <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="h-12 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-8">
            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-slate-900">
              <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-slate-900">
              <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
