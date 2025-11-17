import Link from 'next/link';
import { memo, useMemo } from 'react';

interface QuestionTableProps {
  questions: Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    difficulty: string;
    tags: string[] | string;
    readingTime: number;
    progress?: Array<{
      status: string;
      completedAt: Date | null;
    }>;
  }>;
  isLoggedIn: boolean;
}

const difficultyColors = {
  easy: 'text-green-600 dark:text-green-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  hard: 'text-red-600 dark:text-red-400',
} as const;

const statusIcons = {
    'not-started': (
      <div className="h-4 w-4 rounded-full border-2 border-slate-400 dark:border-slate-500" />
    ),
    'in-progress': (
      <div className="flex h-4 w-4 items-center justify-center">
        <div className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400" />
      </div>
    ),
    completed: (
      <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    review: (
      <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  } as const;

// Memoized row component for better performance
const QuestionRow = memo(({ 
  question, 
  index, 
  isLoggedIn 
}: { 
  question: QuestionTableProps['questions'][0]; 
  index: number; 
  isLoggedIn: boolean;
}) => {
  const progress = 'progress' in question && Array.isArray(question.progress) 
    ? question.progress[0] 
    : undefined;
  const status = progress?.status || 'not-started';
  
  // Memoize tags parsing
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
    <tr 
      className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
      {isLoggedIn && (
        <td className="px-4 py-4">
          <div className="flex items-center justify-center">
            {statusIcons[status as keyof typeof statusIcons]}
          </div>
        </td>
      )}
      <td className="px-4 py-4">
        <span className="text-base font-medium text-slate-600 dark:text-slate-400">
          {index + 1}
        </span>
      </td>
      <td className="px-4 py-4">
        <Link
          href={`/questions/${question.slug}`}
          className="group/link inline-flex items-center gap-2 text-base font-medium text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
        >
          <span>{question.title}</span>
          <svg
            className="h-4 w-4 opacity-0 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {question.category.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className={`text-sm font-semibold capitalize ${difficultyColors[question.difficulty as keyof typeof difficultyColors]}`}>
          {question.difficulty}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1.5 max-w-xs">
          {tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              +{tags.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {question.readingTime} min
        </span>
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.question.id === nextProps.question.id &&
    prevProps.question.slug === nextProps.question.slug &&
    prevProps.index === nextProps.index &&
    prevProps.isLoggedIn === nextProps.isLoggedIn
  );
});

QuestionRow.displayName = 'QuestionRow';

function QuestionTableComponent({ questions, isLoggedIn }: QuestionTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
            <tr>
              {isLoggedIn && (
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Status
                </th>
              )}
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Tags
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <svg className="inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {questions.map((question, index) => (
              <QuestionRow
                key={question.id}
                question={question}
                index={index}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Memoize the entire table component
export const QuestionTable = memo(QuestionTableComponent, (prevProps, nextProps) => {
  // Only re-render if questions array reference changes or isLoggedIn changes
  return (
    prevProps.questions === nextProps.questions &&
    prevProps.isLoggedIn === nextProps.isLoggedIn
  );
});

QuestionTable.displayName = 'QuestionTable';
