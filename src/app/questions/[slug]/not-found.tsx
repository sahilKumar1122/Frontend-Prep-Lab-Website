import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Frontend Prep Lab
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <svg
                className="h-16 w-16 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
            Question Not Found
          </h1>
          <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
            The question you're looking for doesn't exist or may have been removed.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/questions"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700"
            >
              Browse All Questions
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-slate-800"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

