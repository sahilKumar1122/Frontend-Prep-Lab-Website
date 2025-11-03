'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface QuestionProgressProps {
  userId: string;
  questionId: string;
  initialStatus?: string;
  initialTimeSpent?: number; // In minutes from database
}

export function QuestionProgress({ userId, questionId, initialStatus, initialTimeSpent = 0 }: QuestionProgressProps) {
  const [status, setStatus] = useState(initialStatus || 'not-started');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const isAlreadyCompleted = initialStatus === 'completed';
  const savedTimeInSeconds = initialTimeSpent * 60; // Convert minutes to seconds
  const [timeSpent, setTimeSpent] = useState(isAlreadyCompleted ? savedTimeInSeconds : 0); // Display time in seconds
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0); // Total time spent paused (seconds)
  const [timerStopped, setTimerStopped] = useState(isAlreadyCompleted); // Stop timer if already completed
  const pauseStartRef = useRef<number | null>(null);
  const timeSpentRef = useRef(isAlreadyCompleted ? initialTimeSpent : 0);
  const router = useRouter();

  // Track time spent on page with visible updates
  useEffect(() => {
    // Don't start timer if already completed or timer is stopped
    if (timerStopped) {
      return;
    }

    const interval = setInterval(() => {
      if (!isPaused) {
        // Calculate actual time minus paused time
        const totalElapsed = Math.floor((Date.now() - startTime) / 1000);
        const actualTime = totalElapsed - pausedTime;
        setTimeSpent(actualTime);
        timeSpentRef.current = Math.floor(actualTime / 60); // minutes for API
      }
    }, 1000); // Update every second for display

    return () => clearInterval(interval);
  }, [startTime, isPaused, pausedTime, timerStopped]);

  // Handle pause state changes
  useEffect(() => {
    if (isPaused) {
      // Record when pause started
      pauseStartRef.current = Date.now();
    } else if (pauseStartRef.current !== null) {
      // Calculate how long we were paused and add to total
      const pauseDuration = Math.floor((Date.now() - pauseStartRef.current) / 1000);
      setPausedTime(prev => prev + pauseDuration);
      pauseStartRef.current = null;
    }
  }, [isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleComplete = async () => {
    setIsSubmitting(true);

    try {
      const newStatus = status === 'completed' ? 'not-started' : 'completed';
      const timeSpentMinutes = Math.max(1, Math.ceil(timeSpentRef.current)); // At least 1 minute

      const response = await fetch('/api/questions/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          questionId,
          status: newStatus,
          timeSpentMinutes,
        }),
      });

      if (response.ok) {
        setStatus(newStatus);
        
        // Handle timer based on completion status
        if (newStatus === 'completed') {
          // Stop timer when marking as complete
          setTimerStopped(true);
          setIsPaused(false); // Unpause if paused
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
        } else {
          // Restart timer when marking as incomplete
          setTimerStopped(false);
          // Reset to continue from current time
        }
        
        router.refresh(); // Refresh to update streak/stats
      } else {
        console.error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed right-4 top-4 z-50 animate-slide-in-right rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-4 shadow-2xl">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Question Completed! 🎉</p>
              <p className="text-sm text-white/90">Streak updated • Stats saved</p>
            </div>
          </div>
        </div>
      )}

      {/* Time Tracker Badge (Top Right) */}
      <div className={`fixed right-4 top-20 z-40 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm transition-all ${
        timerStopped
          ? 'bg-green-100/95 dark:bg-green-900/95'
          : isPaused 
          ? 'bg-orange-100/95 dark:bg-orange-900/95' 
          : 'bg-white/95 dark:bg-slate-900/95'
      }`}>
        <div className="flex items-center gap-3">
          {/* Timer Icon/Status */}
          {timerStopped ? (
            <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : isPaused ? (
            <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          
          {/* Time Display */}
          <span className={`text-sm font-medium ${
            timerStopped
              ? 'text-green-700 dark:text-green-300'
              : isPaused 
              ? 'text-orange-700 dark:text-orange-300' 
              : 'text-slate-700 dark:text-slate-300'
          }`}>
            {formatTime(timeSpent)}
            {timerStopped ? (
              <span className="ml-1 text-xs">(Completed)</span>
            ) : isPaused && (
              <span className="ml-1 text-xs">(Paused)</span>
            )}
          </span>
          
          {/* Pause/Resume Button - Hide when timer is stopped */}
          {!timerStopped && (
            <button
              onClick={togglePause}
              className={`rounded-full p-1 transition-all hover:scale-110 ${
                isPaused
                  ? 'bg-orange-200 hover:bg-orange-300 dark:bg-orange-800 dark:hover:bg-orange-700'
                  : 'bg-blue-100 hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700'
              }`}
              title={isPaused ? 'Resume timer' : 'Pause timer'}
            >
              {isPaused ? (
                // Play icon
                <svg className="h-3 w-3 text-orange-700 dark:text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                // Pause icon
                <svg className="h-3 w-3 text-blue-700 dark:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progress Card */}
      <div className="mt-8 space-y-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-lg dark:from-blue-950 dark:to-purple-950">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Track Your Progress
              </h3>
              {status === 'completed' && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
                  ✓ Completed
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {status === 'completed' 
                ? isAlreadyCompleted
                  ? `✓ You completed this question previously. Time spent: ${formatTime(timeSpent)}`
                  : '✓ Great job! This question has been added to your completed count 🔥'
                : 'Mark this question as completed to track your progress and build your streak'}
            </p>
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex flex-wrap items-center gap-4">
          <div className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            timerStopped
              ? 'bg-green-100/80 dark:bg-green-900/50'
              : isPaused 
              ? 'bg-orange-100/80 dark:bg-orange-900/50' 
              : 'bg-white/50 dark:bg-slate-900/50'
          }`}>
            {timerStopped ? (
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : isPaused ? (
              <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div>
              <p className={`text-xs ${
                timerStopped 
                  ? 'text-green-600 dark:text-green-400'
                  : isPaused 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                Time Spent {timerStopped ? '(Final)' : isPaused ? '(Paused)' : ''}
              </p>
              <p className={`font-semibold ${
                timerStopped
                  ? 'text-green-900 dark:text-green-100'
                  : isPaused 
                  ? 'text-orange-900 dark:text-orange-100' 
                  : 'text-slate-900 dark:text-slate-100'
              }`}>
                {formatTime(timeSpent)}
              </p>
            </div>
          </div>

          {status === 'completed' && (
            <div className="flex items-center gap-2 rounded-lg bg-white/50 px-4 py-2 dark:bg-slate-900/50">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Status</p>
                <p className="font-semibold text-green-700 dark:text-green-300">
                  Completed
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleToggleComplete}
            disabled={isSubmitting}
            className={`ml-auto rounded-lg px-6 py-2.5 font-medium transition-all disabled:opacity-50 ${
              status === 'completed'
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
            }`}
          >
            {isSubmitting 
              ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              )
              : status === 'completed' 
              ? 'Mark as Incomplete' 
              : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </>
  );
}

