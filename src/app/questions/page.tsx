import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { QuestionFilters } from '@/components/questions/QuestionFilters';
import { QuestionTable } from '@/components/questions/QuestionTable';
import { Footer } from '@/components/layout/Footer';
import { queryCache, getCacheKey, CacheKeys } from '@/lib/cache';

// Aggressive ISR - revalidate every 30 seconds
export const revalidate = 30;

// Enable dynamic rendering for search
export const dynamic = 'force-dynamic';

interface SearchParams {
  category?: string;
  difficulty?: string;
  search?: string;
}

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  
  // Get current user to fetch progress
  const clerkUser = await currentUser();

  // Build filter conditions
  const whereConditions: {
    category?: string;
    difficulty?: string;
    OR?: Array<{
      title?: { contains: string; mode: 'insensitive' };
      content?: { contains: string; mode: 'insensitive' };
    }>;
  } = {};
  
  if (params.category && params.category !== 'all') {
    whereConditions.category = params.category;
  }
  
  if (params.difficulty && params.difficulty !== 'all') {
    whereConditions.difficulty = params.difficulty;
  }
  
  if (params.search) {
    whereConditions.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { content: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  // Generate cache key - include user ID if logged in (for progress)
  const cacheKey = getCacheKey(
    'questions-page',
    params.category || 'all',
    params.difficulty || 'all',
    params.search || '',
    clerkUser?.id || 'anonymous'
  );

  // Fetch questions and category counts in parallel with caching
  const [questions, categoryCounts] = await Promise.all([
    // Cache questions query (30 second TTL for filtered results, 60s for all)
    queryCache.get(
      cacheKey,
      () =>
        prisma.question.findMany({
          where: whereConditions,
          orderBy: [
            { category: 'asc' },
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
          select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            difficulty: true,
            tags: true,
            readingTime: true,
            // Include progress if user is logged in
            ...(clerkUser ? {
              progress: {
                where: { userId: clerkUser.id },
                select: {
                  status: true,
                  completedAt: true,
                },
                take: 1,
              },
            } : {}),
          },
        }),
      params.search ? 30000 : 60000 // 30s for search, 60s for normal
    ),
    // Cache category counts (longer TTL as they change less frequently)
    queryCache.get(
      CacheKeys.CATEGORY_COUNTS,
      () =>
        prisma.question.groupBy({
          by: ['category'],
          _count: true,
        }),
      300000 // 5 minutes
    ),
  ]);

  const categories = [
    'angular',
    'react',
    'javascript',
    'typescript',
    'html',
    'css',
    'system-design',
  ];

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
                Browse {questions.length} Interview Questions
              </p>
            </div>
            <div className="flex items-center gap-4">
              {clerkUser ? (
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
            Interview Questions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Practice frontend interview questions across multiple technologies
          </p>
        </div>

        {/* Filters */}
        <QuestionFilters
          currentCategory={params.category || 'all'}
          currentDifficulty={params.difficulty || 'all'}
          currentSearch={params.search || ''}
          categories={categories}
          categoryCounts={categoryCounts}
        />

        {/* Questions Table */}
        {questions.length === 0 ? (
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              No questions found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your filters or search query
            </p>
            <Link
              href="/questions"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          <QuestionTable questions={questions} isLoggedIn={!!clerkUser} />
        )}
      </main>
      <Footer />
    </div>
  );
}

