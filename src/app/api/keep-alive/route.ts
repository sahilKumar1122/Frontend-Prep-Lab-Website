import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Keep-alive endpoint to prevent database from sleeping
 * Call this from a cron job every 5 minutes
 */
export async function GET() {
  try {
    // Simple query to wake database
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Keep-alive failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

