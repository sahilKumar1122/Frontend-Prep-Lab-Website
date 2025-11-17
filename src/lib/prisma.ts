import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : [], // Minimal logging
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
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
prisma.$connect().catch(console.error);

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

