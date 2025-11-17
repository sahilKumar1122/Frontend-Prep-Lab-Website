import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAngularSummaries() {
  const angularQuestions = await prisma.question.findMany({
    where: {
      category: 'angular'
    },
    select: {
      title: true,
      answer: true
    }
  });

  console.log(`\n🔍 Checking ${angularQuestions.length} Angular questions for generic summaries...\n`);

  let genericCount = 0;
  let specificCount = 0;
  let noSummaryCount = 0;

  const genericExamples: string[] = [];

  for (const q of angularQuestions) {
    // Extract Quick Summary
    const summaryMatch = q.answer.match(/#### 🎯 Quick Summary\n\n([\s\S]*?)\n\n/);
    
    if (!summaryMatch) {
      noSummaryCount++;
      continue;
    }

    const summary = summaryMatch[1];
    
    // Check for generic patterns
    const isGeneric = (
      (summary.includes('is a fundamental concept in Angular development') ||
       summary.includes('is important for building robust applications') ||
       summary.includes('particularly useful for managing complex scenarios') ||
       summary.includes('Understanding this concept helps developers create better'))
      &&
      (summary.includes('more maintainable Angular applications') ||
       summary.includes('better, more maintainable'))
    );

    if (isGeneric) {
      genericCount++;
      if (genericExamples.length < 5) {
        genericExamples.push(q.title);
      }
    } else {
      specificCount++;
    }
  }

  console.log('📊 Results:\n');
  console.log(`✅ Specific summaries: ${specificCount}`);
  console.log(`❌ Generic summaries: ${genericCount}`);
  console.log(`⚠️  No summary section: ${noSummaryCount}`);
  console.log(`\n📈 Total: ${angularQuestions.length}`);

  if (genericCount > 0) {
    console.log(`\n\n❌ Examples of questions with generic summaries:\n`);
    genericExamples.forEach((title, idx) => {
      console.log(`${idx + 1}. ${title}`);
    });
    console.log(`\n... and ${genericCount - genericExamples.length} more`);
  } else {
    console.log(`\n✨ Great! All Angular questions have specific summaries!`);
  }

  await prisma.$disconnect();
}

checkAngularSummaries().catch(console.error);

