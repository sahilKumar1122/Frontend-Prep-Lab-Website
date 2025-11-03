/**
 * Script to fetch questions directly from GitHub and import into database
 * 
 * Usage: 
 * npx ts-node scripts/fetch-and-import.ts
 */

// Disable SSL verification for development (bypass corporate proxy issues)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ParsedQuestion {
  title: string;
  slug: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  content: string;
  answer: string;
  codeExample?: string;
  readingTime: number;
  order: number;
}

// Configuration
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/sahilKumar1122/Frontend-Prep-Lab/main';

const FILES_TO_IMPORT = [
  { url: `${GITHUB_RAW_BASE}/frameworks/angular.md`, category: 'angular' },
  { url: `${GITHUB_RAW_BASE}/frameworks/react.md`, category: 'react' },
  { url: `${GITHUB_RAW_BASE}/languages/javascript.md`, category: 'javascript' },
  { url: `${GITHUB_RAW_BASE}/languages/typescript.md`, category: 'typescript' },
  // Add more files as needed
];

/**
 * Parses markdown content and extracts questions
 */
function parseMarkdownQuestions(markdownContent: string, category: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  
  // Split by ## (heading level 2) which typically indicates a new question
  const sections = markdownContent.split(/^## /gm).filter(s => s.trim());
  
  let order = 1;
  
  for (const section of sections) {
    try {
      const lines = section.split('\n');
      const titleLine = lines[0].trim();
      
      // Skip table of contents, introduction, etc.
      if (titleLine.toLowerCase().includes('table of contents') || 
          titleLine.toLowerCase().includes('introduction') ||
          titleLine.toLowerCase().includes('contributing') ||
          lines.length < 5) {
        continue;
      }
      
      // Extract title
      const title = titleLine.replace(/^\d+\.\s*/, '').replace(/[*_`]/g, '').trim();
      
      if (!title || title.length < 5) continue;
      
      // Create slug
      const slug = `${category}-${title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80)}`;
      
      // Extract difficulty
      let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
      const difficultyMatch = section.match(/\*\*Difficulty:\*\*\s*(easy|medium|hard)/i);
      if (difficultyMatch) {
        difficulty = difficultyMatch[1].toLowerCase() as 'easy' | 'medium' | 'hard';
      } else {
        // Try to infer from tags or content
        if (section.toLowerCase().includes('basic') || section.toLowerCase().includes('beginner')) {
          difficulty = 'easy';
        } else if (section.toLowerCase().includes('advanced') || section.toLowerCase().includes('complex')) {
          difficulty = 'hard';
        }
      }
      
      // Extract tags
      let tags: string[] = [category];
      const tagsMatch = section.match(/\*\*Tags:\*\*\s*(.+)/i);
      if (tagsMatch) {
        const extractedTags = tagsMatch[1]
          .split(',')
          .map(t => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
          .filter(t => t && t.length > 0);
        tags = [...tags, ...extractedTags];
      }
      
      // Split content and answer
      const answerSplit = section.split(/^###?\s*(Answer|Solution)/im);
      let contentPart = answerSplit[0] || section;
      let answerPart = answerSplit[1] || '';
      
      // Clean up content
      contentPart = contentPart
        .split('\n')
        .filter(line => !line.match(/^\*\*(Difficulty|Tags|Category):/i))
        .join('\n')
        .trim();
      
      // If no explicit answer section, use content as answer
      if (!answerPart || answerPart.trim().length < 20) {
        answerPart = contentPart;
      }
      
      // Extract code examples
      const codeBlocks = section.match(/```[\s\S]*?```/g);
      const codeExample = codeBlocks && codeBlocks.length > 0 
        ? codeBlocks.slice(0, 3).join('\n\n') // Take first 3 code blocks
        : undefined;
      
      // Estimate reading time
      const wordCount = section.split(/\s+/).length;
      const readingTime = Math.max(3, Math.ceil(wordCount / 200));
      
      // Validate and add question
      if (title && contentPart && contentPart.length > 50) {
        questions.push({
          title,
          slug,
          category,
          difficulty,
          tags: [...new Set(tags)],
          content: `# ${title}\n\n${contentPart}`,
          answer: `# Answer: ${title}\n\n${answerPart.trim()}`,
          codeExample,
          readingTime,
          order: order++,
        });
      }
    } catch (error) {
      console.error(`Error parsing section:`, error);
      continue;
    }
  }
  
  return questions;
}

async function fetchAndImport(url: string, category: string) {
  console.log(`\n📥 Fetching: ${url}`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    const questions = parseMarkdownQuestions(content, category);
    
    console.log(`✓ Parsed ${questions.length} questions from ${category}`);
    
    let imported = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const question of questions) {
      try {
        // Check if question already exists
        const existing = await prisma.question.findUnique({
          where: { slug: question.slug },
        });
        
        if (existing) {
          // Optionally update existing questions
          await prisma.question.update({
            where: { slug: question.slug },
            data: {
              ...question,
              updatedAt: new Date(),
            },
          });
          console.log(`↻ Updated: ${question.title}`);
          updated++;
        } else {
          // Create new question
          await prisma.question.create({
            data: question,
          });
          console.log(`✓ Imported: ${question.title}`);
          imported++;
        }
      } catch (error) {
        console.error(`✗ Failed "${question.title}":`, error);
        skipped++;
      }
    }
    
    return { imported, updated, skipped };
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error);
    return { imported: 0, updated: 0, skipped: 0 };
  }
}

async function main() {
  console.log('🚀 Fetching questions from GitHub...\n');
  
  let totalImported = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  
  for (const { url, category } of FILES_TO_IMPORT) {
    const { imported, updated, skipped } = await fetchAndImport(url, category);
    totalImported += imported;
    totalUpdated += updated;
    totalSkipped += skipped;
  }
  
  console.log('\n✅ Import completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Imported: ${totalImported} new questions`);
  console.log(`   - Updated: ${totalUpdated} existing questions`);
  console.log(`   - Skipped: ${totalSkipped} questions (errors)`);
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

