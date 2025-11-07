import { prisma } from '../src/lib/prisma';

async function getQuestion() {
  const questionId = process.argv[2];
  
  if (!questionId) {
    console.error('❌ Please provide a question ID');
    console.log('Usage: npm run get:question <question-id>');
    process.exit(1);
  }
  
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      difficulty: true,
      tags: true,
      content: true,
      answer: true,
      codeExample: true,
      readingTime: true,
    }
  });
  
  if (!question) {
    console.error('❌ Question not found');
    process.exit(1);
  }
  
  console.log('📝 Question Details:\n');
  console.log(`ID: ${question.id}`);
  console.log(`Title: ${question.title}`);
  console.log(`Slug: ${question.slug}`);
  console.log(`Category: ${question.category}`);
  console.log(`Difficulty: ${question.difficulty}`);
  console.log(`Tags: ${question.tags.join(', ')}`);
  console.log(`\n${'═'.repeat(80)}`);
  console.log('CONTENT:');
  console.log('═'.repeat(80));
  console.log(question.content);
  console.log(`\n${'═'.repeat(80)}`);
  console.log('ANSWER:');
  console.log('═'.repeat(80));
  console.log(question.answer);
  
  await prisma.$disconnect();
}

getQuestion().catch(console.error);

