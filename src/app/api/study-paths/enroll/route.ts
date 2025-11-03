import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studyPathId, userId } = body;

    console.log('Enroll request received:', { studyPathId, userId });

    if (!studyPathId || !userId) {
      console.error('Missing fields:', { studyPathId, userId });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existing = await prisma.userStudyPath.findUnique({
      where: {
        userId_studyPathId: {
          userId,
          studyPathId,
        },
      },
    });

    if (existing) {
      console.log('User already enrolled');
      return NextResponse.json(
        { error: 'Already enrolled' },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.userStudyPath.create({
      data: {
        userId,
        studyPathId,
        status: 'in-progress',
        startedAt: new Date(),
        lastAccessedAt: new Date(),
      },
    });

    console.log('Enrollment created successfully:', enrollment.id);
    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Enrollment error details:', error);
    return NextResponse.json(
      { error: 'Failed to enroll', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

