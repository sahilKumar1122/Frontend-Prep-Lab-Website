import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { StudyPathCard } from '@/components/study-paths/StudyPathCard';
import { Footer } from '@/components/layout/Footer';

export default async function StudyPathsPage() {
  const user = await currentUser();

  // Fetch all published study paths with their items and user progress
  const studyPaths = await prisma.studyPath.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
    include: {
      items: {
        include: {
          question: true,
        },
        orderBy: { order: 'asc' },
      },
      userStudyPaths: user
        ? {
            where: { userId: user.id },
            take: 1,
          }
        : false,
    },
  });

  const levelColors = {
    junior: 'from-green-500 to-emerald-600',
    mid: 'from-blue-500 to-indigo-600',
    senior: 'from-purple-500 to-pink-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Frontend Prep Lab
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Study Paths
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/questions"
                className="rounded-lg px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Questions
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="rounded-lg px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-slate-900 dark:text-slate-100">
            Study Paths
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-400">
            Follow curated learning paths designed to take you from beginner to expert.
            Track your progress and master frontend development step by step.
          </p>
        </div>

        {/* Level Filter Tabs */}
        <div className="mb-8 flex justify-center gap-2">
          <button className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 shadow-md transition-all hover:shadow-lg dark:bg-slate-900 dark:text-slate-100">
            All Paths
          </button>
          <button className="rounded-lg bg-green-100 px-6 py-3 font-semibold text-green-700 transition-all hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
            Junior
          </button>
          <button className="rounded-lg bg-blue-100 px-6 py-3 font-semibold text-blue-700 transition-all hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
            Mid-Level
          </button>
          <button className="rounded-lg bg-purple-100 px-6 py-3 font-semibold text-purple-700 transition-all hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300">
            Senior
          </button>
        </div>

        {/* Study Paths Grid */}
        {studyPaths.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <svg
                className="h-8 w-8 text-slate-400"
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
              No study paths available
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Check back soon for curated learning paths!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {studyPaths.map((path: typeof studyPaths[0]) => (
              <StudyPathCard
                key={path.id}
                path={path}
                userProgress={path.userStudyPaths?.[0]}
                isLoggedIn={!!user}
                levelColors={levelColors}
              />
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
            Why Follow Study Paths?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                Structured Learning
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Follow a proven curriculum designed by experts to build skills progressively
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
                Monitor your advancement with detailed metrics and completion percentages
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                Level Up Fast
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Accelerate your learning with focused, goal-oriented study sessions
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

