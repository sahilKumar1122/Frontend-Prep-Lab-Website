import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getQuestion() {
  const title = process.argv[2];
  
  if (!title) {
    console.error('❌ Please provide a question title');
    process.exit(1);
  }

  const question = await prisma.question.findFirst({
    where: {
      title: {
        contains: title
      }
    }
  });

  if (!question) {
    console.error('❌ Question not found');
    process.exit(1);
  }

  console.log(`\n📄 Question: ${question.title}`);
  console.log(`📝 Slug: ${question.slug}`);
  console.log(`\n📋 Answer:\n`);
  console.log(question.answer);

  await prisma.$disconnect();
}

getQuestion().catch(console.error);

