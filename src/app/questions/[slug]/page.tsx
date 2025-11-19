import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { QuestionProgress } from '@/components/questions/QuestionProgress';
import { Footer } from '@/components/layout/Footer';
import { queryCache, getCacheKey } from '@/lib/cache';
import { MarkdownRendererCore } from '@/components/markdown/MarkdownRendererCore';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static pages at build time for better performance
export async function generateStaticParams() {
  try {
    // Only generate static params if database is available
    const questions = await prisma.question.findMany({
      select: { slug: true },
      take: 50, // Generate first 50 questions statically
    });

    return questions.map((question) => ({
      slug: question.slug,
    }));
  } catch (error) {
    // If database is not available during build (e.g., on Vercel), return empty array
    // Pages will be generated on-demand instead
    console.warn('Database not available during build, skipping static generation:', error);
    return [];
  }
}

// Aggressive caching for maximum speed
export const revalidate = 3600; // 1 hour
export const dynamicParams = true;

export default async function QuestionPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch question FIRST - don't wait for auth at all!
  const question = await queryCache.get(
    getCacheKey('question', slug),
    async () => {
      return prisma.question.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          answer: true,
          category: true,
          difficulty: true,
          tags: true,
          order: true,
          readingTime: true,
        },
      });
    },
    300000 // 5 minutes
  );

  if (!question) {
    notFound();
  }

  const tags = Array.isArray(question.tags) ? question.tags : [];

  // Get current user (optional - questions are public)
  const clerkUser = await currentUser();

  // Get user progress if logged in and user exists in database
  const userProgress = clerkUser
    ? await prisma.userProgress.findUnique({
        where: {
          userId_questionId: {
            userId: clerkUser.id,
            questionId: question.id,
          },
        },
      }).catch(() => null) // Handle case where user doesn't exist in DB yet
    : null;

  // Get navigation data FAST (no auth needed)
  const [previousQuestion, nextQuestion, totalQuestions] = await Promise.all([
    // Previous question
    prisma.question.findFirst({
      where: {
        OR: [
          { category: question.category, order: { lt: question.order || 0 } },
          { category: { lt: question.category } },
        ],
      },
      orderBy: [{ category: 'desc' }, { order: 'desc' }],
      select: { slug: true, title: true },
    }),
    // Next question
    prisma.question.findFirst({
      where: {
        OR: [
          { category: question.category, order: { gt: question.order || 0 } },
          { category: { gt: question.category } },
        ],
      },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
      select: { slug: true, title: true },
    }),
    // Total count (cached separately)
    queryCache.get('total-questions-count', () => prisma.question.count(), 3600000), // 1 hour
  ]);

  const questionNumber = question.order || 0;

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/questions" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Questions</span>
            </Link>
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
        <div className="mx-auto max-w-4xl">
          {/* Question Header */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-block rounded-full bg-slate-200 px-4 py-1.5 text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                #{questionNumber} of {totalQuestions}
              </span>
              <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {question.category.toUpperCase()}
              </span>
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${
                  difficultyColors[question.difficulty as keyof typeof difficultyColors]
                }`}
              >
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {question.readingTime} min read
              </span>
              {userProgress && (
                <span className="ml-auto rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
                  ✓ Completed
                </span>
              )}
            </div>

            <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
              {question.title}
            </h1>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Question Content */}
          <div className="mb-8 rounded-xl bg-white p-8 shadow-lg dark:bg-slate-900">
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Question
            </h2>
            <MarkdownRendererCore content={question.content} />
          </div>

          {/* Answer Content */}
          <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-slate-900">
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Answer
            </h2>
            <MarkdownRendererCore content={question.answer} />
          </div>

          {/* Progress Tracking - Load async on client */}
          <QuestionProgress
            userId={clerkUser?.id || ''}
            questionId={question.id}
            initialStatus={userProgress?.status}
            initialTimeSpent={userProgress?.timeSpent || 0}
          />

          {/* Navigation: Previous/Next */}
          <div className="mt-8 space-y-4">
            {/* Previous/Next Buttons */}
            <div className="flex items-center justify-between gap-4">
              {previousQuestion ? (
                <Link
                  href={`/questions/${previousQuestion.slug}`}
                  className="flex flex-1 items-center gap-3 rounded-lg border-2 border-slate-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <div className="flex-1 overflow-hidden text-left">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Previous</p>
                    <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {previousQuestion.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-1 items-center gap-3 rounded-lg border-2 border-slate-100 bg-slate-50 p-4 opacity-50 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-400">Previous</p>
                    <p className="font-semibold text-slate-400">No previous question</p>
                  </div>
                </div>
              )}

              {nextQuestion ? (
                <Link
                  href={`/questions/${nextQuestion.slug}`}
                  className="flex flex-1 items-center gap-3 rounded-lg border-2 border-slate-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600"
                >
                  <div className="flex-1 overflow-hidden text-right">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Next</p>
                    <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {nextQuestion.title}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-1 items-center gap-3 rounded-lg border-2 border-slate-100 bg-slate-50 p-4 opacity-50 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex-1 text-right">
                    <p className="text-xs font-medium text-slate-400">Next</p>
                    <p className="font-semibold text-slate-400">No next question</p>
                  </div>
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Back to All Questions */}
            <div className="text-center">
              <Link
                href="/questions"
                className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Back to All Questions
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

