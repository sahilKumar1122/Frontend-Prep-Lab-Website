import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EnrollButton } from '@/components/study-paths/EnrollButton';
import { QuestionCheckbox } from '@/components/study-paths/QuestionCheckbox';
import { Footer } from '@/components/layout/Footer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StudyPathDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const user = await currentUser();

  // Fetch study path with all items and questions
  const studyPath = user
    ? await prisma.studyPath.findUnique({
        where: { slug },
        include: {
          items: {
            include: {
              question: {
                include: {
                  progress: {
                    where: { userId: user.id },
                    take: 1,
                  },
                },
              },
            },
            orderBy: { order: 'asc' },
          },
          userStudyPaths: {
            where: { userId: user.id },
            take: 1,
          },
        },
      })
    : await prisma.studyPath.findUnique({
        where: { slug },
        include: {
          items: {
            include: {
              question: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      });

  if (!studyPath) {
    notFound();
  }

  const userProgress = 'userStudyPaths' in studyPath && Array.isArray(studyPath.userStudyPaths) 
    ? studyPath.userStudyPaths[0] 
    : undefined;
  const isEnrolled = !!userProgress;
  const completedQuestions = studyPath.items.filter(
    (item) => {
      const question = item.question;
      if ('progress' in question && Array.isArray(question.progress)) {
        return question.progress[0]?.status === 'completed';
      }
      return false;
    }
  ).length;
  const totalQuestions = studyPath.items.length;
  const progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  const levelColors = {
    junior: 'from-green-500 to-emerald-600',
    mid: 'from-blue-500 to-indigo-600',
    senior: 'from-purple-500 to-pink-600',
  };

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
            <div className="flex items-center gap-4">
              <Link
                href="/study-paths"
                className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Paths</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
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
                  Sign In to Enroll
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className={`mb-12 rounded-2xl bg-gradient-to-r ${levelColors[studyPath.level as keyof typeof levelColors]} p-8 text-white shadow-2xl md:p-12`}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold uppercase backdrop-blur-sm">
              {studyPath.level} Level
            </span>
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold backdrop-blur-sm">
              {studyPath.category}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{studyPath.name}</h1>
          <p className="mb-6 max-w-3xl text-lg text-white/90">{studyPath.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-medium">{totalQuestions} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">~{studyPath.estimatedHours} hours</span>
            </div>
            {isEnrolled && (
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{completedQuestions}/{totalQuestions} Completed</span>
              </div>
            )}
          </div>

          {/* Progress Bar for Enrolled Users */}
          {isEnrolled && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm font-medium">
                <span>Your Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Enroll Button */}
          {user && !isEnrolled && (
            <div className="mt-8">
              <EnrollButton studyPathId={studyPath.id} userId={user.id} />
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Learning Path ({totalQuestions} Questions)
          </h2>
          {studyPath.items.map((item, index: number) => {
            const question = item.question;
            const questionProgress = 'progress' in question && Array.isArray(question.progress) 
              ? question.progress[0] 
              : undefined;
            const isCompleted = questionProgress?.status === 'completed';
            const isInProgress = questionProgress?.status === 'in-progress';

            return (
              <div key={item.id} className="group relative flex items-center gap-3">
                {/* Checkbox - Only visible when enrolled */}
                {isEnrolled && user && (
                  <div className="flex-shrink-0">
                    <QuestionCheckbox
                      userId={user.id}
                      questionId={item.question.id}
                      isCompleted={isCompleted}
                    />
                  </div>
                )}

                <Link
                  href={`/questions/${item.question.slug}`}
                  className="block flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isInProgress
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {isCompleted ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Question Info */}
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          difficultyColors[item.question.difficulty as keyof typeof difficultyColors]
                        }`}>
                          {item.question.difficulty}
                        </span>
                        {item.isOptional && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Optional
                          </span>
                        )}
                        {isInProgress && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            In Progress
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                        {item.question.title}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <svg
                        className="h-6 w-6 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

