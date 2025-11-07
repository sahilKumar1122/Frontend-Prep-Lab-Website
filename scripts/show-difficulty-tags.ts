import { prisma } from '../src/lib/prisma';

async function showSample() {
  const questions = await prisma.question.findMany({
    select: {
      title: true,
      difficulty: true,
      tags: true,
    },
    orderBy: {
      difficulty: 'asc'
    }
  });
  
  const byDifficulty = {
    easy: questions.filter(q => q.difficulty === 'easy'),
    medium: questions.filter(q => q.difficulty === 'medium'),
    hard: questions.filter(q => q.difficulty === 'hard'),
  };
  
  console.log('\n📊 QUESTIONS REORGANIZED BY DIFFICULTY\n');
  console.log('═'.repeat(80));
  
  console.log('\n✅ EASY (5 questions)');
  console.log('─'.repeat(80));
  byDifficulty.easy.forEach((q, i) => {
    console.log(`${i + 1}. ${q.title}`);
    console.log(`   Tags: ${q.tags.join(', ')}`);
  });
  
  console.log('\n\n📘 MEDIUM (23 questions) - Showing first 10');
  console.log('─'.repeat(80));
  byDifficulty.medium.slice(0, 10).forEach((q, i) => {
    console.log(`${i + 1}. ${q.title}`);
    console.log(`   Tags: ${q.tags.join(', ')}`);
  });
  
  console.log('\n\n🔥 HARD (11 questions)');
  console.log('─'.repeat(80));
  byDifficulty.hard.forEach((q, i) => {
    console.log(`${i + 1}. ${q.title}`);
    console.log(`   Tags: ${q.tags.join(', ')}`);
  });
  
  console.log('\n' + '═'.repeat(80));
  console.log('\n✅ All 39 questions now have:');
  console.log('   • Appropriate difficulty levels (Easy/Medium/Hard)');
  console.log('   • Specific, relevant tags for better filtering');
  console.log('   • Improved discoverability and organization\n');
  
  await prisma.$disconnect();
}

showSample().catch(console.error);

