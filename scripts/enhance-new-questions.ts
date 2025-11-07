import { prisma } from '../src/lib/prisma';

// List of questions that need enhancement (the 43 new ones)
const QUESTIONS_TO_ENHANCE = [
  "What is the option to choose between inline and external template file?",
  "What is multicasting?",
  "How do you define typings for custom elements?",
  "What are the various kinds of directives?",
  "What are the restrictions of metadata?",
  "What is folding?",
  "What are macros?",
  "What is metadata rewriting?",
  "What is the purpose of any type cast function?",
  "What is Non null type assertion operator?",
  "What is type narrowing?",
  "What is codelyzer?",
  "What is the purpose of animate function?",
  "What is transition function?",
  "How do you invoke a builder?",
  "What is declarable in Angular?",
  "What are the restrictions on declarable classes?",
  "What is Angular DSL?",
  "What is Bazel tool?",
  "What are the advantages of Bazel tool?",
  "What is the purpose of differential loading in CLI?",
  "What are workspace APIs?",
  "How do you upgrade location service of angularjs?",
  "What is NgUpgrade?",
  "What are the differences of various versions of Angular?",
  "What is the reason to deprecate Web Tracing Framework?",
  "What is the reason to deprecate web worker packages?",
  "What is the difference between interpolated content and innerHTML?",
  "How do you manually register locale data?",
  "What are the four phases of template translation?",
  "How can I translate attribute?",
  "List down the pluralization categories?",
  "How do you use jquery in Angular?",
  "Is it possible to do aliasing for inputs and outputs?",
  "Is any special configuration required for Angular9?",
  "Is mandatory to pass static flag for ViewChild?",
  "What is a bootstrapped component?",
  "Do I still need to use entryComponents array in Angular9?",
  "What are the differences between ngmodule and javascript module?",
  "What are the different ways to remove duplicate service registration?",
  "What is ngcc?",
  "What are the state CSS classes provided by ngModel?",
  "What is the benefit of Automatic Inlining of Fonts?"
];

function generateEnhancedContent(question: any): string {
  const title = question.title;
  const lower = title.toLowerCase();
  
  let quickSummary = '';
  
  // Generate smart quick summaries based on keywords
  if (lower.includes('inline') && lower.includes('external') && lower.includes('template')) {
    quickSummary = '**Template files** in Angular can be defined either inline within the component decorator using `template` property, or externally in a separate HTML file using `templateUrl`. The choice depends on template complexity and team preferences—inline for simple templates (< 3 lines), external for complex ones.';
  } else if (lower.includes('multicasting')) {
    quickSummary = '**Multicasting** in RxJS is the practice of sharing a single observable execution among multiple subscribers. Instead of creating a new execution for each subscriber, multicasting operators like `share()`, `publish()`, and `multicast()` ensure all subscribers receive the same values from one shared execution.';
  } else if (lower.includes('typings') && lower.includes('custom elements')) {
    quickSummary = '**Custom element typings** allow TypeScript to recognize your Angular custom elements with proper type checking. You define TypeScript declarations that extend `HTMLElementTagNameMap`, enabling autocomplete and type safety when using custom elements in your code.';
  } else if (lower.includes('various kinds') && lower.includes('directives')) {
    quickSummary = '**Angular directives** come in three types: Component directives (with templates), Structural directives (change DOM layout like `*ngIf`, `*ngFor`), and Attribute directives (change appearance/behavior like `ngClass`, `ngStyle`). Each type serves a specific purpose in manipulating the DOM.';
  } else if (lower.includes('restrictions') && lower.includes('metadata')) {
    quickSummary = '**AOT metadata restrictions** require that decorator metadata be statically analyzable at compile time. You cannot use dynamic expressions, arrow functions, or complex logic in decorators—only literal values, references, and simple expressions are allowed.';
  } else if (lower.includes('folding')) {
    quickSummary = '**Folding** in Angular\'s AOT compiler is the process of evaluating expressions in metadata at build time and replacing them with their results. This reduces runtime overhead and enables better tree-shaking by resolving values during compilation.';
  } else if (lower.includes('macros')) {
    quickSummary = '**Macros** in Angular are special functions that the compiler recognizes and evaluates during build time rather than runtime. Common macros include `forwardRef()` for circular dependencies and `makeDecorator()` for creating custom decorators.';
  } else if (lower.includes('metadata rewriting')) {
    quickSummary = '**Metadata rewriting** is an AOT compilation process where the compiler transforms and optimizes decorator metadata to make it compatible with the runtime. This includes simplifying expressions, resolving references, and converting to a format the runtime can efficiently process.';
  } else if (lower.includes('type cast function')) {
    quickSummary = '**Type cast functions** in Angular templates allow you to tell the compiler to treat a value as a specific type, avoiding type errors. The `$any()` function is the most common, letting you bypass type checking when necessary for dynamic scenarios.';
  } else if (lower.includes('non null') && lower.includes('assertion')) {
    quickSummary = '**Non-null assertion operator** (`!`) in TypeScript tells the compiler that a value is definitely not null or undefined, even if the type suggests it could be. Used in templates and code when you know a value exists but TypeScript cannot infer it statically.';
  } else if (lower.includes('type narrowing')) {
    quickSummary = '**Type narrowing** is TypeScript\'s ability to refine a variable\'s type based on conditional checks. In Angular templates and components, the compiler can narrow union types through `typeof`, `instanceof`, or custom type guards, providing better type safety.';
  } else if (lower.includes('codelyzer')) {
    quickSummary = '**Codelyzer** is a static analysis tool that checks Angular and TypeScript code against the Angular Style Guide. It runs as TSLint/ESLint rules, catching common mistakes and enforcing best practices like component naming conventions and proper use of lifecycle hooks.';
  } else if (lower.includes('animate function')) {
    quickSummary = '**animate() function** in Angular animations defines the timing and styles for animation transitions. It specifies duration, delay, and easing, controlling how elements move from one state to another: `animate(\'300ms ease-in\', style({...}))`.';
  } else if (lower.includes('transition function')) {
    quickSummary = '**transition() function** defines when and how animations should occur between states. It specifies the state change trigger (like `void => *` for enter animations) and the animation sequence to apply during that transition.';
  } else if (lower.includes('builder') && lower.includes('invoke')) {
    quickSummary = '**Angular Builders** are invoked through the Angular CLI or programmatically via the Architect API. You can execute them using `ng run <project>:<target>` or by creating a custom build script that calls the Architect\'s `scheduleBuilder()` method.';
  } else if (lower.includes('declarable')) {
    quickSummary = '**Declarables** in Angular are the three types of classes that can be declared in an NgModule: components, directives, and pipes. These are the building blocks that define your application\'s UI and must be registered in exactly one module.';
  } else if (lower.includes('restrictions') && lower.includes('declarable')) {
    quickSummary = '**Declarable class restrictions** require that components, directives, and pipes be declared in exactly one NgModule, have a selector (except pipes use `name`), and not be declared in multiple modules unless they\'re re-exported through a shared module.';
  } else if (lower.includes('angular dsl')) {
    quickSummary = '**Angular DSL** (Domain Specific Language) refers to the template syntax that Angular provides for building dynamic UIs. This includes interpolation, property/event binding, structural directives, and template reference variables—a specialized language for Angular templates.';
  } else if (lower.includes('bazel') && !lower.includes('advantages')) {
    quickSummary = '**Bazel** is Google\'s build tool that Angular can use for faster, more scalable builds. It provides advanced caching, incremental builds, and parallel execution, making it ideal for large monorepos and enterprise applications with complex build requirements.';
  } else if (lower.includes('advantages') && lower.includes('bazel')) {
    quickSummary = '**Bazel\'s advantages** include hermetic builds (reproducible across machines), fine-grained caching (only rebuild what changed), distributed execution (parallel builds across machines), and excellent scalability for large projects. It\'s particularly valuable for monorepos.';
  } else if (lower.includes('differential loading')) {
    quickSummary = '**Differential loading** is an Angular CLI feature that creates two builds: modern ES2015+ for newer browsers and ES5 for older browsers. Browsers automatically download only what they support, reducing bundle sizes for modern users while maintaining compatibility.';
  } else if (lower.includes('workspace apis')) {
    quickSummary = '**Workspace APIs** in Angular CLI allow programmatic access to workspace configuration and build architecture. You can read/modify `angular.json`, execute builders, and create custom schematics that interact with the project structure.';
  } else if (lower.includes('upgrade') && lower.includes('location service')) {
    quickSummary = '**Upgrading AngularJS location service** to Angular involves using `@angular/common/upgrade` package and the `$locationShim` service. This provides backward compatibility while migrating, allowing AngularJS and Angular routing to coexist during the upgrade process.';
  } else if (lower.includes('ngupgrade')) {
    quickSummary = '**NgUpgrade** is Angular\'s official library for incrementally upgrading AngularJS applications to Angular. It allows both frameworks to run simultaneously, letting you migrate components one at a time while maintaining a functioning application.';
  } else if (lower.includes('differences') && lower.includes('versions')) {
    quickSummary = '**Angular versions** have evolved significantly: v2-4 introduced the modern framework, v5-7 added CLI improvements, v8-9 brought Ivy renderer, v10-12 improved performance, v13-14 added standalone components, and v15+ introduced signals and better developer experience.';
  } else if (lower.includes('deprecate') && lower.includes('web tracing')) {
    quickSummary = '**Web Tracing Framework** was deprecated because it was rarely used, added maintenance burden, and better alternatives like Chrome DevTools and Angular DevTools emerged. The Angular team focused resources on more impactful performance tools.';
  } else if (lower.includes('deprecate') && lower.includes('web worker')) {
    quickSummary = '**Web worker packages** were deprecated in their original form because they required significant setup and had limited use cases. Angular now recommends using native Web Workers API directly with Angular\'s Zone.js configuration for better control and flexibility.';
  } else if (lower.includes('interpolated') && lower.includes('innerhtml')) {
    quickSummary = '**Interpolation** (`{{}}`) automatically escapes HTML for security, displaying it as text. **innerHTML** binding renders actual HTML but is sanitized by Angular\'s DomSanitizer. Use interpolation for text, innerHTML only when you need to render trusted HTML content.';
  } else if (lower.includes('manually register') && lower.includes('locale')) {
    quickSummary = '**Registering locale data manually** involves importing locale data from `@angular/common/locales` and calling `registerLocaleData()`. This is necessary when you need locales beyond `en-US` for date/number formatting and i18n features.';
  } else if (lower.includes('four phases') && lower.includes('translation')) {
    quickSummary = '**Template translation phases** are: 1) Mark text for translation with `i18n` attributes, 2) Extract messages using `ng extract-i18n`, 3) Translate the extracted messages (XLIFF files), 4) Build localized versions using `ng build` with locale configuration.';
  } else if (lower.includes('translate attribute')) {
    quickSummary = '**Translating attributes** requires using `i18n-<attribute>` syntax. For example, `i18n-title="@@imageTitle"` on an element will mark the `title` attribute for translation, allowing different translations for attribute values across locales.';
  } else if (lower.includes('pluralization categories')) {
    quickSummary = '**ICU pluralization categories** include: zero, one, two, few, many, and other. Different languages use different categories (English uses one/other, Arabic uses all six). Angular\'s i18n handles these automatically based on locale rules.';
  } else if (lower.includes('jquery')) {
    quickSummary = '**Using jQuery in Angular** is generally discouraged but possible. Install jQuery via npm, add types, and import in components. However, prefer Angular\'s `Renderer2` for DOM manipulation and `@ViewChild` for element access—jQuery circumvents Angular\'s change detection.';
  } else if (lower.includes('aliasing') && lower.includes('inputs') && lower.includes('outputs')) {
    quickSummary = '**Input/Output aliasing** lets you expose a different property name externally than internally. Use `@Input(\'externalName\') internalName` or `@Output(\'externalName\') internalEmitter`. Useful for maintaining internal naming conventions while providing better public APIs.';
  } else if (lower.includes('angular9') && lower.includes('configuration')) {
    quickSummary = '**Angular 9 configuration** introduced Ivy by default, requiring no special setup. However, you can opt-out using `"enableIvy": false` in `tsconfig.json`. The main change is improved build times and smaller bundle sizes automatically.';
  } else if (lower.includes('static flag') && lower.includes('viewchild')) {
    quickSummary = '**ViewChild static flag** was required in Angular 8-9 to specify when the query result should be resolved: before (`static: true`) or after (`static: false`) change detection. Angular 9+ made it optional—defaults to false for most cases.';
  } else if (lower.includes('bootstrapped component')) {
    quickSummary = '**Bootstrapped component** is the root component that Angular instantiates and inserts into the browser DOM when the application starts. Typically `AppComponent`, it\'s specified in the `bootstrap` array of your root NgModule and serves as the application\'s entry point.';
  } else if (lower.includes('entrycomponents') && lower.includes('angular9')) {
    quickSummary = '**entryComponents array** is no longer needed in Angular 9+ with Ivy. The Ivy compiler automatically identifies dynamically created components. Previously required for components created programmatically (modals, dialogs), Ivy makes this obsolete.';
  } else if (lower.includes('ngmodule') && lower.includes('javascript module')) {
    quickSummary = '**NgModules** are Angular\'s organizational containers with `@NgModule` decorator, managing dependencies and compilation. **JavaScript modules** are ES6 file-level modules using `import/export`. NgModules organize Angular code; JS modules organize file structure—they work together but serve different purposes.';
  } else if (lower.includes('duplicate service registration')) {
    quickSummary = '**Preventing duplicate service registration** can be done using: 1) `providedIn: \'root\'` for tree-shakable singletons, 2) `ModuleWithProviders` pattern with `forRoot()`, 3) Checking if module was already loaded in constructor. This ensures one service instance across the app.';
  } else if (lower.includes('ngcc')) {
    quickSummary = '**ngcc** (Angular Compatibility Compiler) converts pre-Ivy libraries to Ivy format during `npm install`. It reads View Engine libraries and transforms them to work with Ivy, running automatically in postinstall. Crucial for using older libraries with modern Angular.';
  } else if (lower.includes('state css classes') && lower.includes('ngmodel')) {
    quickSummary = '**ngModel CSS classes** automatically reflect form control state: `.ng-valid`/`.ng-invalid` for validation, `.ng-pristine`/`.ng-dirty` for modification, `.ng-touched`/`.ng-untouched` for interaction. Use these for visual feedback on form fields without additional code.';
  } else if (lower.includes('automatic inlining') && lower.includes('fonts')) {
    quickSummary = '**Automatic font inlining** in Angular CLI embeds small font files directly into CSS as base64, reducing HTTP requests. Enabled by default for fonts under 10KB, improving initial load performance by eliminating extra network round trips.';
  } else {
    // Generic summary
    const topic = title.replace(/^(What is|What are|How do you|How to|List down|Is|Do|Can)\s+/i, '').trim();
    quickSummary = `**${topic}** is an important Angular concept that helps developers build robust applications. Understanding this is valuable for both development and technical interviews.`;
  }
  
  return `# ${title}

## Quick Summary

${quickSummary}

---

`;
}

async function enhanceQuestions() {
  console.log('✨ Enhancing 43 New Questions to Interview Standards\n');
  console.log('═'.repeat(80));
  
  let enhanced = 0;
  let errors = 0;
  
  for (const title of QUESTIONS_TO_ENHANCE) {
    try {
      const question = await prisma.question.findFirst({
        where: { title }
      });
      
      if (!question) {
        console.log(`⚠️  Not found: ${title}`);
        continue;
      }
      
      // Generate enhanced content
      const newContent = generateEnhancedContent(question);
      
      // Prepend the quick summary to the existing answer
      const enhancedAnswer = newContent + '\n' + question.answer;
      
      await prisma.question.update({
        where: { id: question.id },
        data: { answer: enhancedAnswer }
      });
      
      enhanced++;
      console.log(`✅ Enhanced: ${title}`);
      
    } catch (error) {
      console.log(`❌ Error: ${title}`);
      errors++;
    }
  }
  
  console.log('\n' + '═'.repeat(80));
  console.log('✅ ENHANCEMENT COMPLETE');
  console.log('═'.repeat(80));
  console.log(`✅ Enhanced: ${enhanced} questions`);
  console.log(`❌ Errors: ${errors}`);
  console.log('\n📈 NEXT STEP:');
  console.log('   Run assessment again: npm run assess:questions\n');
  
  await prisma.$disconnect();
}

enhanceQuestions().catch(console.error);

