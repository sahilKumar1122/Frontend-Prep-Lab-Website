import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedStudyPaths() {
  console.log('🌱 Seeding study paths...');

  // Get all questions
  const angularQuestion = await prisma.question.findFirst({
    where: { category: 'angular' },
  });
  const reactQuestion = await prisma.question.findFirst({
    where: { category: 'react' },
  });
  const jsQuestion = await prisma.question.findFirst({
    where: { category: 'javascript' },
  });
  const cssQuestion = await prisma.question.findFirst({
    where: { category: 'css' },
  });
  const tsQuestion = await prisma.question.findFirst({
    where: { category: 'typescript' },
  });

  // Clear existing study paths
  await prisma.studyPath.deleteMany();
  console.log('✓ Cleared existing study paths');

  // Create Junior Frontend Developer Path
  const juniorPath = await prisma.studyPath.create({
    data: {
      name: 'Junior Frontend Developer',
      slug: 'junior-frontend-developer',
      description: 'Perfect for beginners starting their frontend journey. Master the fundamentals of HTML, CSS, JavaScript, and basic React concepts.',
      level: 'junior',
      category: 'full-stack',
      estimatedHours: 40,
      isPublished: true,
      order: 1,
    },
  });

  // Add questions to junior path
  if (cssQuestion) {
    await prisma.studyPathItem.create({
      data: {
        studyPathId: juniorPath.id,
        questionId: cssQuestion.id,
        order: 1,
        isOptional: false,
      },
    });
  }

  if (jsQuestion) {
    await prisma.studyPathItem.create({
      data: {
        studyPathId: juniorPath.id,
        questionId: jsQuestion.id,
        order: 2,
        isOptional: false,
      },
    });
  }

  console.log('✓ Created Junior Frontend Developer path');

  // Create Mid-Level Frontend Developer Path
  const midPath = await prisma.studyPath.create({
    data: {
      name: 'Mid-Level Frontend Developer',
      slug: 'mid-level-frontend-developer',
      description: 'Advance your skills with React hooks, state management, and modern JavaScript patterns. Build production-ready applications.',
      level: 'mid',
      category: 'full-stack',
      estimatedHours: 60,
      isPublished: true,
      order: 2,
    },
  });

  // Add questions to mid path
  if (reactQuestion) {
    await prisma.studyPathItem.create({
      data: {
        studyPathId: midPath.id,
        questionId: reactQuestion.id,
        order: 1,
        isOptional: false,
      },
    });
  }

  if (tsQuestion) {
    await prisma.studyPathItem.create({
      data: {
        studyPathId: midPath.id,
        questionId: tsQuestion.id,
        order: 2,
        isOptional: false,
      },
    });
  }

  console.log('✓ Created Mid-Level Frontend Developer path');

  // Create Senior Frontend Developer Path
  const seniorPath = await prisma.studyPath.create({
    data: {
      name: 'Senior Frontend Developer',
      slug: 'senior-frontend-developer',
      description: 'Master advanced patterns, performance optimization, and system design. Lead teams and architect scalable applications.',
      level: 'senior',
      category: 'full-stack',
      estimatedHours: 80,
      isPublished: true,
      order: 3,
    },
  });

  // Add questions to senior path
  if (angularQuestion) {
    await prisma.studyPathItem.create({
      data: {
        studyPathId: seniorPath.id,
        questionId: angularQuestion.id,
        order: 1,
        isOptional: false,
      },
    });
  }

  if (tsQuestion) {
    await prisma.studyPathItem.create({
      data: {
        studyPathId: seniorPath.id,
        questionId: tsQuestion.id,
        order: 2,
        isOptional: true,
      },
    });
  }

  console.log('✓ Created Senior Frontend Developer path');

  // Create React Specialist Path
  const reactPath = await prisma.studyPath.create({
    data: {
      name: 'React Specialist',
      slug: 'react-specialist',
      description: 'Deep dive into React ecosystem. Master hooks, context, performance optimization, and advanced patterns.',
      level: 'mid',
      category: 'react',
      estimatedHours: 50,
      isPublished: true,
      order: 4,
    },
  });

  if (reactQuestion) {
    await prisma.studyPathItem.create({
      data: {
        studyPathId: reactPath.id,
        questionId: reactQuestion.id,
        order: 1,
        isOptional: false,
      },
    });
  }

  console.log('✓ Created React Specialist path');

  console.log('\n✅ Study paths seed completed!');
  console.log('📚 Created 4 study paths');
}

seedStudyPaths()
  .catch((e) => {
    console.error('❌ Error seeding study paths:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

