import { PrismaClient } from '@prisma/client';
import { calculateStreak } from './src/lib/streak-calculator';

const prisma = new PrismaClient();

async function recalculateAllStats() {
  console.log('🔄 Recalculating user stats...\n');

  const users = await prisma.user.findMany();

  for (const user of users) {
    console.log(`📊 Processing user: ${user.name || user.email}`);

    // Get all completed questions
    const completedQuestions = await prisma.userProgress.findMany({
      where: {
        userId: user.id,
        status: 'completed',
      },
      include: {
        question: {
          select: {
            category: true,
            difficulty: true,
            readingTime: true,
          },
        },
      },
    });

    if (completedQuestions.length === 0) {
      console.log(`  ⊘ No completed questions\n`);
      continue;
    }

    // Calculate total time spent (estimated)
    const totalTimeSpent = completedQuestions.reduce(
      (sum, q) => sum + (q.question?.readingTime || 5),
      0
    );

    // Group by category
    const questionsByCategory: Record<string, number> = {};
    const questionsByDifficulty: Record<string, number> = {};

    completedQuestions.forEach((q) => {
      if (q.question) {
        questionsByCategory[q.question.category] = 
          (questionsByCategory[q.question.category] || 0) + 1;
        questionsByDifficulty[q.question.difficulty] = 
          (questionsByDifficulty[q.question.difficulty] || 0) + 1;
      }
    });

    // Calculate streaks
    const { currentStreak, longestStreak } = await calculateStreak(user.id);

    // Calculate average time per question
    const averageTimePerQuestion = totalTimeSpent / completedQuestions.length;

    // Get last study date
    const lastCompleted = completedQuestions.sort(
      (a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
    )[0];

    // Update or create user stats
    await prisma.userStats.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        totalQuestionsCompleted: completedQuestions.length,
        totalTimeSpent,
        questionsByCategory,
        questionsByDifficulty,
        currentStreak,
        longestStreak,
        lastStudyDate: lastCompleted.completedAt || new Date(),
        averageTimePerQuestion,
      },
      update: {
        totalQuestionsCompleted: completedQuestions.length,
        totalTimeSpent,
        questionsByCategory,
        questionsByDifficulty,
        currentStreak,
        longestStreak,
        lastStudyDate: lastCompleted.completedAt || new Date(),
        averageTimePerQuestion,
      },
    });

    console.log(`  ✓ Questions completed: ${completedQuestions.length}`);
    console.log(`  ✓ Current streak: ${currentStreak} days`);
    console.log(`  ✓ Longest streak: ${longestStreak} days`);
    console.log(`  ✓ Time spent: ${Math.round(totalTimeSpent / 60)} hours\n`);
  }

  console.log('✅ All stats recalculated!');
}

recalculateAllStats()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

