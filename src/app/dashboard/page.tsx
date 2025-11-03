import { currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user-sync';
import { Footer } from '@/components/layout/Footer';

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect('/sign-in');
  }

  // Ensure user exists in our database
  const user = await getOrCreateUser(
    clerkUser.id,
    clerkUser.emailAddresses[0]?.emailAddress || '',
    clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.firstName || clerkUser.lastName || undefined,
    clerkUser.imageUrl
  );

  // Get user stats
  const stats = await prisma.userStats.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Frontend Prep Lab
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Master Frontend Interviews
            </p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
          <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {user.name || 'there'}! 👋
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Continue your frontend interview preparation journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Questions Completed */}
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Questions Completed
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats?.totalQuestionsCompleted || 0}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Study Streak */}
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Current Streak
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats?.currentStreak || 0} 🔥
                </p>
              </div>
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                <svg
                  className="h-6 w-6 text-orange-600 dark:text-orange-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Time Spent */}
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Time Spent
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {(() => {
                    const totalMinutes = stats?.totalTimeSpent || 0;
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    
                    if (hours === 0) {
                      return `${minutes}m`;
                    } else if (minutes === 0) {
                      return `${hours}h`;
                    } else {
                      return `${hours}h ${minutes}m`;
                    }
                  })()}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {stats?.totalQuestionsCompleted 
                    ? `~${Math.round((stats?.averageTimePerQuestion || 0))} min/question`
                    : 'Complete questions to see stats'}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Longest Streak
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats?.longestStreak || 0} days
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
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
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
          <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
            Quick Actions
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/questions"
              className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 transition-all hover:border-blue-400 hover:shadow-md dark:border-blue-900 dark:bg-blue-950"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                Browse Questions
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Explore all interview questions
              </p>
            </a>
            <a
              href="/study-paths"
              className="rounded-lg border-2 border-green-200 bg-green-50 p-4 transition-all hover:border-green-400 hover:shadow-md dark:border-green-900 dark:bg-green-950"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                Study Paths
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Follow curated learning paths
              </p>
            </a>
            <a
              href="/bookmarks"
              className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 transition-all hover:border-purple-400 hover:shadow-md dark:border-purple-900 dark:bg-purple-950"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                Bookmarks
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                View your saved questions
              </p>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

