import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupInvalid() {
  // Find and delete invalid questions
  const invalidTitles = [
    '---',
    '📋 Questions List',
    'Questions & Answers',
    '🎉 Congratulations!',
  ];

  console.log('🧹 Cleaning up invalid questions...\n');

  for (const title of invalidTitles) {
    const deleted = await prisma.question.deleteMany({
      where: { 
        title: title,
        category: 'angular'
      }
    });
    
    if (deleted.count > 0) {
      console.log(`✓ Deleted: "${title}" (${deleted.count} records)`);
    }
  }

  // Count remaining questions
  const count = await prisma.question.count({
    where: { category: 'angular' }
  });

  console.log(`\n✅ Cleanup complete! ${count} valid Angular questions remain.`);
}

cleanupInvalid()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

