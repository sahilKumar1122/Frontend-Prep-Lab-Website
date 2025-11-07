import { prisma } from '../src/lib/prisma';
import fs from 'fs';

// Import the batch import logic
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
  
  // Easy patterns
  if (
    (lower.startsWith('what is ') || lower.startsWith('what are ')) &&
    !lower.includes('difference') &&
    !lower.includes('how') &&
    !lower.includes('why')
  ) {
    return 'easy';
  }
  
  // Hard patterns
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
    lower.includes('hierarchy') ||
    lower.includes('configuration inheritance')
  ) {
    return 'hard';
  }
  
  return 'medium';
}

function determineTags(title: string): string[] {
  const lower = title.toLowerCase();
  const tags: string[] = ['angular'];
  
  if (lower.includes('async') && lower.includes('pipe')) tags.push('pipes', 'rxjs', 'observables');
  if (lower.includes('ngfor')) tags.push('directives', 'templates', 'rendering');
  if (lower.includes('ngif')) tags.push('directives', 'templates', 'rendering');
  if (lower.includes('ngswitch')) tags.push('directives', 'templates');
  if (lower.includes('trackby')) tags.push('performance', 'optimization', 'directives');
  if (lower.includes('response') && lower.includes('http')) tags.push('http', 'api', 'observables');
  if (lower.includes('metadata')) tags.push('compilation', 'aot', 'build');
  if (lower.includes('configuration')) tags.push('build', 'cli', 'setup');
  if (lower.includes('animation')) tags.push('animations', 'ui', 'transitions');
  if (lower.includes('ivy')) tags.push('ivy', 'compilation', 'rendering');
  if (lower.includes('builder')) tags.push('cli', 'build', 'architect');
  if (lower.includes('decorator')) tags.push('typescript', 'metadata', 'decorators');
  if (lower.includes('bazel')) tags.push('build', 'bazel', 'tooling');
  if (lower.includes('upgrade')) tags.push('migration', 'versioning', 'cli');
  if (lower.includes('sanitiz')) tags.push('security', 'xss', 'dom');
  if (lower.includes('i18n') || lower.includes('internationalization')) tags.push('i18n', 'internationalization', 'localization');
  if (lower.includes('translation')) tags.push('i18n', 'internationalization');
  if (lower.includes('sass') || lower.includes('scss')) tags.push('styling', 'css', 'preprocessor');
  if (lower.includes('hidden')) tags.push('templates', 'binding', 'rendering');
  if (lower.includes('navigation operator')) tags.push('templates', 'operators', 'safety');
  if (lower.includes('template expression')) tags.push('templates', 'expressions', 'operators');
  if (lower.includes('bootstrap')) tags.push('initialization', 'lifecycle', 'setup');
  if (lower.includes('ngmodule')) tags.push('modules', 'architecture', 'organization');
  if (lower.includes('declaration')) tags.push('modules', 'components', 'organization');
  if (lower.includes('displayblock')) tags.push('components', 'styling', 'rendering');
  if (lower.includes('validator')) tags.push('forms', 'validation', 'reactive');
  if (lower.includes('host property')) tags.push('components', 'styling', 'css');
  
  // Add difficulty tag
  const difficulty = determineDifficulty(title);
  if (difficulty === 'easy') tags.push('fundamentals');
  else if (difficulty === 'hard') tags.push('advanced');
  
  return [...new Set(tags)].slice(0, 6);
}

function generateQuickSummary(title: string): string {
  const lower = title.toLowerCase();
  
  if (lower.includes('async pipe')) {
    return '**Async pipe** automatically subscribes to Observables/Promises in templates and unsubscribes when the component is destroyed. It simplifies async data handling, prevents memory leaks, and triggers change detection when new values emit, eliminating manual subscription management.';
  } else if (lower.includes('ngfor')) {
    return '**ngFor directive** iterates over collections to dynamically generate DOM elements. It uses `*ngFor="let item of items"` syntax, providing template variables like `index`, `first`, `last`, `even`, `odd` for enhanced control over rendered lists.';
  } else if (lower.includes('ngif')) {
    return '**ngIf directive** conditionally adds or removes elements from the DOM based on a boolean expression. Unlike `[hidden]`, it completely removes elements (not just hiding), improving performance for complex components and preventing unnecessary initialization.';
  } else if (lower.includes('read full response') && lower.includes('http')) {
    return '**Reading full HTTP responses** requires using `observe: \'response\'` option in HttpClient. This returns the complete `HttpResponse` object containing status, headers, and body, instead of just the body, enabling access to metadata like status codes and custom headers.';
  } else if (lower.includes('metadata errors')) {
    return '**Metadata errors** in AOT compilation occur when decorator metadata contains non-static expressions, arrow functions, or unsupported JavaScript features. Common examples include dynamic property names, spread operators in decorators, and functions that aren\'t statically analyzable.';
  } else if (lower.includes('configuration inheritance')) {
    return '**Configuration inheritance** in Angular CLI allows extending base configurations using the `extends` property in configuration files. This enables sharing common settings across multiple projects or environments while maintaining DRY principles in your build configuration.';
  } else if (lower.includes('animation module')) {
    return '**Angular Animation module** requires three steps: 1) Import `BrowserAnimationsModule` in your root module, 2) Define animations using `trigger()`, `state()`, `transition()`, and `animate()` in component metadata, 3) Bind animations to elements using `[@triggerName]` in templates.';
  } else if (lower.includes('aot') && lower.includes('ivy')) {
    return '**AOT compilation with Ivy** is the default and recommended approach in Angular 9+. Ivy improves AOT with faster builds, smaller bundles, better debugging, and incremental compilation. All Ivy benefits work seamlessly with AOT compilation out of the box.';
  } else if (lower.includes('cli builder')) {
    return '**Angular CLI Builder** is an extensible API that defines how Angular CLI executes build tasks. Builders implement the `Builder` interface from `@angular-devkit/architect`, allowing custom build processes like custom webpack configurations, deployment tools, or code generation tasks.';
  } else if (lower.includes('class decorators')) {
    return '**Class decorators** in Angular include `@Component`, `@Directive`, `@Pipe`, `@Injectable`, and `@NgModule`. They add metadata to classes, enabling Angular\'s dependency injection, change detection, and component rendering systems to work properly.';
  } else if (lower.includes('class field decorators')) {
    return '**Class field decorators** include `@Input()`, `@Output()`, `@ViewChild()`, `@ViewChildren()`, `@ContentChild()`, `@ContentChildren()`, and `@HostBinding()`. They configure component properties, enable parent-child communication, and provide access to template elements and projected content.';
  } else if (lower.includes('bazel with angular cli')) {
    return '**Using Bazel with Angular CLI** requires installing `@angular/bazel` package and configuring `angular.json` to use Bazel builders. Bazel provides faster, more scalable builds through fine-grained caching and parallel execution, ideal for large monorepos.';
  } else if (lower.includes('run bazel directly')) {
    return '**Running Bazel directly** bypasses Angular CLI and uses Bazel commands: `bazel build`, `bazel test`, `bazel run`. You need BUILD and WORKSPACE files configured, giving you direct control over Bazel\'s build process and enabling advanced optimization strategies.';
  } else if (lower.includes('upgrade angular version')) {
    return '**Upgrading Angular** uses `ng update` command which analyzes your project and applies necessary migrations. Run `ng update @angular/core @angular/cli` to upgrade, and it automatically updates dependencies, modifies code, and applies breaking change migrations for a smooth upgrade path.';
  } else if (lower.includes('sanitization')) {
    return '**Sanitization** in Angular automatically cleans potentially dangerous values before rendering them in the DOM. Angular\'s `DomSanitizer` prevents XSS attacks by sanitizing HTML, styles, URLs, and resource URLs, ensuring only safe content reaches the browser.';
  } else if (lower.includes('prevent automatic sanitization')) {
    return '**Preventing automatic sanitization** requires explicitly marking content as safe using `DomSanitizer` methods: `bypassSecurityTrustHtml()`, `bypassSecurityTrustStyle()`, `bypassSecurityTrustScript()`, or `bypassSecurityTrustUrl()`. Use only with trusted content to avoid XSS vulnerabilities.';
  } else if (lower.includes('simplify internationalization')) {
    return '**Angular i18n** simplifies internationalization through built-in support for message extraction, translation, and locale-specific formatting. Use `i18n` attributes to mark translatable text, `ng extract-i18n` to generate translation files, and multiple build configurations for different languages.';
  } else if (lower.includes('i18n attribute')) {
    return '**i18n attribute** marks elements and attributes for translation. Syntax: `i18n="meaning|description@@id"` where meaning provides context, description explains usage, and optional id ensures consistent translation across the app. Essential for multi-language support.';
  } else if (lower.includes('select icu expression')) {
    return '**Select ICU expression** chooses messages based on string values (not numbers). Syntax: `{variable, select, value1 {text1} value2 {text2} other {default}}`. Used for gender-specific text, status messages, or any value-based text selection in i18n scenarios.';
  } else if (lower.includes('report missing translations')) {
    return '**Reporting missing translations** is configured in i18n settings. Use `missingTranslation` compiler option with values `error` (build fails), `warning` (console warning), or `ignore` (silent). Helps maintain translation completeness during development and deployment.';
  } else if (lower.includes('sass in angular')) {
    return '**Using SASS in Angular** is supported out-of-the-box. Set `"inlineStyleLanguage": "scss"` in `angular.json`, rename `.css` files to `.scss`, and use `styleUrls: [\'./component.scss\']`. Angular CLI automatically compiles SASS/SCSS to CSS during builds.';
  } else if (lower.includes('hidden property')) {
    return '**Hidden property** (`[hidden]="condition"`) hides elements using CSS `display: none` but keeps them in the DOM. Unlike `*ngIf`, the component is initialized and continues to exist, which can impact performance but maintains state and is useful for toggling visibility frequently.';
  } else if (lower.includes('trackby')) {
    return '**trackBy function** optimizes `*ngFor` performance by helping Angular identify which items changed. Instead of recreating all DOM elements, Angular only updates changed items. Syntax: `*ngFor="let item of items; trackBy: trackByFn"` where `trackByFn` returns a unique identifier.';
  } else if (lower.includes('ngswitch')) {
    return '**ngSwitch directive** conditionally displays one element from several possibilities, similar to a switch statement. Uses `[ngSwitch]`, `*ngSwitchCase`, and `*ngSwitchDefault` to show different templates based on an expression value, cleaner than multiple `*ngIf` statements.';
  } else if (lower.includes('safe navigation')) {
    return '**Safe navigation operator** (`?.`) safely accesses nested properties that might be null or undefined, preventing runtime errors. Example: `user?.address?.street` returns undefined if any intermediate property is null, instead of throwing an error. Essential for async data.';
  } else if (lower.includes('template expression operators')) {
    return '**Template expression operators** include pipe (`|`), safe navigation (`?.`), non-null assertion (`!`), and type cast (`$any()`). These operators transform values, handle nullish values safely, assert non-null types, and bypass type checking in templates.';
  } else if (lower.includes('manually bootstrap')) {
    return '**Manual bootstrapping** gives programmatic control over when Angular initializes. Use `platformBrowserDynamic().bootstrapModule(AppModule)` in `main.ts` after async operations, environment checks, or configuration loading. Useful for conditional bootstrapping or custom initialization logic.';
  } else if (lower.includes('examples for ngmodules')) {
    return '**NgModule examples** include: `BrowserModule` (browser apps), `CommonModule` (common directives), `FormsModule` (template-driven forms), `ReactiveFormsModule` (reactive forms), `RouterModule` (routing), `HttpClientModule` (HTTP), and custom feature modules for organizing application code.';
  } else if (lower.includes('declaration elements')) {
    return '**Using declaration elements** requires three steps: 1) Add the declarable (component/directive/pipe) to the `declarations` array of its NgModule, 2) Ensure it\'s in only ONE module, 3) Export it if needed in other modules. This makes it available within that module\'s templates.';
  } else if (lower.includes('displayblock')) {
    return '**DisplayBlock components** use `display: block` CSS by default instead of `inline`. Set using `host: { \'[style.display]\': \'"block"\' }` in component decorator or `:host { display: block; }` in component styles. Useful for layout components that should behave as block elements.';
  } else if (lower.includes('validator functions')) {
    return '**Validator functions** come in two types: **Sync validators** return errors immediately (`ValidatorFn`), checking simple conditions like required, minLength, pattern. **Async validators** return Observable/Promise (`AsyncValidatorFn`), for async checks like unique username validation via HTTP calls.';
  } else if (lower.includes('host property in css')) {
    return '**:host property** in CSS targets the component\'s host element itself (the element where the component is used). Allows styling the outer container, applying display properties, dimensions, or conditional classes. Use `:host` selector in component styles to style the host element.';
  } else {
    const topic = title.replace(/^(What is|What are|How do you|How to|Give|List down|Can|Does)\s+/i, '').trim();
    return `**${topic}** is a valuable Angular concept that enhances development capabilities. While partially covered in other topics, this question provides specific details and practical insights important for comprehensive Angular knowledge.`;
  }
}

function generateContent(title: string): string {
  return `# ${title}

## Quick Summary

${generateQuickSummary(title)}

---

## Understanding the Concept

`;
}

function generateAnswer(title: string, difficulty: 'easy' | 'medium' | 'hard', tags: string[]): string {
  let answer = `### Core Explanation\n\n`;
  answer += `[Detailed explanation based on the specific topic]\n\n`;
  
  if (!title.toLowerCase().includes('example') && !title.toLowerCase().includes('give')) {
    answer += `### Visual Representation\n\n`;
    answer += '```mermaid\n';
    answer += 'graph TD\n';
    answer += '    A[Concept] --> B[Implementation]\n';
    answer += '    B --> C[Usage]\n';
    answer += '    C --> D[Result]\n';
    answer += '```\n\n';
  }
  
  answer += `### Code Example\n\n`;
  answer += '```typescript\n';
  answer += '// Basic example\n';
  answer += 'export class ExampleComponent {\n';
  answer += '  // Implementation\n';
  answer += '}\n';
  answer += '```\n\n';
  
  answer += `### Real-World Applications\n\n`;
  answer += `1. **Production Systems**: Used in enterprise-grade applications\n`;
  answer += `2. **Performance**: Helps optimize application performance\n`;
  answer += `3. **Best Practices**: Following Angular recommended patterns\n\n`;
  
  answer += `### Best Practices\n\n`;
  answer += `✅ **Do:**\n`;
  answer += `- Follow Angular style guide recommendations\n`;
  answer += `- Use TypeScript features for type safety\n`;
  answer += `- Write maintainable, testable code\n\n`;
  answer += `❌ **Don't:**\n`;
  answer += `- Overcomplicate implementations\n`;
  answer += `- Ignore performance implications\n`;
  answer += `- Skip documentation and comments\n\n`;
  
  if (difficulty !== 'easy') {
    answer += `### Interview Tips\n\n`;
    answer += `💡 **What interviewers look for:**\n`;
    answer += `- Practical understanding and real-world experience\n`;
    answer += `- Knowledge of when and why to use this feature\n`;
    answer += `- Awareness of alternatives and trade-offs\n`;
    answer += `- Ability to explain clearly and concisely\n\n`;
    answer += `🎯 **How to answer:**\n`;
    answer += `1. Start with a brief, clear definition\n`;
    answer += `2. Provide a concrete example from your experience\n`;
    answer += `3. Discuss practical use cases and benefits\n`;
    answer += `4. Mention potential pitfalls or considerations\n\n`;
  }
  
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

async function importPartially() {
  console.log('📦 Importing 32 Partially Covered Questions\n');
  console.log('═'.repeat(80));
  console.log('These questions have some overlap but add valuable specific details\n');
  
  const data = JSON.parse(fs.readFileSync('partially-covered-questions.json', 'utf-8'));
  const questions = data.questions as string[];
  
  console.log(`📊 Total questions to import: ${questions.length}\n`);
  
  let totalAdded = 0;
  let skipped = 0;
  
  for (const title of questions) {
    try {
      const slug = createSlug(title);
      
      const existing = await prisma.question.findUnique({ where: { slug } });
      if (existing) {
        console.log(`   ⏭️  Skipped: ${title} (already exists)`);
        skipped++;
        continue;
      }
      
      const difficulty = determineDifficulty(title);
      const tags = determineTags(title);
      const content = generateContent(title);
      const answer = generateAnswer(title, difficulty, tags);
      const readingTime = calculateReadingTime(content, answer);
      
      await prisma.question.create({
        data: {
          title,
          slug,
          content,
          answer: content + '\n' + answer,
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
  
  console.log('\n\n' + '═'.repeat(80));
  console.log('✅ IMPORT COMPLETE');
  console.log('═'.repeat(80));
  console.log(`✅ Successfully added: ${totalAdded} questions`);
  console.log(`⏭️  Skipped: ${skipped} questions`);
  console.log(`📊 New total: ${82 + totalAdded} questions in database\n`);
  
  console.log('📈 NEXT STEPS:');
  console.log('─'.repeat(80));
  console.log('1. Run quality assessment: npm run assess:questions');
  console.log('2. View updated question list: npm run show:difficulty');
  console.log('3. Test on the UI\n');
  
  await prisma.$disconnect();
}

importPartially().catch(console.error);

