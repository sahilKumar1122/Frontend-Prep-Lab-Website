import { prisma } from './prisma';

/**
 * Calculate streak based on daily activity
 */
export async function calculateStreak(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
}> {
  // Get all daily activities ordered by date descending
  const activities = await prisma.dailyActivity.findMany({
    where: { 
      userId,
      questionsCompleted: { gt: 0 } // Only count days with activity
    },
    orderBy: { date: 'desc' },
    select: { date: true },
  });

  if (activities.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(activities[0].date);
  checkDate.setHours(0, 0, 0, 0);

  // Check if latest activity is today or yesterday
  if (checkDate.getTime() === today.getTime() || checkDate.getTime() === yesterday.getTime()) {
    currentStreak = 1;
    
    // Count consecutive days
    for (let i = 1; i < activities.length; i++) {
      const prevDate = new Date(activities[i - 1].date);
      prevDate.setHours(0, 0, 0, 0);
      
      const currDate = new Date(activities[i].date);
      currDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = currentStreak;
  let tempStreak = 1;

  for (let i = 1; i < activities.length; i++) {
    const prevDate = new Date(activities[i - 1].date);
    prevDate.setHours(0, 0, 0, 0);
    
    const currDate = new Date(activities[i].date);
    currDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Update user stats with streak and time information
 */
export async function updateUserStats(userId: string, questionId: string, timeSpentMinutes: number = 5) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Update or create daily activity
  await prisma.dailyActivity.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    create: {
      userId,
      date: today,
      questionsCompleted: 1,
      timeSpent: timeSpentMinutes,
    },
    update: {
      questionsCompleted: { increment: 1 },
      timeSpent: { increment: timeSpentMinutes },
    },
  });

  // Calculate streaks
  const { currentStreak, longestStreak } = await calculateStreak(userId);

  // Get question for category tracking
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { category: true, difficulty: true },
  });

  // Get current stats
  const currentStats = await prisma.userStats.findUnique({
    where: { userId },
  });

  const questionsByCategory = currentStats?.questionsByCategory as Record<string, number> || {};
  const questionsByDifficulty = currentStats?.questionsByDifficulty as Record<string, number> || {};

  if (question) {
    questionsByCategory[question.category] = (questionsByCategory[question.category] || 0) + 1;
    questionsByDifficulty[question.difficulty] = (questionsByDifficulty[question.difficulty] || 0) + 1;
  }

  const totalQuestionsCompleted = (currentStats?.totalQuestionsCompleted || 0) + 1;
  const totalTimeSpent = (currentStats?.totalTimeSpent || 0) + timeSpentMinutes;
  const averageTimePerQuestion = totalTimeSpent / totalQuestionsCompleted;

  // Update or create user stats
  await prisma.userStats.upsert({
    where: { userId },
    create: {
      userId,
      totalQuestionsCompleted: 1,
      totalTimeSpent: timeSpentMinutes,
      questionsByCategory,
      questionsByDifficulty,
      currentStreak,
      longestStreak,
      lastStudyDate: new Date(),
      averageTimePerQuestion,
    },
    update: {
      totalQuestionsCompleted,
      totalTimeSpent,
      questionsByCategory,
      questionsByDifficulty,
      currentStreak,
      longestStreak,
      lastStudyDate: new Date(),
      averageTimePerQuestion,
    },
  });

  return { currentStreak, longestStreak, totalTimeSpent };
}

