import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Keep database connection warm
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
