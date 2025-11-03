'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface EnrollButtonProps {
  studyPathId: string;
  userId: string;
}

export function EnrollButton({ studyPathId, userId }: EnrollButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleEnroll = async () => {
    setError(null);

    try {
      const response = await fetch('/api/study-paths/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studyPathId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enroll');
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError('Failed to enroll. Please try again.');
      console.error('Enrollment error:', err);
    }
  };

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={isPending}
        className="rounded-lg bg-white px-8 py-4 font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enrolling...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Enroll in This Path
          </span>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-300">{error}</p>
      )}
    </div>
  );
}

