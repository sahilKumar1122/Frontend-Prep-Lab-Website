import { prisma } from '../src/lib/prisma';

interface QualityScore {
  questionId: string;
  title: string;
  category: string;
  scores: {
    hasQuickSummary: boolean;
    hasConceptExplanation: boolean;
    hasDiagram: boolean;
    hasCodeExamples: boolean;
    hasRealWorldContext: boolean;
    hasBestPractices: boolean;
    codeToTextRatio: string;
    overallScore: number;
  };
  issues: string[];
  recommendations: string[];
}

function analyzeQuestion(question: any): QualityScore {
  const { answer, content, id, title, category, codeExample } = question;
  const fullContent = `${content}\n\n${answer}`;
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  
  // Check for Quick Summary section
  const hasQuickSummary = 
    answer.includes('Quick Summary') || 
    answer.includes('TL;DR') ||
    answer.includes('In Short');
  if (hasQuickSummary) score += 15;
  else {
    issues.push('Missing quick summary section');
    recommendations.push('Add a 🎯 Quick Summary section (2-3 sentences) at the start');
  }
  
  // Check for conceptual explanation
  const hasConceptExplanation = 
    answer.includes('Understanding the Concept') ||
    answer.includes('What is') ||
    answer.includes('Why Does It Matter');
  if (hasConceptExplanation) score += 20;
  else {
    issues.push('Missing conceptual explanation');
    recommendations.push('Add 📖 Understanding the Concept section explaining what, why, and how');
  }
  
  // Check for diagrams
  const hasDiagram = 
    fullContent.includes('```mermaid') ||
    fullContent.includes('graph TD') ||
    fullContent.includes('sequenceDiagram');
  if (hasDiagram) score += 15;
  else {
    issues.push('No visual diagrams');
    recommendations.push('Add a 📊 Visual Flow mermaid diagram to illustrate the concept');
  }
  
  // Check for code examples
  const codeBlocks = fullContent.match(/```[\s\S]*?```/g) || [];
  const hasCodeExamples = codeBlocks.length >= 2;
  if (hasCodeExamples) score += 15;
  else if (codeBlocks.length === 1) {
    score += 7;
    issues.push('Only one code example');
    recommendations.push('Add more code examples: basic → production → advanced pattern');
  } else {
    issues.push('No code examples');
    recommendations.push('Add 💻 Code Examples section with at least 2 examples');
  }
  
  // Check for real-world context
  const hasRealWorldContext = 
    answer.includes('Real-World') ||
    answer.includes('Production') ||
    answer.includes('Use Cases') ||
    answer.includes('Applications') ||
    answer.includes('Where I\'ve Used');
  if (hasRealWorldContext) score += 15;
  else {
    issues.push('No real-world context');
    recommendations.push('Add 🏢 Real-World Applications section with practical examples');
  }
  
  // Check for best practices/pitfalls
  const hasBestPractices = 
    answer.includes('Best Practices') ||
    answer.includes('Common Pitfalls') ||
    answer.includes('Common Mistakes') ||
    answer.includes('⚠️') ||
    answer.includes('✅');
  if (hasBestPractices) score += 10;
  else {
    issues.push('Missing best practices');
    recommendations.push('Add ⚠️ Common Pitfalls & Best Practices section');
  }
  
  // Check for interview tips
  const hasInterviewTips =
    answer.includes('Interview Tips') ||
    answer.includes('What interviewers look for');
  if (hasInterviewTips) score += 10;
  else {
    recommendations.push('Add 🎯 Interview Tips section for better interview preparation');
  }
  
  // Calculate code to text ratio
  const totalText = fullContent.replace(/```[\s\S]*?```/g, '');
  const totalCode = codeBlocks.join('');
  const codeLength = totalCode.length;
  const textLength = totalText.length;
  const codeRatio = codeLength / (codeLength + textLength);
  
  let codeToTextRatio = 'unknown';
  if (codeLength === 0 && textLength === 0) {
    codeToTextRatio = 'empty';
    issues.push('Content is empty or too short');
  } else if (codeRatio > 0.7) {
    codeToTextRatio = 'too code-heavy';
    issues.push('Too much code (>70%), needs more explanation');
    recommendations.push('Balance code with conceptual explanations (aim for 30% code, 70% text)');
  } else if (codeRatio < 0.1) {
    codeToTextRatio = 'too text-heavy';
    issues.push('Too little code (<10%), needs more examples');
    recommendations.push('Add more practical code examples to support explanations');
  } else if (codeRatio >= 0.2 && codeRatio <= 0.4) {
    codeToTextRatio = 'well-balanced';
    score += 10;
  } else {
    codeToTextRatio = `${Math.round(codeRatio * 100)}% code`;
  }
  
  return {
    questionId: id,
    title,
    category,
    scores: {
      hasQuickSummary,
      hasConceptExplanation,
      hasDiagram,
      hasCodeExamples,
      hasRealWorldContext,
      hasBestPractices,
      codeToTextRatio,
      overallScore: score,
    },
    issues,
    recommendations,
  };
}

async function assessAllQuestions() {
  console.log('🔍 Assessing question quality...\n');
  
  const questions = await prisma.question.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      content: true,
      answer: true,
      codeExample: true,
    },
  });
  
  const results = questions.map(analyzeQuestion);
  
  // Categorize by score
  const excellent = results.filter(r => r.scores.overallScore >= 80);
  const good = results.filter(r => r.scores.overallScore >= 60 && r.scores.overallScore < 80);
  const needsWork = results.filter(r => r.scores.overallScore >= 40 && r.scores.overallScore < 60);
  const poor = results.filter(r => r.scores.overallScore < 40);
  
  console.log('📊 OVERALL STATISTICS');
  console.log('═══════════════════════════════════════');
  console.log(`Total Questions: ${results.length}`);
  console.log(`Excellent (80-100): ${excellent.length} (${Math.round(excellent.length/results.length*100)}%)`);
  console.log(`Good (60-79): ${good.length} (${Math.round(good.length/results.length*100)}%)`);
  console.log(`Needs Work (40-59): ${needsWork.length} (${Math.round(needsWork.length/results.length*100)}%)`);
  console.log(`Poor (<40): ${poor.length} (${Math.round(poor.length/results.length*100)}%)`);
  console.log('');
  
  // By category
  const byCategory = results.reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {} as Record<string, QualityScore[]>);
  
  console.log('📈 SCORES BY CATEGORY');
  console.log('═══════════════════════════════════════');
  Object.keys(byCategory).sort().forEach(category => {
    const categoryQuestions = byCategory[category];
    const avgScore = Math.round(
      categoryQuestions.reduce((sum, q) => sum + q.scores.overallScore, 0) / categoryQuestions.length
    );
    console.log(`${category.toUpperCase()}: ${avgScore}/100 (${categoryQuestions.length} questions)`);
  });
  console.log('');
  
  // Most common issues
  const allIssues = results.flatMap(r => r.issues);
  const issueCounts = allIssues.reduce((acc, issue) => {
    acc[issue] = (acc[issue] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('⚠️  MOST COMMON ISSUES');
  console.log('═══════════════════════════════════════');
  Object.entries(issueCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .forEach(([issue, count]) => {
      console.log(`${count}x - ${issue}`);
    });
  console.log('');
  
  // Questions needing most work
  console.log('🚨 TOP 10 QUESTIONS NEEDING MOST IMPROVEMENT');
  console.log('═══════════════════════════════════════');
  results
    .sort((a, b) => a.scores.overallScore - b.scores.overallScore)
    .slice(0, 10)
    .forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   Category: ${result.category}`);
      console.log(`   Score: ${result.scores.overallScore}/100`);
      console.log(`   Issues: ${result.issues.length}`);
      result.issues.forEach(issue => console.log(`      - ${issue}`));
      console.log(`   Top Recommendations:`);
      result.recommendations.slice(0, 3).forEach(rec => console.log(`      ✓ ${rec}`));
    });
  
  console.log('\n');
  console.log('✅ DETAILED REPORT SAVED');
  console.log('═══════════════════════════════════════');
  console.log('Run with --detailed flag to see all questions:');
  console.log('npm run assess:questions -- --detailed');
  
  // Save detailed report if requested
  if (process.argv.includes('--detailed')) {
    const fs = await import('fs');
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        excellent: excellent.length,
        good: good.length,
        needsWork: needsWork.length,
        poor: poor.length,
      },
      byCategory,
      commonIssues: issueCounts,
      allQuestions: results,
    };
    
    fs.writeFileSync(
      'question-quality-report.json',
      JSON.stringify(report, null, 2)
    );
    console.log('\n📄 Detailed report saved to: question-quality-report.json');
  }
  
  await prisma.$disconnect();
}

assessAllQuestions().catch(console.error);

