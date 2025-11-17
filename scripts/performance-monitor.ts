/**
 * Performance Monitoring Script
 * Run this periodically to track performance over time
 */

import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const prisma = new PrismaClient();

interface PerformanceMetrics {
  timestamp: string;
  databaseMetrics: {
    avgQueryTime: number;
    slowQueries: number;
    totalQueries: number;
  };
  dataMetrics: {
    totalQuestions: number;
    totalUsers: number;
    totalProgress: number;
  };
}

async function measureQueryPerformance(
  name: string,
  queryFn: () => Promise<any>
): Promise<{ result: any; duration: number }> {
  const start = performance.now();
  const result = await queryFn();
  const duration = performance.now() - start;
  
  const status = duration < 100 ? '✅' : duration < 300 ? '⚠️' : '🔴';
  console.log(`${status} ${name}: ${duration.toFixed(2)}ms`);
  
  return { result, duration };
}

async function runPerformanceMonitoring(): Promise<PerformanceMetrics> {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         PERFORMANCE MONITORING REPORT                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\nTimestamp: ${new Date().toISOString()}\n`);

  console.log('📊 Running Performance Tests...\n');

  const queryDurations: number[] = [];

  // Test 1: Question List Query
  const { duration: d1 } = await measureQueryPerformance(
    'Question List (50 items)',
    () => prisma.question.findMany({
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
    })
  );
  queryDurations.push(d1);

  // Test 2: Question with Relations
  const { duration: d2 } = await measureQueryPerformance(
    'Question with Relations',
    () => prisma.question.findFirst({
      include: {
        progress: { take: 5 },
        studyPathItems: { take: 5 },
      },
    })
  );
  queryDurations.push(d2);

  // Test 3: User with Progress
  const { duration: d3 } = await measureQueryPerformance(
    'User with Progress',
    () => prisma.user.findFirst({
      include: {
        progress: { take: 50 },
        userStats: true,
      },
    })
  );
  queryDurations.push(d3);

  // Test 4: Category Grouping
  const { duration: d4 } = await measureQueryPerformance(
    'Category Grouping',
    () => prisma.question.groupBy({
      by: ['category'],
      _count: true,
    })
  );
  queryDurations.push(d4);

  // Test 5: Study Paths with Items
  const { duration: d5 } = await measureQueryPerformance(
    'Study Paths with Items',
    () => prisma.studyPath.findMany({
      include: {
        items: {
          take: 10,
          include: {
            question: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    })
  );
  queryDurations.push(d5);

  // Test 6: Filtered Questions
  const { duration: d6 } = await measureQueryPerformance(
    'Filtered Questions (category + difficulty)',
    () => prisma.question.findMany({
      where: {
        category: 'react',
        difficulty: 'medium',
      },
      take: 20,
    })
  );
  queryDurations.push(d6);

  console.log('\n📈 Database Metrics:\n');

  const avgQueryTime = queryDurations.reduce((a, b) => a + b, 0) / queryDurations.length;
  const slowQueries = queryDurations.filter(d => d > 100).length;

  console.log(`Average Query Time: ${avgQueryTime.toFixed(2)}ms`);
  console.log(`Slow Queries (>100ms): ${slowQueries}/${queryDurations.length}`);
  console.log(`Fastest Query: ${Math.min(...queryDurations).toFixed(2)}ms`);
  console.log(`Slowest Query: ${Math.max(...queryDurations).toFixed(2)}ms`);

  // Get data size metrics
  console.log('\n📦 Data Size:\n');

  const [questionCount, userCount, progressCount, studyPathCount] = await Promise.all([
    prisma.question.count(),
    prisma.user.count(),
    prisma.userProgress.count(),
    prisma.studyPath.count(),
  ]);

  console.log(`Questions: ${questionCount}`);
  console.log(`Users: ${userCount}`);
  console.log(`Progress Records: ${progressCount}`);
  console.log(`Study Paths: ${studyPathCount}`);

  // Performance recommendations
  console.log('\n💡 Recommendations:\n');

  if (avgQueryTime > 200) {
    console.log('⚠️  Average query time is high. Consider:');
    console.log('   - Adding more database indexes');
    console.log('   - Implementing query result caching');
    console.log('   - Optimizing complex queries');
  } else if (avgQueryTime > 100) {
    console.log('⚠️  Query performance is acceptable but could be improved');
  } else {
    console.log('✅ Query performance is excellent!');
  }

  if (slowQueries > queryDurations.length / 2) {
    console.log('⚠️  More than 50% of queries are slow');
    console.log('   - Review slow query logs');
    console.log('   - Check database index usage');
  }

  if (progressCount > 10000 && avgQueryTime > 150) {
    console.log('⚠️  Large dataset with slower queries detected');
    console.log('   - Consider implementing pagination');
    console.log('   - Add Redis caching layer');
  }

  console.log('\n✅ Monitoring complete!\n');

  const metrics: PerformanceMetrics = {
    timestamp: new Date().toISOString(),
    databaseMetrics: {
      avgQueryTime,
      slowQueries,
      totalQueries: queryDurations.length,
    },
    dataMetrics: {
      totalQuestions: questionCount,
      totalUsers: userCount,
      totalProgress: progressCount,
    },
  };

  return metrics;
}

async function main() {
  try {
    const metrics = await runPerformanceMonitoring();
    
    // Could save metrics to a file or database for tracking over time
    // await fs.writeFile(`metrics-${Date.now()}.json`, JSON.stringify(metrics, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error running performance monitoring:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

