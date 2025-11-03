import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { Footer } from '@/components/layout/Footer';

// Cache homepage for 5 minutes
export const revalidate = 300;

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Frontend Prep Lab
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-lg px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
            Master Frontend
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interview Questions
            </span>
          </h1>
          <p className="mb-8 text-xl text-slate-600 dark:text-slate-400">
            Comprehensive platform with 500+ questions covering Angular, React, JavaScript, and more.
            Track your progress, follow study paths, and ace your next interview.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                >
                  Start Learning Free
                </Link>
                <Link
                  href="/questions"
                  className="rounded-lg border-2 border-slate-300 bg-white px-8 py-4 font-semibold text-slate-900 transition-all hover:border-slate-400 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  Browse Questions
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              500+ Questions
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Comprehensive collection covering Angular, React, JavaScript, HTML, CSS, and system design.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <div className="mb-4 inline-block rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              Track Progress
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Monitor your learning journey with detailed statistics, streaks, and completion metrics.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
              <svg
                className="h-6 w-6 text-purple-600 dark:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              Study Paths
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Follow curated learning paths from Junior to Senior level, designed by experts.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
