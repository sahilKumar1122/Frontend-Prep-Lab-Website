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

        {/* Questions Table Skeleton */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Difficulty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Tags</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-6 rounded bg-slate-200 dark:bg-slate-800"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-64 rounded bg-slate-200 dark:bg-slate-800"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1.5">
                        <div className="h-5 w-12 rounded-md bg-slate-200 dark:bg-slate-800"></div>
                        <div className="h-5 w-12 rounded-md bg-slate-200 dark:bg-slate-800"></div>
                        <div className="h-5 w-12 rounded-md bg-slate-200 dark:bg-slate-800"></div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

