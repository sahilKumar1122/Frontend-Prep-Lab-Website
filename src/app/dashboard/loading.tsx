export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
          <div className="h-10 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
              <div className="space-y-4">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-12 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
