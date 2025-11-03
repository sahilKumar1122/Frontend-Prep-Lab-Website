'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface QuestionFiltersProps {
  currentCategory: string;
  currentDifficulty: string;
  currentSearch: string;
  categories: string[];
  categoryCounts: Array<{ category: string; _count: number }>;
}

export function QuestionFilters({
  currentCategory,
  currentDifficulty,
  currentSearch,
  categories,
  categoryCounts,
}: QuestionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(currentSearch);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.push(`/questions?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', searchValue);
  };

  const getCategoryCount = (category: string) => {
    return categoryCounts.find((c) => c.category === category)?._count || 0;
  };

  const difficultyColors = {
    all: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search questions..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
        />
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchValue && (
          <button
            type="button"
            onClick={() => {
              setSearchValue('');
              updateFilter('search', '');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Category Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Category
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('category', 'all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              currentCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            disabled={isPending}
          >
            All
          </button>
          {categories.map((category) => {
            const count = getCategoryCount(category);
            return (
              <button
                key={category}
                onClick={() => updateFilter('category', category)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  currentCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                disabled={isPending}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {count > 0 && (
                  <span className="ml-2 text-xs opacity-75">({count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Difficulty
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('difficulty', 'all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              currentDifficulty === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : difficultyColors.all
            }`}
            disabled={isPending}
          >
            All Levels
          </button>
          {['easy', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              onClick={() => updateFilter('difficulty', level)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                currentDifficulty === level
                  ? 'ring-2 ring-blue-600 shadow-lg'
                  : ''
              } ${difficultyColors[level as keyof typeof difficultyColors]}`}
              disabled={isPending}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(currentCategory !== 'all' || currentDifficulty !== 'all' || currentSearch) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Active filters:</span>
          {currentCategory !== 'all' && (
            <button
              onClick={() => updateFilter('category', 'all')}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
            >
              {currentCategory}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {currentDifficulty !== 'all' && (
            <button
              onClick={() => updateFilter('difficulty', 'all')}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
            >
              {currentDifficulty}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {currentSearch && (
            <button
              onClick={() => {
                setSearchValue('');
                updateFilter('search', '');
              }}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
            >
              &quot;{currentSearch}&quot;
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

