import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkQuestions() {
  const questions = await prisma.question.findMany({
    where: { category: 'angular' },
    select: {
      id: true,
      title: true,
      difficulty: true,
      tags: true,
      order: true,
    },
    orderBy: { order: 'asc' },
  });

  console.log('\n📊 Angular Questions in Database:\n');
  console.log(`Total Questions: ${questions.length}\n`);
  
  questions.forEach((q, index) => {
    console.log(`${index + 1}. ${q.title}`);
    console.log(`   Difficulty: ${q.difficulty}`);
    console.log(`   Tags: ${q.tags.join(', ')}`);
    console.log('');
  });

  // Count by difficulty
  const difficulties = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📈 Breakdown by Difficulty:');
  Object.entries(difficulties).forEach(([diff, count]) => {
    console.log(`   ${diff}: ${count}`);
  });
}

checkQuestions()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });






