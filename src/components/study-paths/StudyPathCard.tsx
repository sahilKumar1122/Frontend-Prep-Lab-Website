import Link from 'next/link';

interface StudyPathCardProps {
  path: {
    id: string;
    name: string;
    slug: string;
    description: string;
    level: string;
    category: string;
    estimatedHours: number;
    items: Array<{
      id: string;
      order: number;
      isOptional: boolean;
      question: {
        id: string;
        title: string;
        difficulty: string;
      };
    }>;
  };
  userProgress?: {
    status: string;
    progress: number;
    startedAt: Date | null;
    completedAt: Date | null;
  };
  isLoggedIn: boolean;
  levelColors: Record<string, string>;
}

export function StudyPathCard({ path, userProgress, isLoggedIn, levelColors }: StudyPathCardProps) {
  const progress = userProgress?.progress || 0;
  const status = userProgress?.status || 'not-started';
  const questionsCount = path.items.length;
  const requiredCount = path.items.filter((item) => !item.isOptional).length;

  const levelBadgeColors = {
    junior: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    mid: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    senior: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  };

  const statusInfo = {
    'not-started': { text: 'Start Path', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    'in-progress': { text: 'Continue', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    'completed': { text: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  };

  return (
    <Link
      href={`/study-paths/${path.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
    >
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${levelColors[path.level as keyof typeof levelColors] || 'from-slate-500 to-slate-600'} p-6 text-white`}>
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              levelBadgeColors[path.level as keyof typeof levelBadgeColors]
            }`}
          >
            {path.level}
          </span>
          {isLoggedIn && status !== 'not-started' && (
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusInfo[status as keyof typeof statusInfo].color}`}>
              {statusInfo[status as keyof typeof statusInfo].text}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-bold">{path.name}</h3>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="mb-4 text-slate-600 dark:text-slate-400">{path.description}</p>

        {/* Progress Bar (if user has started) */}
        {isLoggedIn && progress > 0 && (
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">Progress</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="font-medium">
              {questionsCount} Question{questionsCount !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">~{path.estimatedHours}h</span>
          </div>
        </div>

        {/* Required vs Optional */}
        {questionsCount > requiredCount && (
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
            <span className="text-slate-600 dark:text-slate-400">
              {requiredCount} required · {questionsCount - requiredCount} optional
            </span>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {status === 'completed' ? 'Review Path' : status === 'in-progress' ? 'Continue Learning' : 'Start Learning'}
          </span>
          <div className="flex items-center gap-2 text-blue-600 group-hover:gap-3 dark:text-blue-400">
            <span className="font-semibold">View Path</span>
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Completed Checkmark */}
      {status === 'completed' && (
        <div className="absolute right-4 top-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </Link>
  );
}

