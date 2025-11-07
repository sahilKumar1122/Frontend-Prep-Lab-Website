import { prisma } from '../src/lib/prisma';
import fs from 'fs';

interface QuestionTemplate {
  title: string;
  content: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function calculateReadingTime(content: string, answer: string): number {
  const words = (content + answer).split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function determineDifficulty(title: string): 'easy' | 'medium' | 'hard' {
  const lower = title.toLowerCase();
  
  // Easy patterns - basic "what is" questions
  if (
    (lower.startsWith('what is ') || lower.startsWith('what are ')) &&
    !lower.includes('difference') &&
    !lower.includes('how') &&
    !lower.includes('why')
  ) {
    return 'easy';
  }
  
  // Hard patterns - advanced topics
  if (
    lower.includes('debug') ||
    lower.includes('optimize') ||
    lower.includes('performance') ||
    lower.includes('architecture') ||
    lower.includes('security') ||
    lower.includes('memory leak') ||
    lower.includes('custom') ||
    lower.includes('advanced') ||
    lower.includes('manually') ||
    lower.includes('hierarchy')
  ) {
    return 'hard';
  }
  
  // Medium - everything else
  return 'medium';
}

function determineTags(title: string): string[] {
  const lower = title.toLowerCase();
  const tags: string[] = ['angular'];
  
  // Topic-based tags
  if (lower.includes('component')) tags.push('components', 'architecture');
  if (lower.includes('directive')) tags.push('directives', 'templates');
  if (lower.includes('pipe')) tags.push('pipes', 'transformation');
  if (lower.includes('service')) tags.push('services', 'di');
  if (lower.includes('module')) tags.push('modules', 'organization');
  if (lower.includes('route') || lower.includes('router') || lower.includes('navigation')) 
    tags.push('routing', 'navigation');
  if (lower.includes('form')) tags.push('forms', 'validation');
  if (lower.includes('lifecycle') || lower.includes('hook') || lower.includes('ngoninit')) 
    tags.push('lifecycle', 'hooks');
  if (lower.includes('binding') || lower.includes('interpolation')) 
    tags.push('binding', 'templates');
  if (lower.includes('rxjs') || lower.includes('observable') || lower.includes('subject')) 
    tags.push('rxjs', 'observables', 'reactive');
  if (lower.includes('http') || lower.includes('interceptor')) 
    tags.push('http', 'api');
  if (lower.includes('test') || lower.includes('protractor') || lower.includes('testbed')) 
    tags.push('testing', 'unit-tests');
  if (lower.includes('aot') || lower.includes('jit') || lower.includes('compil') || lower.includes('ivy')) 
    tags.push('compilation', 'build');
  if (lower.includes('security') || lower.includes('xss') || lower.includes('sanitiz')) 
    tags.push('security', 'xss');
  if (lower.includes('i18n') || lower.includes('internation') || lower.includes('locale')) 
    tags.push('i18n', 'internationalization');
  if (lower.includes('animation')) tags.push('animations', 'ui');
  if (lower.includes('change detection') || lower.includes('zone')) 
    tags.push('change-detection', 'performance');
  if (lower.includes('dependency injection') || lower.includes('di ') || lower.includes('provider')) 
    tags.push('di', 'services');
  if (lower.includes('template') && !lower.includes('template-driven')) 
    tags.push('templates', 'rendering');
  if (lower.includes('worker')) tags.push('web-workers', 'performance');
  if (lower.includes('schematic')) tags.push('schematics', 'cli');
  if (lower.includes('lazy load')) tags.push('lazy-loading', 'performance');
  if (lower.includes('signal')) tags.push('signals', 'reactive');
  if (lower.includes('standalone')) tags.push('standalone', 'modern-angular');
  if (lower.includes('ssr') || lower.includes('server') || lower.includes('universal')) 
    tags.push('ssr', 'server-side-rendering');
  if (lower.includes('hydration')) tags.push('hydration', 'ssr');
  
  // Difficulty-based tags
  if (determineDifficulty(title) === 'easy') {
    tags.push('fundamentals');
  } else if (determineDifficulty(title) === 'hard') {
    tags.push('advanced');
  }
  
  // Remove duplicates and limit to 6
  return [...new Set(tags)].slice(0, 6);
}

function generateQuickSummary(title: string): string {
  const lower = title.toLowerCase();
  
  // Pattern-based summaries
  if (lower.startsWith('what is angular framework')) {
    return '**Angular** is a TypeScript-based open-source web application framework developed by Google. It\'s a complete rewrite of AngularJS, designed for building dynamic, scalable single-page applications with modern web standards.';
  }
  
  if (lower.startsWith('what is typescript')) {
    return '**TypeScript** is a statically typed superset of JavaScript developed by Microsoft. It adds optional static typing, classes, and interfaces to JavaScript, enabling better tooling, early error detection, and improved code maintainability.';
  }
  
  if (lower.includes('directives') && lower.startsWith('what are')) {
    return '**Directives** are classes that add behavior to elements in your Angular applications. They allow you to attach custom behavior to DOM elements or manipulate the DOM structure. Angular has three types: Component directives, Structural directives, and Attribute directives.';
  }
  
  if (lower.includes('components') && lower.startsWith('what are')) {
    return '**Components** are the fundamental building blocks of Angular applications. A component controls a patch of screen called a view through its associated template, and defines application logic through a TypeScript class that interacts with the view.';
  }
  
  if (lower.includes('pipes') && lower.startsWith('what are')) {
    return '**Pipes** are simple functions used in template expressions to transform displayed values. They take data as input and transform it to a desired output format, making it easy to format strings, currency amounts, dates, and other display data.';
  }
  
  if (lower.includes('services') && (lower.startsWith('what is a service') || lower.startsWith('what are service'))) {
    return '**Services** are singleton objects that provide specific functionality across your Angular application. They are used for features that are independent from any particular component, such as fetching data, validation logic, or logging.';
  }
  
  if (lower.includes('observable') && lower.startsWith('what')) {
    return '**Observables** are declarative objects that provide support for passing messages between publishers and subscribers in your application. They offer significant benefits over other techniques for event handling, asynchronous programming, and handling multiple values.';
  }
  
  if (lower.includes('dependency injection')) {
    return '**Dependency Injection (DI)** is a design pattern and core Angular concept where a class receives its dependencies from external sources rather than creating them itself. Angular\'s DI framework provides dependencies to a class upon instantiation, making code more flexible, testable, and maintainable.';
  }
  
  if (lower.includes('lifecycle') && lower.includes('hook')) {
    return '**Lifecycle hooks** are methods that Angular calls on directives and components as it creates, updates, and destroys them. These hooks give you the opportunity to act at key moments in the component lifecycle, from creation to destruction.';
  }
  
  if (lower.includes('data binding')) {
    return '**Data binding** is a mechanism for coordinating parts of a template with parts of a component. Angular provides four forms of data binding: interpolation, property binding, event binding, and two-way binding, enabling dynamic, interactive user interfaces.';
  }
  
  if (lower.includes('module') && lower.startsWith('what')) {
    return '**NgModules** are containers for a cohesive block of code dedicated to an application domain, workflow, or closely related set of capabilities. Every Angular application has at least one NgModule class, the root module, conventionally named AppModule.';
  }
  
  if (lower.includes('router') && lower.startsWith('what is angular router')) {
    return '**Angular Router** enables navigation between different views and components in a single-page application. It interprets browser URLs as instructions to navigate to client-generated views and optionally pass data to support those views.';
  }
  
  if (lower.includes('rxjs') && lower.startsWith('what is rxjs')) {
    return '**RxJS** (Reactive Extensions for JavaScript) is a library for reactive programming using observables. It makes it easier to compose asynchronous or callback-based code and is a core part of Angular\'s data flow architecture.';
  }
  
  // Default template
  const concept = title.replace(/^(What is|What are|How do you|How to|Explain|Give an example of|List down|Can I|Does|Is|Do)\s+/i, '').trim();
  return `**${concept}** is an important Angular concept that helps developers build robust, scalable applications. Understanding this topic is essential for working effectively with Angular's architecture and development patterns.`;
}

function generateContent(title: string, difficulty: 'easy' | 'medium' | 'hard'): string {
  return `# ${title}

## Quick Summary

${generateQuickSummary(title)}

---

## Understanding the Concept

`;
}

function generateAnswer(title: string, difficulty: 'easy' | 'medium' | 'hard', tags: string[]): string {
  const lower = title.toLowerCase();
  
  let answer = ``;
  
  // Add conceptual explanation section
  answer += `### Core Explanation\n\n`;
  answer += `[Detailed explanation will be added based on the specific topic]\n\n`;
  
  // Add visual diagram if applicable
  if (!lower.includes('difference between')) {
    answer += `### Visual Representation\n\n`;
    answer += '```mermaid\n';
    answer += 'graph TD\n';
    answer += '    A[Concept] --> B[Implementation]\n';
    answer += '    B --> C[Usage]\n';
    answer += '    C --> D[Result]\n';
    answer += '```\n\n';
  }
  
  // Add code example
  answer += `### Code Example\n\n`;
  answer += '```typescript\n';
  answer += '// Basic example\n';
  answer += 'export class ExampleComponent {\n';
  answer += '  // Implementation\n';
  answer += '}\n';
  answer += '```\n\n';
  
  // Add real-world application
  answer += `### Real-World Applications\n\n`;
  answer += `1. **Enterprise Applications**: Used extensively in production environments\n`;
  answer += `2. **Scalable Systems**: Helps maintain code quality in large codebases\n`;
  answer += `3. **Team Development**: Facilitates collaboration among developers\n\n`;
  
  // Add best practices
  answer += `### Best Practices\n\n`;
  answer += `✅ **Do:**\n`;
  answer += `- Follow Angular style guide\n`;
  answer += `- Write clean, maintainable code\n`;
  answer += `- Use TypeScript features effectively\n\n`;
  answer += `❌ **Don't:**\n`;
  answer += `- Overcomplicate simple solutions\n`;
  answer += `- Ignore performance implications\n`;
  answer += `- Skip unit tests\n\n`;
  
  // Add interview tips for medium/hard questions
  if (difficulty !== 'easy') {
    answer += `### Interview Tips\n\n`;
    answer += `💡 **What interviewers look for:**\n`;
    answer += `- Deep understanding of Angular concepts\n`;
    answer += `- Practical experience with real projects\n`;
    answer += `- Ability to explain trade-offs and alternatives\n`;
    answer += `- Knowledge of best practices and anti-patterns\n\n`;
    answer += `🎯 **How to answer:**\n`;
    answer += `1. Start with a concise definition\n`;
    answer += `2. Provide a practical example\n`;
    answer += `3. Discuss when and why to use it\n`;
    answer += `4. Mention any gotchas or common mistakes\n\n`;
  }
  
  // Add related topics
  const relatedTopics = tags.filter(t => t !== 'angular').slice(0, 3);
  if (relatedTopics.length > 0) {
    answer += `### Related Topics\n\n`;
    relatedTopics.forEach(topic => {
      answer += `- ${topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
    });
    answer += `\n`;
  }
  
  return answer;
}

async function batchImport() {
  console.log('📦 Starting Batch Import of Truly New Questions\n');
  console.log('═'.repeat(80));
  
  // Read truly new questions (after semantic analysis)
  let questions: string[];
  try {
    const data = JSON.parse(fs.readFileSync('truly-new-questions.json', 'utf-8'));
    questions = data.questions as string[];
    console.log('✅ Using semantically filtered questions (truly new only)\n');
  } catch {
    console.log('⚠️  truly-new-questions.json not found, using all new questions');
    const data = JSON.parse(fs.readFileSync('new-questions-to-add.json', 'utf-8'));
    questions = data.newQuestions as string[];
  }
  
  console.log(`📊 Total questions to import: ${questions.length}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(questions.length / 10)} minutes\n`);
  
  const batchSize = 50;
  let totalAdded = 0;
  let skipped = 0;
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    console.log(`\n📝 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questions.length / batchSize)}`);
    console.log(`   Questions ${i + 1}-${Math.min(i + batchSize, questions.length)}`);
    console.log('─'.repeat(80));
    
    for (const title of batch) {
      try {
        const slug = createSlug(title);
        
        // Check if already exists
        const existing = await prisma.question.findUnique({ where: { slug } });
        if (existing) {
          console.log(`   ⏭️  Skipped: ${title} (already exists)`);
          skipped++;
          continue;
        }
        
        const difficulty = determineDifficulty(title);
        const tags = determineTags(title);
        const content = generateContent(title, difficulty);
        const answer = generateAnswer(title, difficulty, tags);
        const readingTime = calculateReadingTime(content, answer);
        
        await prisma.question.create({
          data: {
            title,
            slug,
            content,
            answer,
            difficulty,
            tags,
            readingTime,
            category: 'angular',
          }
        });
        
        totalAdded++;
        console.log(`   ✅ Added: ${title} [${difficulty}]`);
        
      } catch (error) {
        console.log(`   ❌ Error: ${title} - ${error.message}`);
      }
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n\n' + '═'.repeat(80));
  console.log('✅ BATCH IMPORT COMPLETE');
  console.log('═'.repeat(80));
  console.log(`✅ Successfully added: ${totalAdded} questions`);
  console.log(`⏭️  Skipped: ${skipped} questions`);
  console.log(`📊 New total: ${39 + totalAdded} questions in database\n`);
  
  console.log('📈 NEXT STEPS:');
  console.log('─'.repeat(80));
  console.log('1. Review questions in database');
  console.log('2. Run quality assessment: npm run assess:questions');
  console.log('3. Enhance specific questions as needed');
  console.log('4. Test on the UI to ensure proper display\n');
  
  await prisma.$disconnect();
}

batchImport().catch(console.error);

