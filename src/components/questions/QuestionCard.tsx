import Link from 'next/link';
import { memo, useMemo } from 'react';

interface QuestionCardProps {
  question: {
    id: string;
    slug: string;
    title: string;
    category: string;
    difficulty: string;
    tags: string[] | string;
    readingTime: number;
  };
  userProgress?: {
    status: string;
    completedAt: Date | null;
  };
  isLoggedIn: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
} as const;

const statusColors = {
  'not-started': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  review: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
} as const;

const statusIcons = {
  'not-started': '○',
  'in-progress': '◐',
  completed: '✓',
  review: '↻',
} as const;

function QuestionCardComponent({ question, userProgress, isLoggedIn, questionNumber }: QuestionCardProps) {
  const status = userProgress?.status || 'not-started';
  
  // Memoize tags parsing to avoid re-computation
  const tags = useMemo<string[]>(() => {
    if (Array.isArray(question.tags)) {
      return question.tags;
    }
    if (typeof question.tags === 'string') {
      return question.tags.startsWith('[') ? JSON.parse(question.tags) : [];
    }
    return [];
  }, [question.tags]);

  return (
    <Link
      href={`/questions/${question.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
    >
      {/* Status Badge (if logged in) */}
      {isLoggedIn && status !== 'not-started' && (
        <div className="absolute right-4 top-4">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
              statusColors[status as keyof typeof statusColors]
            }`}
          >
            <span>{statusIcons[status as keyof typeof statusIcons]}</span>
            {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      )}

      {/* Question Number & Category */}
      <div className="mb-3 flex items-center gap-2">
        {questionNumber && (
          <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            #{questionNumber}
          </span>
        )}
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          {question.category.toUpperCase()}
        </span>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            difficultyColors[question.difficulty as keyof typeof difficultyColors]
          }`}
        >
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-3 text-lg font-bold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
        {question.title}
      </h3>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              +{tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{question.readingTime} min read</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600 group-hover:gap-2 dark:text-blue-400">
          <span className="font-medium">Read more</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// Memoize component to prevent unnecessary re-renders
export const QuestionCard = memo(QuestionCardComponent, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.question.id === nextProps.question.id &&
    prevProps.question.slug === nextProps.question.slug &&
    prevProps.question.title === nextProps.question.title &&
    prevProps.userProgress?.status === nextProps.userProgress?.status &&
    prevProps.isLoggedIn === nextProps.isLoggedIn &&
    prevProps.questionNumber === nextProps.questionNumber
  );
});

QuestionCard.displayName = 'QuestionCard';
