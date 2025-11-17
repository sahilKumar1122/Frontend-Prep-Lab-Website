import * as fs from 'fs';

interface ParsedQuestion {
  number: number;
  title: string;
  combinedQuestion: string;
  originalQuestions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

function parseJavaScriptQuestions(): ParsedQuestion[] {
  const content = fs.readFileSync('javascript_questions_grouped.md', 'utf-8');
  const questions: ParsedQuestion[] = [];

  // Split by ## to get each question section
  const sections = content.split(/\n## /).filter(s => s.trim() && !s.startsWith('Analysis Summary') && !s.startsWith('Summary Statistics'));

  for (const section of sections) {
    const lines = section.split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;

    // Extract question number and title from first line
    const firstLine = lines[0];
    // Match pattern: "1. Title Text (Merged: ...)" or "1. Title Text (Keep as is: ...)"
    // Need to extract full title before the parentheses
    const numberMatch = firstLine.match(/^(\d+)\.\s+(.+)/);
    if (!numberMatch) continue;

    const number = parseInt(numberMatch[1]);
    // Remove the "(Merged:" or "(Keep as is:" part from the title
    let title = numberMatch[2].trim();
    title = title.replace(/\s*\((?:Merged|Keep as is):.*\)$/, '').trim();

    // Find the combined question
    let combinedQuestion = '';
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith('**Combined Question**:')) {
        combinedQuestion = lines[i].replace('**Combined Question**:', '').trim();
        break;
      } else if (lines[i].startsWith('**Question**:')) {
        combinedQuestion = lines[i].replace('**Question**:', '').trim();
        break;
      }
    }

    // Extract original questions covered
    const originalQuestions: string[] = [];
    let inOriginalSection = false;
    for (const line of lines) {
      if (line.startsWith('**Original Questions Covered**:')) {
        inOriginalSection = true;
        continue;
      }
      if (inOriginalSection) {
        if (line.startsWith('-') && line.trim() !== '---') {
          originalQuestions.push(line.replace(/^-\s*/, '').trim());
        } else if (line === '---') {
          break;
        }
      }
    }

    // Determine difficulty and tags
    const { difficulty, tags } = analyzeDifficultyAndTags(title, combinedQuestion, originalQuestions);

    questions.push({
      number,
      title,
      combinedQuestion,
      originalQuestions,
      difficulty,
      tags
    });
  }

  return questions;
}

function analyzeDifficultyAndTags(
  title: string,
  question: string,
  originalQuestions: string[]
): { difficulty: 'easy' | 'medium' | 'hard', tags: string[] } {
  const lowerTitle = title.toLowerCase();
  const lowerQuestion = question.toLowerCase();
  const allText = `${lowerTitle} ${lowerQuestion} ${originalQuestions.join(' ')}`.toLowerCase();

  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  const tags = new Set<string>(['javascript']);

  // Easy patterns - fundamental concepts
  if (
    lowerTitle.includes('fundamentals') ||
    lowerTitle.includes('data types') ||
    lowerTitle.includes('operators') ||
    lowerTitle.includes('hoisting') ||
    allText.includes('what is') && allText.length < 200 ||
    lowerTitle.includes('difference between') && !lowerTitle.includes('advanced')
  ) {
    difficulty = 'easy';
    tags.add('fundamentals');
  }

  // Hard patterns - advanced topics
  if (
    lowerTitle.includes('optimization') ||
    lowerTitle.includes('engine') ||
    lowerTitle.includes('v8') ||
    lowerTitle.includes('memory leak') ||
    lowerTitle.includes('execution context') ||
    lowerTitle.includes('event loop') ||
    lowerTitle.includes('timers & event loop') ||
    lowerTitle.includes('proxy') ||
    lowerTitle.includes('decorator') ||
    lowerTitle.includes('generator') ||
    lowerTitle.includes('iterator') ||
    lowerTitle.includes('security') ||
    lowerTitle.includes('postmessage') ||
    lowerTitle.includes('functional programming') ||
    lowerTitle.includes('side effects') ||
    lowerTitle.includes('hidden classes') ||
    lowerTitle.includes('inline caching') ||
    lowerTitle.includes('performance optimization') ||
    lowerQuestion.includes('microtask') ||
    lowerQuestion.includes('event loop') ||
    lowerQuestion.includes('optimization')
  ) {
    difficulty = 'hard';
    tags.add('advanced');
  }

  // Tag patterns
  const tagPatterns: { [key: string]: string[] } = {
    'async': ['promise', 'async', 'await', 'callback', 'asynchronous'],
    'es6': ['es6', 'es2015', 'arrow', 'template literal', 'destructuring', 'spread', 'rest'],
    'dom': ['dom', 'document', 'element', 'html', 'event'],
    'array': ['array', 'slice', 'splice', 'map', 'filter', 'reduce'],
    'object': ['object', 'prototype', 'class', 'inheritance'],
    'function': ['function', 'closure', 'scope', 'this', 'bind', 'call', 'apply'],
    'performance': ['optimization', 'performance', 'debounce', 'throttle'],
    'security': ['security', 'xss', 'same-origin', 'postmessage'],
    'browser-api': ['storage', 'cookie', 'worker', 'indexeddb'],
    'node': ['node', 'npm', 'module'],
    'error-handling': ['error', 'try', 'catch', 'debug'],
    'regex': ['regular expression', 'regex', 'pattern'],
    'typescript': ['typescript', 'type'],
    'testing': ['test', 'debug'],
    'web-api': ['api', 'fetch', 'ajax', 'http']
  };

  for (const [tag, patterns] of Object.entries(tagPatterns)) {
    for (const pattern of patterns) {
      if (allText.includes(pattern)) {
        tags.add(tag);
        break;
      }
    }
  }

  return {
    difficulty,
    tags: Array.from(tags).slice(0, 6) // Limit to 6 tags
  };
}

// Parse and save
const questions = parseJavaScriptQuestions();
fs.writeFileSync('parsed-js-questions.json', JSON.stringify(questions, null, 2));

console.log(`✅ Parsed ${questions.length} JavaScript questions`);
console.log(`📊 Difficulty Distribution:`);
console.log(`   Easy: ${questions.filter(q => q.difficulty === 'easy').length}`);
console.log(`   Medium: ${questions.filter(q => q.difficulty === 'medium').length}`);
console.log(`   Hard: ${questions.filter(q => q.difficulty === 'hard').length}`);

