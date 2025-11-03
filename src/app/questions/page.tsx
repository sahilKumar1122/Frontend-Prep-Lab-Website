import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { QuestionFilters } from '@/components/questions/QuestionFilters';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { Footer } from '@/components/layout/Footer';

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
  const user = await currentUser();
  
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

  // Fetch questions with user progress if logged in
  const questions = user
    ? await prisma.question.findMany({
        where: whereConditions,
        orderBy: [
          { category: 'asc' },
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
        include: {
          progress: {
            where: { userId: user.id },
            take: 1,
          },
        },
      })
    : await prisma.question.findMany({
        where: whereConditions,
        orderBy: [
          { category: 'asc' },
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
      });

  // Get category counts
  const categoryCounts = await prisma.question.groupBy({
    by: ['category'],
    _count: true,
  });

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
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Dashboard
                  </Link>
                </>
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

        {/* Questions Grid */}
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
          <div className="grid gap-4 md:grid-cols-2">
            {questions.map((question, index: number) => {
              const progress = 'progress' in question && Array.isArray(question.progress) 
                ? question.progress[0] 
                : undefined;
              
              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  userProgress={progress}
                  isLoggedIn={!!user}
                  questionNumber={index + 1}
                  totalQuestions={questions.length}
                />
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

