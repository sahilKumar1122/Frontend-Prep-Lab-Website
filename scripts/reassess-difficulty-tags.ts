import { prisma } from '../src/lib/prisma';

/**
 * Intelligently reassess difficulty levels and add proper tags
 * Based on question content, complexity, and topic
 */

interface QuestionUpdate {
  id: string;
  title: string;
  currentDifficulty: string;
  newDifficulty: string;
  currentTags: string[];
  newTags: string[];
  reasoning: string;
}

// Difficulty criteria
const DIFFICULTY_CRITERIA = {
  easy: [
    'what is', 'what are', 'difference between', 'basic', 'introduction',
    'ngOnInit', 'constructor', 'data binding', 'interpolation', 'pipes'
  ],
  hard: [
    'debug', 'memory leak', 'optimize', 'performance', 'profiling',
    'micro-frontend', 'ssr', 'hydration', 'zoneless', 'advanced',
    'architecture', 'schematics', 'custom', 'web workers'
  ]
};

// Tag mapping based on question content
const TAG_PATTERNS: Record<string, string[]> = {
  'change detection': ['change-detection', 'performance', 'zone.js'],
  'onpush': ['change-detection', 'performance', 'optimization'],
  'constructor': ['lifecycle', 'initialization'],
  'ngoninit': ['lifecycle', 'initialization'],
  'lifecycle': ['lifecycle', 'hooks'],
  'content projection': ['components', 'ng-content', 'composition'],
  'memory leak': ['debugging', 'performance', 'rxjs', 'subscriptions'],
  'dependency injection': ['di', 'services', 'architecture'],
  'router': ['routing', 'navigation', 'lazy-loading'],
  'route guard': ['routing', 'security', 'authentication'],
  'data binding': ['templates', 'binding', 'fundamentals'],
  'reactive forms': ['forms', 'validation', 'reactive'],
  'template-driven': ['forms', 'validation', 'templates'],
  'validation': ['forms', 'validation'],
  'rxjs': ['rxjs', 'observables', 'reactive'],
  'observable': ['rxjs', 'observables', 'reactive'],
  'switchmap': ['rxjs', 'operators', 'observables'],
  'mergemap': ['rxjs', 'operators', 'observables'],
  'concatmap': ['rxjs', 'operators', 'observables'],
  'exhaustmap': ['rxjs', 'operators', 'observables'],
  'ngrx': ['state-management', 'ngrx', 'redux', 'reactive'],
  'performance': ['performance', 'optimization'],
  'lazy loading': ['performance', 'optimization', 'routing'],
  'testing': ['testing', 'unit-tests', 'jasmine'],
  'module': ['modules', 'architecture', 'organization'],
  'directive': ['directives', 'templates', 'dom'],
  'pipe': ['pipes', 'templates', 'transformation'],
  'service': ['services', 'di', 'architecture'],
  'component': ['components', 'architecture'],
  'http': ['http', 'api', 'observables'],
  'interceptor': ['http', 'api', 'middleware'],
  'aot': ['compilation', 'build', 'optimization'],
  'jit': ['compilation', 'build'],
  'ivy': ['ivy', 'compilation', 'rendering'],
  'zone': ['zone.js', 'change-detection', 'async'],
  'signals': ['signals', 'reactive', 'state-management'],
  'standalone': ['standalone', 'modules', 'modern-angular'],
  'ssr': ['ssr', 'server-side-rendering', 'performance', 'seo'],
  'hydration': ['ssr', 'hydration', 'performance'],
  'security': ['security', 'xss', 'sanitization'],
  'i18n': ['i18n', 'internationalization', 'localization'],
  'animation': ['animations', 'ui', 'transitions'],
  'renderer2': ['dom', 'rendering', 'advanced'],
  'web worker': ['web-workers', 'performance', 'threading'],
  'schematic': ['schematics', 'cli', 'code-generation'],
  'micro-frontend': ['micro-frontends', 'architecture', 'advanced'],
  'pwa': ['pwa', 'service-workers', 'offline'],
  'view encapsulation': ['styling', 'shadow-dom', 'encapsulation']
};

function analyzeDifficulty(question: any): string {
  const title = question.title.toLowerCase();
  const slug = question.slug?.toLowerCase() || '';
  
  // Easy questions - basic concepts and definitions
  const easyPatterns = [
    'difference between ngoninit and constructor',
    'what is angular router',
    'what is dependency injection',
    'what is angular\'s core architecture',
    'what is angular ivy',
    'what is the component lifecycle'
  ];
  
  // Hard questions - advanced/production topics
  const hardPatterns = [
    'memory leak',
    'debug',
    'micro-frontend',
    'schematics',
    'web worker',
    'renderer2',
    'custom structural directive',
    'dynamic component',
    'zoneless',
    'hydration',
    'ssr',
    'profile',
    'optimize performance',
    'modern angular features'
  ];
  
  // Check title for easy patterns (exact match)
  for (const pattern of easyPatterns) {
    if (title.includes(pattern)) {
      return 'easy';
    }
  }
  
  // Check title and slug for hard patterns
  for (const pattern of hardPatterns) {
    if (title.includes(pattern) || slug.includes(pattern)) {
      return 'hard';
    }
  }
  
  // Default to medium for everything else
  return 'medium';
}

function generateTags(question: any): string[] {
  const title = question.title.toLowerCase();
  const content = (question.content + question.answer).toLowerCase();
  const combinedText = title + ' ' + content;
  
  const tags = new Set<string>(['angular']); // Always include angular
  
  // Priority patterns - check title first for most relevant tags
  const priorityMatches: string[] = [];
  for (const [pattern, patternTags] of Object.entries(TAG_PATTERNS)) {
    if (title.includes(pattern)) {
      priorityMatches.push(...patternTags);
    }
  }
  
  // Add priority tags first
  priorityMatches.slice(0, 4).forEach(tag => tags.add(tag));
  
  // Then check content for additional relevant tags
  for (const [pattern, patternTags] of Object.entries(TAG_PATTERNS)) {
    if (content.includes(pattern) && !title.includes(pattern)) {
      patternTags.slice(0, 1).forEach(tag => tags.add(tag)); // Only add first tag from each pattern
    }
  }
  
  // Difficulty-based tags
  const difficulty = analyzeDifficulty(question);
  if (difficulty === 'easy') {
    tags.add('fundamentals');
  } else if (difficulty === 'hard') {
    tags.add('advanced');
  }
  
  // Limit to 6 most relevant tags
  return Array.from(tags).slice(0, 6);
}

function getReasoning(oldDiff: string, newDiff: string, question: any): string {
  if (oldDiff === newDiff) {
    return 'Difficulty confirmed as appropriate';
  }
  
  const reasons = [];
  
  if (newDiff === 'easy') {
    reasons.push('Foundational concept');
    if (question.title.toLowerCase().includes('what is')) {
      reasons.push('Definition-focused question');
    }
  } else if (newDiff === 'hard') {
    const content = (question.content + question.answer).toLowerCase();
    if (content.includes('debug') || content.includes('memory leak')) {
      reasons.push('Requires debugging/troubleshooting skills');
    }
    if (content.includes('architecture')) {
      reasons.push('Architectural/design complexity');
    }
    if (content.includes('production') || content.includes('enterprise')) {
      reasons.push('Production-level knowledge required');
    }
    if (content.split(/\s+/).length > 3000) {
      reasons.push('Extensive, comprehensive content');
    }
  } else {
    reasons.push('Intermediate complexity');
  }
  
  return reasons.join(', ');
}

async function reassessAll() {
  console.log('🔍 Reassessing difficulty levels and tags for all questions...\n');
  
  const questions = await prisma.question.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      tags: true,
      content: true,
      answer: true,
    }
  });
  
  console.log(`📊 Found ${questions.length} questions to analyze\n`);
  
  const updates: QuestionUpdate[] = [];
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  
  for (const question of questions) {
    const currentDifficulty = question.difficulty;
    const newDifficulty = analyzeDifficulty(question);
    const currentTags = Array.isArray(question.tags) ? question.tags : [];
    const newTags = generateTags(question);
    
    const update: QuestionUpdate = {
      id: question.id,
      title: question.title,
      currentDifficulty,
      newDifficulty,
      currentTags,
      newTags,
      reasoning: getReasoning(currentDifficulty, newDifficulty, question)
    };
    
    updates.push(update);
    
    if (newDifficulty === 'easy') easyCount++;
    else if (newDifficulty === 'medium') mediumCount++;
    else hardCount++;
  }
  
  console.log('📈 NEW DIFFICULTY DISTRIBUTION');
  console.log('═'.repeat(80));
  console.log(`Easy: ${easyCount} (${Math.round(easyCount/questions.length*100)}%)`);
  console.log(`Medium: ${mediumCount} (${Math.round(mediumCount/questions.length*100)}%)`);
  console.log(`Hard: ${hardCount} (${Math.round(hardCount/questions.length*100)}%)`);
  console.log('');
  
  // Show sample changes
  console.log('📝 SAMPLE REASSESSMENTS (First 10)');
  console.log('═'.repeat(80));
  updates.slice(0, 10).forEach((update, i) => {
    const diffChanged = update.currentDifficulty !== update.newDifficulty;
    const tagsChanged = JSON.stringify(update.currentTags) !== JSON.stringify(update.newTags);
    
    console.log(`\n${i + 1}. ${update.title}`);
    if (diffChanged) {
      console.log(`   Difficulty: ${update.currentDifficulty} → ${update.newDifficulty} ${diffChanged ? '✨' : ''}`);
      console.log(`   Reason: ${update.reasoning}`);
    } else {
      console.log(`   Difficulty: ${update.newDifficulty} (unchanged)`);
    }
    if (tagsChanged) {
      console.log(`   Tags: ${update.currentTags.join(', ')} → ${update.newTags.join(', ')}`);
    } else {
      console.log(`   Tags: ${update.newTags.join(', ')}`);
    }
  });
  
  console.log('\n\n❓ Apply these changes to database? (y/n)');
  console.log('   Preview full changes? Run with --preview flag\n');
  
  // If --apply flag is present, apply changes
  if (process.argv.includes('--apply')) {
    console.log('✍️  Applying changes to database...\n');
    
    let updated = 0;
    for (const update of updates) {
      await prisma.question.update({
        where: { id: update.id },
        data: {
          difficulty: update.newDifficulty,
          tags: update.newTags
        }
      });
      updated++;
      
      if (updated % 10 === 0) {
        console.log(`   Updated ${updated}/${updates.length}...`);
      }
    }
    
    console.log('\n✅ All questions updated successfully!');
    console.log('\n📊 FINAL DISTRIBUTION:');
    console.log('═'.repeat(80));
    console.log(`✅ Easy: ${easyCount} questions`);
    console.log(`✅ Medium: ${mediumCount} questions`);
    console.log(`✅ Hard: ${hardCount} questions`);
    console.log(`✅ Tags: All questions have relevant, specific tags`);
    
  } else if (process.argv.includes('--preview')) {
    console.log('\n📋 FULL PREVIEW OF ALL CHANGES');
    console.log('═'.repeat(80));
    updates.forEach((update, i) => {
      const diffChanged = update.currentDifficulty !== update.newDifficulty;
      
      console.log(`\n${i + 1}. ${update.title}`);
      console.log(`   Difficulty: ${update.currentDifficulty} → ${update.newDifficulty} ${diffChanged ? '✨' : ''}`);
      if (diffChanged) {
        console.log(`   Reason: ${update.reasoning}`);
      }
      console.log(`   New Tags: ${update.newTags.join(', ')}`);
    });
    console.log('\n\n✅ To apply these changes, run:');
    console.log('   npm run reassess:difficulty -- --apply\n');
  } else {
    console.log('ℹ️  No changes applied. This was a dry run.');
    console.log('\n📋 To see all changes: npm run reassess:difficulty -- --preview');
    console.log('✅ To apply changes: npm run reassess:difficulty -- --apply\n');
  }
  
  await prisma.$disconnect();
}

reassessAll().catch(console.error);

