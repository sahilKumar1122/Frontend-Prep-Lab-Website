import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { updateUserStats } from '@/lib/streak-calculator';

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

    // Check if progress exists
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    let progress;

    if (existingProgress) {
      // Update existing progress
      progress = await prisma.userProgress.update({
        where: {
          userId_questionId: {
            userId,
            questionId,
          },
        },
        data: {
          status,
          completedAt: status === 'completed' ? new Date() : null,
          startedAt: existingProgress.startedAt || new Date(),
          timeSpent: status === 'completed' && timeSpentMinutes 
            ? timeSpentMinutes 
            : existingProgress.timeSpent,
        },
      });
    } else {
      // Create new progress
      progress = await prisma.userProgress.create({
        data: {
          userId,
          questionId,
          status,
          startedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : null,
          timeSpent: status === 'completed' && timeSpentMinutes 
            ? timeSpentMinutes 
            : 0,
        },
      });
    }

    // Update user stats if completed
    if (status === 'completed' && (!existingProgress || existingProgress.status !== 'completed')) {
      // Update stats with streak and time tracking
      await updateUserStats(userId, questionId, timeSpentMinutes || 5);
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

