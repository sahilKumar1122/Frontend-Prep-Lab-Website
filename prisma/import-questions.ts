import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

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

/**
 * Parses a markdown file from GitHub repo and extracts questions
 * Expects format like:
 * 
 * ## Question Title
 * **Difficulty:** Medium
 * **Tags:** tag1, tag2, tag3
 * 
 * Question content here...
 * 
 * ### Answer
 * Answer content here...
 * 
 * ```code
 * Code example here
 * ```
 */
function parseMarkdownQuestions(markdownContent: string, category: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  
  // Split by ### (heading level 3) which indicates individual questions
  // Angular questions use ### for each question
  const sections = markdownContent.split(/^### /gm).filter(s => s.trim());
  
  let order = 1;
  
  for (const section of sections) {
    try {
      const lines = section.split('\n');
      const titleLine = lines[0].trim();
      
      // Skip if this is just a heading without content or metadata sections
      if (titleLine.toLowerCase().includes('table of contents') || 
          titleLine.toLowerCase().includes('introduction') ||
          titleLine.toLowerCase().includes('questions list') ||
          titleLine.toLowerCase().includes('congratulations') ||
          lines.length < 10) {
        continue;
      }
      
      // Extract title (remove any numbering or special chars)
      const title = titleLine.replace(/^\d+\.\s*/, '').replace(/[*_]/g, '').trim();
      
      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 100);
      
      // Extract difficulty (default to medium)
      let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
      const difficultyMatch = section.match(/\*\*Difficulty:\*\*\s*(easy|medium|hard)/i);
      if (difficultyMatch) {
        difficulty = difficultyMatch[1].toLowerCase() as 'easy' | 'medium' | 'hard';
      }
      
      // Extract tags
      let tags: string[] = [category];
      const tagsMatch = section.match(/\*\*Tags:\*\*\s*(.+)/i);
      if (tagsMatch) {
        const extractedTags = tagsMatch[1]
          .split(',')
          .map(t => t.trim().toLowerCase())
          .filter(t => t && t.length > 0);
        tags = [...tags, ...extractedTags];
      }
      
      // Extract content from <details> tags for Angular format
      // Questions are in format: ### N. Title \n **Question:** short question \n <details><summary>View Answer</summary> \n answer \n </details>
      
      // For this format, the ENTIRE section before </details> should be the question/content
      // And ONLY what's inside <details> is the answer
      
      // Extract Answer from details tag
      const answerMatch = section.match(/<details>[\s\S]*?<summary>.*?<\/summary>\s*([\s\S]*?)<\/details>/);
      
      // Content is everything BEFORE <details> tag (or entire section if no details tag)
      let contentPart: string;
      let answerPart: string;
      
      if (answerMatch) {
        // Split at <details> tag
        const detailsIndex = section.indexOf('<details>');
        contentPart = section.substring(0, detailsIndex).trim();
        answerPart = answerMatch[1].trim();
      } else {
        // Fallback to old method if new format doesn't match
        const answerSplit = section.split(/^###?\s*Answer/im);
        contentPart = answerSplit[0] || section;
        answerPart = answerSplit[1] || '';
      }
      
      // Clean up content (remove metadata lines)
      const content = contentPart
        .split('\n')
        .filter(line => !line.match(/^\*\*(Difficulty|Tags|Category):/i))
        .join('\n')
        .trim();
      
      // Extract code examples
      const codeBlocks = section.match(/```[\s\S]*?```/g);
      const codeExample = codeBlocks ? codeBlocks.join('\n\n') : undefined;
      
      // Estimate reading time (200 words per minute)
      const wordCount = section.split(/\s+/).length;
      const readingTime = Math.max(3, Math.ceil(wordCount / 200));
      
      // Only add if we have meaningful content
      if (title && content && content.length > 50) {
        questions.push({
          title,
          slug: `${category}-${slug}`,
          category,
          difficulty,
          tags: [...new Set(tags)], // Remove duplicates
          content: `# ${title}\n\n${content}`,
          answer: answerPart ? `# Answer\n\n${answerPart.trim()}` : `# Answer\n\n${content}`,
          codeExample,
          readingTime,
          order: order++,
        });
      }
    } catch (error) {
      console.error(`Error parsing section: ${error}`);
      continue;
    }
  }
  
  return questions;
}

async function importFromFile(filePath: string, category: string) {
  console.log(`📖 Reading file: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions = parseMarkdownQuestions(content, category);
  
  console.log(`✓ Parsed ${questions.length} questions from ${category}`);
  
  let imported = 0;
  let skipped = 0;
  
  for (const question of questions) {
    try {
      // Check if question already exists
      const existing = await prisma.question.findUnique({
        where: { slug: question.slug },
      });
      
      if (existing) {
        console.log(`⊘ Skipped (already exists): ${question.title}`);
        skipped++;
        continue;
      }
      
      // Create question
      await prisma.question.create({
        data: question,
      });
      
      console.log(`✓ Imported: ${question.title}`);
      imported++;
    } catch (error) {
      console.error(`✗ Failed to import "${question.title}":`, error);
    }
  }
  
  return { imported, skipped };
}

async function main() {
  console.log('🚀 Starting question import...\n');
  
  const imports = [
    // Import from markdown-files directory
    { path: '../markdown-files/angular.md', category: 'angular' },
    // Or import from root directory
    // { path: '../../angular.md', category: 'angular' },
  ];
  
  // If no imports specified, show help
  if (imports.length === 0) {
    console.log('📝 How to use this script:\n');
    console.log('1. Download your markdown files from GitHub to a local directory');
    console.log('2. Edit this file and add the paths to your markdown files in the imports array');
    console.log('3. Example:');
    console.log(`   const imports = [
     { path: '../frameworks/angular.md', category: 'angular' },
     { path: '../frameworks/react.md', category: 'react' },
   ];`);
    console.log('\n4. Run: npm run import-questions\n');
    return;
  }
  
  let totalImported = 0;
  let totalSkipped = 0;
  
  for (const { path: filePath, category } of imports) {
    const fullPath = path.resolve(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}\n`);
      continue;
    }
    
    const { imported, skipped } = await importFromFile(fullPath, category);
    totalImported += imported;
    totalSkipped += skipped;
    console.log('');
  }
  
  console.log('✅ Import completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Imported: ${totalImported} questions`);
  console.log(`   - Skipped: ${totalSkipped} questions`);
}

main()
  .catch((e) => {
    console.error('❌ Error importing questions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

