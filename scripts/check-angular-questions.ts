import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAngularQuestions() {
  // Check for Angular questions
  const angularQuestions = await prisma.question.findMany({
    where: {
      OR: [
        { category: 'angular' },
        { slug: { startsWith: 'angular-' } },
        { tags: { has: 'angular' } }
      ]
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      answer: true
    }
  });

  console.log(`\n📊 Found ${angularQuestions.length} Angular questions\n`);

  if (angularQuestions.length > 0) {
    console.log('Sample Angular questions:');
    angularQuestions.slice(0, 5).forEach((q, idx) => {
      console.log(`${idx + 1}. ${q.title} (${q.slug})`);
      
      // Check if it has generic summary
      const quickSummaryMatch = q.answer.match(/## 🎯 Quick Summary\n\n([\s\S]*?)\n\n---/);
      if (quickSummaryMatch) {
        const summary = quickSummaryMatch[1];
        const isGeneric = summary.includes('is a fundamental concept') || 
                          summary.includes('helps write better') ||
                          summary.includes('more maintainable');
        console.log(`   Summary type: ${isGeneric ? '❌ Generic' : '✅ Specific'}`);
        console.log(`   Preview: ${summary.substring(0, 100)}...`);
      }
      console.log('');
    });
  } else {
    console.log('ℹ️  No Angular questions found in the database.');
  }

  // Also check JavaScript questions count
  const jsQuestions = await prisma.question.findMany({
    where: {
      OR: [
        { category: 'javascript' },
        { slug: { startsWith: 'js-' } }
      ]
    },
    select: { id: true }
  });

  console.log(`\n📊 Found ${jsQuestions.length} JavaScript questions (already updated)`);

  await prisma.$disconnect();
}

checkAngularQuestions().catch(console.error);

