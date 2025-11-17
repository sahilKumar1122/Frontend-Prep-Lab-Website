/**
 * Simple in-memory cache for database queries
 * Helps reduce database load for frequently accessed data
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class QueryCache {
  private cache: Map<string, CacheEntry<unknown>>;
  private defaultTTL: number;

  constructor(defaultTTL = 60000) { // 60 seconds default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get cached data or execute query function if cache miss
   */
  async get<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached data if valid
    if (cached && now - cached.timestamp < ttl) {
      return cached.data as T;
    }

    // Execute query and cache result
    const data = await queryFn();
    this.cache.set(key, { data, timestamp: now });

    // Cleanup old entries periodically
    if (this.cache.size > 100) {
      this.cleanup();
    }

    return data;
  }

  /**
   * Invalidate cache for a specific key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate cache by pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.defaultTTL * 2) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const queryCache = new QueryCache(60000); // 60 second TTL

// Helper function to generate cache keys
export function getCacheKey(prefix: string, ...params: unknown[]): string {
  return `${prefix}:${params.map(p => JSON.stringify(p)).join(':')}`;
}

// Commonly used cache keys
export const CacheKeys = {
  QUESTIONS_ALL: 'questions:all',
  QUESTIONS_BY_CATEGORY: (category: string) => `questions:category:${category}`,
  QUESTIONS_BY_DIFFICULTY: (difficulty: string) => `questions:difficulty:${difficulty}`,
  CATEGORY_COUNTS: 'questions:category-counts',
  STUDY_PATHS_ALL: 'study-paths:all',
  STUDY_PATH_BY_SLUG: (slug: string) => `study-path:${slug}`,
  USER_STATS: (userId: string) => `user-stats:${userId}`,
  USER_PROGRESS: (userId: string) => `user-progress:${userId}`,
};

// Cache invalidation helpers
export const invalidateQuestionCache = () => {
  queryCache.invalidatePattern('^questions:');
};

export const invalidateUserCache = (userId: string) => {
  queryCache.invalidatePattern(`^user-(stats|progress):${userId}`);
};

export const invalidateStudyPathCache = () => {
  queryCache.invalidatePattern('^study-path');
};

