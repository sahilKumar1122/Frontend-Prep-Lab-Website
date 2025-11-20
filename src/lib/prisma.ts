import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Optimize DATABASE_URL for serverless (Vercel)
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  
  // Add connection pooling parameters for serverless if not already present
  if (process.env.NODE_ENV === 'production' && !url.includes('connection_limit')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}connection_limit=1&pool_timeout=20`;
  }
  return url;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : [], // Minimal logging
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
  omit: {
    question: {
      content: false,
      answer: false,
    },
  },
});

// Aggressive connection warming - keep connection alive
// Only connect if DATABASE_URL is available
if (process.env.DATABASE_URL) {
  prisma.$connect().catch((error) => {
    console.error('Failed to connect to database:', error);
  });
}

// Keep-alive query every 5 minutes to prevent cold starts
if (process.env.NODE_ENV === 'development') {
  setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      console.error('Keep-alive query failed:', error);
    }
  }, 300000); // 5 minutes
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

