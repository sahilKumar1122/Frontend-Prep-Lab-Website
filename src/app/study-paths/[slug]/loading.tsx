export default function StudyPathDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header Skeleton */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        {/* Hero Skeleton */}
        <div className="mb-8 animate-pulse overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-2xl">
          <div className="mb-4 h-8 w-1/2 rounded bg-white/20"></div>
          <div className="mb-6 space-y-2">
            <div className="h-4 w-full rounded bg-white/20"></div>
            <div className="h-4 w-3/4 rounded bg-white/20"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-6 w-24 rounded-full bg-white/20"></div>
            <div className="h-6 w-20 rounded-full bg-white/20"></div>
          </div>
        </div>

        {/* Questions List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

