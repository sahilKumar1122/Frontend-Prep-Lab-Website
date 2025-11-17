import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

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
  const { answer, content, id, title, category } = question;
  const fullContent = `${content}\n\n${answer}`;

  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // Check for Quick Summary section
  const hasQuickSummary =
    answer.includes('Quick Summary') ||
    answer.includes('TL;DR') ||
    answer.includes('In Short') ||
    answer.includes('🎯');
  if (hasQuickSummary) score += 15;
  else {
    issues.push('Missing quick summary section');
    recommendations.push('Add a 🎯 Quick Summary section (2-3 sentences) at the start');
  }

  // Check for conceptual explanation
  const hasConceptExplanation =
    answer.includes('Understanding the Concept') ||
    answer.includes('What It Is') ||
    answer.includes('Why Does It Matter') ||
    answer.includes('📖');
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
  const jsCodeBlocks = codeBlocks.filter(block => block.includes('javascript') || block.includes('js'));
  const hasCodeExamples = jsCodeBlocks.length >= 2;
  if (jsCodeBlocks.length >= 3) {
    score += 20;
  } else if (jsCodeBlocks.length === 2) {
    score += 15;
  } else if (jsCodeBlocks.length === 1) {
    score += 7;
    issues.push('Only one code example');
    recommendations.push('Add more code examples: basic → intermediate → advanced pattern');
  } else {
    issues.push('No code examples');
    recommendations.push('Add 💻 Code Examples section with at least 2-3 examples');
  }

  // Check for real-world context
  const hasRealWorldContext =
    answer.includes('Real-World') ||
    answer.includes('Production') ||
    answer.includes('Use Cases') ||
    answer.includes('Applications') ||
    answer.includes('Where You') ||
    answer.includes('🏢');
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
  if (answer.includes('Interview Tips') || answer.includes('🎤')) {
    score += 5;
  }

  // Calculate code to text ratio
  const codeLength = codeBlocks.reduce((sum, block) => sum + block.length, 0);
  const textLength = fullContent.length - codeLength;
  let codeToTextRatio = 'well-balanced';
  if (codeLength / fullContent.length > 0.7) {
    codeToTextRatio = 'too much code (>70%)';
    issues.push('Too much code (>70%), needs more explanation');
    recommendations.push('Add more detailed explanations and conceptual deep dives');
  } else if (codeLength / fullContent.length < 0.1) {
    codeToTextRatio = 'too little code (<10%)';
    issues.push('Too little code (<10%), needs more examples');
    recommendations.push('Add more practical code examples to support explanations');
  }

  // Cap score at 100
  const overallScore = Math.min(100, score);

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
      overallScore,
    },
    issues,
    recommendations,
  };
}

async function assessJavaScriptQuestions() {
  console.log('🔍 Assessing JavaScript Question Quality\n');
  console.log('═'.repeat(80));

  const questions = await prisma.question.findMany({
    where: {
      category: 'javascript'
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log(`📊 Found ${questions.length} JavaScript questions\n`);

  const results: QualityScore[] = [];
  
  for (const question of questions) {
    const analysis = analyzeQuestion(question);
    results.push(analysis);
  }

  // Categorize by score
  const excellent = results.filter(r => r.scores.overallScore >= 80);
  const good = results.filter(r => r.scores.overallScore >= 60 && r.scores.overallScore < 80);
  const needsWork = results.filter(r => r.scores.overallScore < 60);

  console.log('\n' + '═'.repeat(80));
  console.log('📈 Quality Assessment Summary\n');
  console.log(`✅ Excellent (80-100): ${excellent.length} questions`);
  console.log(`👍 Good (60-79): ${good.length} questions`);
  console.log(`⚠️  Needs Work (<60): ${needsWork.length} questions`);
  console.log(`📊 Average Score: ${(results.reduce((sum, r) => sum + r.scores.overallScore, 0) / results.length).toFixed(1)}/100`);

  // Detailed breakdown
  if (excellent.length > 0) {
    console.log('\n✅ Excellent Questions (80-100):');
    excellent.forEach(q => {
      console.log(`   ${q.scores.overallScore}/100 - ${q.title}`);
    });
  }

  if (good.length > 0) {
    console.log('\n👍 Good Questions (60-79):');
    good.forEach(q => {
      console.log(`   ${q.scores.overallScore}/100 - ${q.title}`);
    });
  }

  if (needsWork.length > 0) {
    console.log('\n⚠️  Questions Needing Work (<60):');
    needsWork.forEach(q => {
      console.log(`   ${q.scores.overallScore}/100 - ${q.title}`);
      console.log(`      Issues: ${q.issues.join(', ')}`);
    });
  }

  // Save detailed report
  fs.writeFileSync('js-quality-report.json', JSON.stringify({
    summary: {
      total: results.length,
      excellent: excellent.length,
      good: good.length,
      needsWork: needsWork.length,
      averageScore: results.reduce((sum, r) => sum + r.scores.overallScore, 0) / results.length
    },
    excellent,
    good,
    needsWork
  }, null, 2));

  console.log('\n📝 Detailed report saved to: js-quality-report.json');
  
  await prisma.$disconnect();
}

assessJavaScriptQuestions().catch(console.error);

