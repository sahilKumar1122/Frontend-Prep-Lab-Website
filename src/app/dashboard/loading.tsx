export default function DashboardLoading() {
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
        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
              <div className="mb-2 h-4 w-24 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="mb-1 h-8 w-16 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800"></div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mt-8 animate-pulse rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
          <div className="mb-4 h-6 w-32 rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

