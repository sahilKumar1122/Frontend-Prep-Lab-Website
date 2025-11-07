import { prisma } from '../src/lib/prisma';
import fs from 'fs';

interface CoverageAnalysis {
  newQuestion: string;
  status: 'covered' | 'partially-covered' | 'new';
  coveredBy?: string[];
  confidence: number;
  reasoning: string;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractKeywords(text: string): Set<string> {
  const normalized = normalizeText(text);
  const words = normalized.split(' ');
  
  // Filter out common words
  const commonWords = new Set([
    'what', 'is', 'are', 'how', 'do', 'does', 'can', 'the', 'a', 'an', 'in', 'to', 'for',
    'and', 'or', 'you', 'it', 'of', 'with', 'on', 'at', 'from', 'by', 'as', 'be', 'this',
    'that', 'they', 'have', 'has', 'had', 'been', 'being', 'will', 'would', 'should',
    'could', 'i', 'we', 'use', 'using', 'explain', 'give', 'example', 'list', 'down'
  ]);
  
  return new Set(words.filter(w => w.length > 2 && !commonWords.has(w)));
}

function calculateTopicOverlap(newQ: string, existingTitle: string, existingAnswer: string): number {
  const newKeywords = extractKeywords(newQ);
  const existingKeywords = extractKeywords(existingTitle + ' ' + existingAnswer);
  
  if (newKeywords.size === 0) return 0;
  
  let matches = 0;
  for (const keyword of newKeywords) {
    if (existingKeywords.has(keyword)) {
      matches++;
    }
  }
  
  return matches / newKeywords.size;
}

function isTopicCovered(
  newQuestion: string,
  existingQuestions: Array<{ title: string; answer: string; content: string }>
): CoverageAnalysis {
  const newLower = normalizeText(newQuestion);
  const newKeywords = extractKeywords(newQuestion);
  
  let bestMatch: { title: string; overlap: number } | null = null;
  const coveringQuestions: string[] = [];
  
  for (const existing of existingQuestions) {
    const overlap = calculateTopicOverlap(
      newQuestion,
      existing.title,
      existing.answer + existing.content
    );
    
    if (overlap > 0.6) {
      coveringQuestions.push(existing.title);
      if (!bestMatch || overlap > bestMatch.overlap) {
        bestMatch = { title: existing.title, overlap };
      }
    }
  }
  
  // Specific semantic rules
  
  // 1. Constructor vs ngOnInit
  if (newLower.includes('constructor') && newLower.includes('ngoninit')) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('constructor') && q.title.toLowerCase().includes('ngoninit')
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 100,
        reasoning: 'Exact topic match in existing question'
      };
    }
  }
  
  // 2. Lifecycle hooks
  if ((newLower.includes('lifecycle') && newLower.includes('hook')) ||
      newLower.includes('ngoninit') || newLower.includes('ngonchanges') ||
      newLower.includes('ngondestroy') || newLower.includes('ngafterviewinit')) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('lifecycle') || 
      (q.answer.toLowerCase().includes('lifecycle') && q.answer.toLowerCase().includes('hook'))
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 95,
        reasoning: 'Lifecycle hooks covered in existing comprehensive answer'
      };
    }
  }
  
  // 3. Data binding types
  if (newLower.includes('data binding') || newLower.includes('interpolation') ||
      newLower.includes('property binding') || newLower.includes('event binding')) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('data binding') ||
      (q.answer.toLowerCase().includes('interpolation') && q.answer.toLowerCase().includes('property binding'))
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 90,
        reasoning: 'Data binding concepts covered comprehensively'
      };
    }
  }
  
  // 4. RxJS operators
  if (newLower.includes('switchmap') || newLower.includes('mergemap') ||
      newLower.includes('concatmap') || newLower.includes('exhaustmap') ||
      (newLower.includes('rxjs') && newLower.includes('operator'))) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('rxjs operators') ||
      (q.title.toLowerCase().includes('switchmap') && q.answer.length > 2000)
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 95,
        reasoning: 'RxJS operators explained in detail'
      };
    }
  }
  
  // 5. Change Detection
  if (newLower.includes('change detection') || 
      (newLower.includes('zone') && !newLower.includes('zoneless'))) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('change detection') &&
      q.answer.toLowerCase().includes('zone')
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 90,
        reasoning: 'Change detection mechanism covered including zones'
      };
    }
  }
  
  // 6. Routing
  if (newLower.includes('route') && !newLower.includes('guard') && !newLower.includes('parameter')) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('router') &&
      q.answer.length > 2000
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 85,
        reasoning: 'Routing concepts covered in comprehensive router answer'
      };
    }
  }
  
  // 7. Pipes
  if ((newLower.includes('pipe') && !newLower.includes('async')) ||
      newLower.includes('pure pipe') || newLower.includes('impure pipe') ||
      newLower.includes('custom pipe')) {
    const match = existingQuestions.find(q => 
      q.answer.toLowerCase().includes('pipe') &&
      q.answer.toLowerCase().includes('transform') &&
      q.answer.length > 1500
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 85,
        reasoning: 'Pipe concepts likely covered in existing content'
      };
    }
  }
  
  // 8. Observables
  if ((newLower.includes('observable') || newLower.includes('observer') ||
       newLower.includes('subscribe') || newLower.includes('subscription')) &&
      !newLower.includes('signal')) {
    const match = existingQuestions.find(q => 
      (q.title.toLowerCase().includes('observable') || q.title.toLowerCase().includes('rxjs')) &&
      q.answer.length > 2000
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 85,
        reasoning: 'Observable concepts covered in RxJS/Observable questions'
      };
    }
  }
  
  // 9. Forms
  if (newLower.includes('form') && !newLower.includes('validation strategy')) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('form') &&
      q.answer.length > 2000
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 80,
        reasoning: 'Forms concepts covered in existing comprehensive answers'
      };
    }
  }
  
  // 10. Dependency Injection
  if (newLower.includes('dependency injection') || newLower.includes('provider') ||
      newLower.includes('injector') || newLower.includes('injectable')) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('dependency injection') &&
      q.answer.length > 2000
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 85,
        reasoning: 'DI concepts covered comprehensively'
      };
    }
  }
  
  // 11. Testing
  if (newLower.includes('test') && !newLower.includes('e2e') && !newLower.includes('protractor')) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('testing') &&
      q.answer.length > 2000
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 80,
        reasoning: 'Testing concepts likely covered'
      };
    }
  }
  
  // 12. Compilation (AOT/JIT)
  if ((newLower.includes('aot') || newLower.includes('jit') || 
       newLower.includes('compilation')) && !newLower.includes('ivy')) {
    const match = existingQuestions.find(q => 
      q.title.toLowerCase().includes('aot') || q.title.toLowerCase().includes('jit') ||
      (q.answer.toLowerCase().includes('aot') && q.answer.toLowerCase().includes('jit'))
    );
    if (match) {
      return {
        newQuestion,
        status: 'covered',
        coveredBy: [match.title],
        confidence: 90,
        reasoning: 'Compilation concepts covered'
      };
    }
  }
  
  // General overlap-based decision
  if (bestMatch && bestMatch.overlap > 0.7) {
    return {
      newQuestion,
      status: 'covered',
      coveredBy: coveringQuestions,
      confidence: Math.round(bestMatch.overlap * 100),
      reasoning: `High keyword overlap (${Math.round(bestMatch.overlap * 100)}%) with existing answer`
    };
  } else if (bestMatch && bestMatch.overlap > 0.4) {
    return {
      newQuestion,
      status: 'partially-covered',
      coveredBy: coveringQuestions,
      confidence: Math.round(bestMatch.overlap * 100),
      reasoning: `Partial overlap (${Math.round(bestMatch.overlap * 100)}%), may add some value`
    };
  }
  
  return {
    newQuestion,
    status: 'new',
    confidence: 0,
    reasoning: 'Truly new topic not covered in existing questions'
  };
}

async function analyzeSemanticDuplicates() {
  console.log('🔍 Performing Semantic Duplicate Analysis\n');
  console.log('═'.repeat(80));
  console.log('Checking if new questions are already covered in existing answers...\n');
  
  // Load existing questions with full content
  const existingQuestions = await prisma.question.findMany({
    select: {
      title: true,
      content: true,
      answer: true,
    }
  });
  
  console.log(`📚 Loaded ${existingQuestions.length} existing questions with full content\n`);
  
  // Load new questions
  const data = JSON.parse(fs.readFileSync('new-questions-to-add.json', 'utf-8'));
  const newQuestions = data.newQuestions as string[];
  
  console.log(`📝 Analyzing ${newQuestions.length} new questions...\n`);
  
  const results: CoverageAnalysis[] = [];
  
  for (const newQ of newQuestions) {
    const analysis = isTopicCovered(newQ, existingQuestions);
    results.push(analysis);
  }
  
  // Categorize results
  const covered = results.filter(r => r.status === 'covered');
  const partiallyCovered = results.filter(r => r.status === 'partially-covered');
  const trulyNew = results.filter(r => r.status === 'new');
  
  console.log('✅ SEMANTIC ANALYSIS COMPLETE');
  console.log('═'.repeat(80));
  console.log(`✅ Already Covered: ${covered.length} (${Math.round(covered.length/newQuestions.length*100)}%)`);
  console.log(`⚠️  Partially Covered: ${partiallyCovered.length} (${Math.round(partiallyCovered.length/newQuestions.length*100)}%)`);
  console.log(`🆕 Truly New: ${trulyNew.length} (${Math.round(trulyNew.length/newQuestions.length*100)}%)`);
  console.log('');
  
  // Show samples
  console.log('📋 SAMPLE COVERED QUESTIONS (First 20):');
  console.log('─'.repeat(80));
  covered.slice(0, 20).forEach((r, i) => {
    console.log(`${i + 1}. ${r.newQuestion}`);
    console.log(`   ✓ Covered by: ${r.coveredBy?.[0]}`);
    console.log(`   Confidence: ${r.confidence}% - ${r.reasoning}\n`);
  });
  
  console.log('\n🆕 TRULY NEW QUESTIONS (First 30):');
  console.log('─'.repeat(80));
  trulyNew.slice(0, 30).forEach((r, i) => {
    console.log(`${i + 1}. ${r.newQuestion}`);
  });
  
  if (trulyNew.length > 30) {
    console.log(`\n... and ${trulyNew.length - 30} more new questions\n`);
  }
  
  // Save detailed results
  fs.writeFileSync(
    'semantic-analysis-results.json',
    JSON.stringify({
      summary: {
        total: newQuestions.length,
        covered: covered.length,
        partiallyCovered: partiallyCovered.length,
        trulyNew: trulyNew.length
      },
      covered,
      partiallyCovered,
      trulyNew
    }, null, 2)
  );
  
  // Save just the truly new questions
  fs.writeFileSync(
    'truly-new-questions.json',
    JSON.stringify({
      questions: trulyNew.map(r => r.newQuestion),
      count: trulyNew.length
    }, null, 2)
  );
  
  console.log('\n💾 Results saved to:');
  console.log('   - semantic-analysis-results.json (detailed analysis)');
  console.log('   - truly-new-questions.json (only new questions to import)');
  
  console.log('\n\n📊 RECOMMENDATION:');
  console.log('═'.repeat(80));
  console.log(`✅ Import ${trulyNew.length} truly new questions`);
  console.log(`⚠️  Review ${partiallyCovered.length} partially covered (optional)`);
  console.log(`⏭️  Skip ${covered.length} already covered questions`);
  console.log(`\n📈 This will bring your total from 39 to ${39 + trulyNew.length} questions`);
  console.log(`   (instead of ${39 + newQuestions.length} with blind import)\n`);
  
  await prisma.$disconnect();
}

analyzeSemanticDuplicates().catch(console.error);

