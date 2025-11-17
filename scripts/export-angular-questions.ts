import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function exportAngularQuestions() {
  const questions = await prisma.question.findMany({
    where: {
      category: 'angular'
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      answer: true,
      difficulty: true,
      tags: true
    },
    orderBy: {
      title: 'asc'
    }
  });

  console.log(`📦 Exporting ${questions.length} Angular questions...\n`);

  // Save to JSON file
  fs.writeFileSync(
    'angular-questions-export.json',
    JSON.stringify(questions, null, 2)
  );

  console.log('✅ Exported to: angular-questions-export.json');

  // Also create a simple list for reference
  const simpleList = questions.map(q => ({
    title: q.title,
    slug: q.slug,
    difficulty: q.difficulty,
    hasQuickSummary: q.answer.includes('#### 🎯 Quick Summary')
  }));

  fs.writeFileSync(
    'angular-questions-list.json',
    JSON.stringify(simpleList, null, 2)
  );

  console.log('✅ Created list: angular-questions-list.json\n');

  await prisma.$disconnect();
}

exportAngularQuestions().catch(console.error);

