import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOne() {
  const question = await prisma.question.findFirst({
    where: {
      slug: { startsWith: 'angular-' }
    }
  });

  if (question) {
    console.log(`\n📄 Question: ${question.title}`);
    console.log(`📝 Slug: ${question.slug}`);
    console.log(`\n📋 Answer structure:\n`);
    console.log(question.answer.substring(0, 1000));
    console.log('\n...\n');
  }

  await prisma.$disconnect();
}

checkOne().catch(console.error);

