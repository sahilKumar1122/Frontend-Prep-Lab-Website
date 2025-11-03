'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuestionCheckboxProps {
  userId: string;
  questionId: string;
  isCompleted: boolean;
}

export function QuestionCheckbox({ userId, questionId, isCompleted }: QuestionCheckboxProps) {
  const [isChecked, setIsChecked] = useState(isCompleted);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdating) return;

    setIsUpdating(true);
    const newStatus = !isChecked ? 'completed' : 'not-started';

    // Optimistic update
    setIsChecked(!isChecked);

    try {
      const response = await fetch('/api/questions/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          questionId,
          status: newStatus,
          timeSpentMinutes: 5, // Default time for quick checkbox completions
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      // Refresh the page to update the progress counts
      router.refresh();
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert optimistic update on error
      setIsChecked(isChecked);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border-2 transition-all ${
        isChecked
          ? 'border-green-500 bg-green-500 hover:border-green-600 hover:bg-green-600'
          : 'border-slate-300 bg-white hover:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-400'
      } ${isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
      disabled={isUpdating}
      aria-label={isChecked ? 'Mark as incomplete' : 'Mark as complete'}
      title={isChecked ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {isChecked && (
        <svg
          className="h-4 w-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

