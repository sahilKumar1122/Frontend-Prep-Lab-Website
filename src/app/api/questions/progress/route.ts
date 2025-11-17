import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { updateUserStats } from '@/lib/streak-calculator';
import { invalidateUserCache } from '@/lib/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, questionId, status, timeSpentMinutes } = body;

    if (!userId || !questionId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use upsert instead of findUnique + update/create for better performance
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_questionId: { userId, questionId },
      },
      select: {
        id: true,
        status: true,
        startedAt: true,
        timeSpent: true,
      },
    });

    const isNewCompletion = status === 'completed' && (!existingProgress || existingProgress.status !== 'completed');
    const now = new Date();

    // Upsert progress and conditionally update stats in parallel
    const [progress] = await Promise.all([
      prisma.userProgress.upsert({
        where: {
          userId_questionId: { userId, questionId },
        },
        update: {
          status,
          completedAt: status === 'completed' ? now : null,
          timeSpent: status === 'completed' && timeSpentMinutes 
            ? timeSpentMinutes 
            : existingProgress?.timeSpent || 0,
        },
        create: {
          userId,
          questionId,
          status,
          startedAt: now,
          completedAt: status === 'completed' ? now : null,
          timeSpent: status === 'completed' && timeSpentMinutes ? timeSpentMinutes : 0,
        },
      }),
      // Update user stats in parallel if completed
      isNewCompletion 
        ? updateUserStats(userId, questionId, timeSpentMinutes || 5)
        : Promise.resolve(),
    ]);

    // Invalidate user cache when progress is updated
    invalidateUserCache(userId);

    // Set cache headers for client-side caching
    return NextResponse.json(progress, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

