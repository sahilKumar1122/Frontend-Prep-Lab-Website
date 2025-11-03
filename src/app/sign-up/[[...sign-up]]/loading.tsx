export default function SignUpLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-[450px]">
        <div className="mb-6 text-center">
          <div className="h-9 w-48 mx-auto bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          <div className="mt-2 h-6 w-96 mx-auto bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-lg p-8 space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

