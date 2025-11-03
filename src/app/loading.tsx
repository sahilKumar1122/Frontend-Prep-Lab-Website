export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          {/* Spinner */}
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-400"></div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    </div>
  );
}

