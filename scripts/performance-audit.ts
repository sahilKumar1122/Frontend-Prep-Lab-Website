/**
 * Performance Audit Script
 * Run this to measure current performance baseline
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

interface QueryPerformance {
  query: string;
  duration: number;
  timestamp: Date;
}

const queryPerformance: QueryPerformance[] = [];

// @ts-ignore
prisma.$on('query', (e) => {
  queryPerformance.push({
    query: e.query,
    duration: e.duration,
    timestamp: new Date(),
  });
});

async function auditDatabasePerformance() {
  console.log('\n🔍 Starting Database Performance Audit...\n');

  const tests = [
    {
      name: 'Fetch all questions (list page)',
      fn: async () => {
        const start = Date.now();
        await prisma.question.findMany({
          take: 50,
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            difficulty: true,
            tags: true,
            readingTime: true,
          },
        });
        return Date.now() - start;
      },
    },
    {
      name: 'Fetch single question with all relations',
      fn: async () => {
        const start = Date.now();
        await prisma.question.findFirst({
          include: {
            progress: {
              take: 5,
            },
            studyPathItems: {
              take: 5,
              include: {
                studyPath: true,
              },
            },
          },
        });
        return Date.now() - start;
      },
    },
    {
      name: 'Fetch user progress',
      fn: async () => {
        const start = Date.now();
        await prisma.user.findFirst({
          include: {
            progress: {
              take: 50,
            },
            studyPaths: {
              take: 10,
            },
          },
        });
        return Date.now() - start;
      },
    },
    {
      name: 'Count questions by category',
      fn: async () => {
        const start = Date.now();
        await prisma.question.groupBy({
          by: ['category'],
          _count: true,
        });
        return Date.now() - start;
      },
    },
    {
      name: 'Fetch study paths with items',
      fn: async () => {
        const start = Date.now();
        await prisma.studyPath.findMany({
          include: {
            items: {
              take: 10,
              include: {
                question: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    difficulty: true,
                  },
                },
              },
            },
          },
        });
        return Date.now() - start;
      },
    },
  ];

  console.log('📊 Database Query Performance:\n');

  for (const test of tests) {
    try {
      queryPerformance.length = 0; // Clear previous queries
      const duration = await test.fn();
      
      const status = duration < 100 ? '✅' : duration < 300 ? '⚠️' : '🔴';
      console.log(`${status} ${test.name}`);
      console.log(`   Total time: ${duration}ms`);
      
      if (queryPerformance.length > 0) {
        console.log(`   Individual queries: ${queryPerformance.length}`);
        const slowQueries = queryPerformance.filter(q => q.duration > 50);
        if (slowQueries.length > 0) {
          console.log(`   ⚠️  Slow queries (>50ms): ${slowQueries.length}`);
          slowQueries.forEach(q => {
            console.log(`      - ${q.duration}ms: ${q.query.substring(0, 80)}...`);
          });
        }
      }
      console.log('');
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error}`);
      console.log('');
    }
  }
}

async function auditDataSize() {
  console.log('\n📦 Data Size Audit:\n');

  try {
    const [questionCount, userCount, studyPathCount, progressCount] = await Promise.all([
      prisma.question.count(),
      prisma.user.count(),
      prisma.studyPath.count(),
      prisma.userProgress.count(),
    ]);

    console.log(`Questions: ${questionCount}`);
    console.log(`Users: ${userCount}`);
    console.log(`Study Paths: ${studyPathCount}`);
    console.log(`Progress Records: ${progressCount}`);
    console.log('');
  } catch (error) {
    console.log('Error fetching data size:', error);
  }
}

async function suggestIndexes() {
  console.log('\n💡 Suggested Database Indexes:\n');

  const suggestions = [
    {
      table: 'Question',
      column: 'category',
      reason: 'Frequently filtered by category',
      sql: 'CREATE INDEX "idx_question_category" ON "Question"("category");',
    },
    {
      table: 'Question',
      column: 'difficulty',
      reason: 'Frequently filtered by difficulty',
      sql: 'CREATE INDEX "idx_question_difficulty" ON "Question"("difficulty");',
    },
    {
      table: 'Question',
      column: 'slug',
      reason: 'Used in individual question lookups',
      sql: 'CREATE INDEX "idx_question_slug" ON "Question"("slug");',
    },
    {
      table: 'UserProgress',
      column: 'userId + questionId',
      reason: 'Composite index for faster lookups (already exists)',
      sql: '// @@index([userId, questionId]) - Already exists in schema',
    },
    {
      table: 'StudyPathItem',
      column: 'questionId',
      reason: 'Frequently joined when loading study paths',
      sql: '@@index([questionId])',
    },
    {
      table: 'Question',
      column: 'category',
      reason: 'Individual index for category filtering',
      sql: '@@index([category])',
    },
  ];

  suggestions.forEach(s => {
    console.log(`📌 ${s.table}.${s.column}`);
    console.log(`   Reason: ${s.reason}`);
    console.log(`   SQL: ${s.sql}`);
    console.log('');
  });
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  PERFORMANCE AUDIT - Frontend Prep Lab                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  await auditDataSize();
  await auditDatabasePerformance();
  await suggestIndexes();

  console.log('\n📋 Next Steps:');
  console.log('1. Review the slow queries (>100ms)');
  console.log('2. Add suggested indexes to your Prisma schema');
  console.log('3. Run Lighthouse audit on key pages');
  console.log('4. Check bundle size with: npm run build');
  console.log('5. Profile pages with Chrome DevTools');
  console.log('\n✅ Audit complete!\n');
}

main()
  .catch((e) => {
    console.error('Error running audit:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

