import { prisma } from '../src/lib/prisma';

const NEW_QUESTIONS = [
  "What is Angular Framework?",
  "What is the difference between AngularJS and Angular?",
  "What is TypeScript?",
  "Write a pictorial diagram of Angular architecture?",
  "What are the key components of Angular?",
  "What are directives?",
  "What are components?",
  "What are the differences between Component and Directive?",
  "What is a template?",
  "What is a module?",
  "What are lifecycle hooks available?",
  "What is a data binding?",
  "What is metadata?",
  "What is Angular CLI?",
  "What is the difference between constructor and ngOnInit?",
  "What is a service",
  "What is dependency injection in Angular?",
  "How is Dependency Hierarchy formed?",
  "What is the purpose of async pipe?",
  "What is the option to choose between inline and external template file?",
  "What is the purpose of *ngFor directive?",
  "What is the purpose of ngIf directive?",
  "What happens if you use script tag inside template?",
  "What is interpolation?",
  "What are template expressions?",
  "What are template statements?",
  "How do you categorize data binding types?",
  "What are pipes?",
  "What is a parameterized pipe?",
  "How do you chain pipes?",
  "What is a custom pipe?",
  "Give an example of custom pipe?",
  "What is the difference between pure and impure pipe?",
  "What is a bootstrapping module?",
  "What are observables?",
  "What is HttpClient and its benefits?",
  "Explain on how to use HttpClient with an example?",
  "How can you read full response?",
  "How do you perform Error handling?",
  "What is RxJS?",
  "What is subscribing?",
  "What is an observable?",
  "What is an observer?",
  "What is the difference between promise and observable?",
  "What is multicasting?",
  "How do you perform error handling in observables?",
  "What is the shorthand notation for subscribe method?",
  "What are the utility functions provided by RxJS?",
  "What are observable creation functions?",
  "What will happen if you do not supply handler for the observer?",
  "What are Angular elements?",
  "What is the browser support of Angular Elements?",
  "What are custom elements?",
  "Do I need to bootstrap custom elements?",
  "Explain how custom elements works internally?",
  "How to transfer components to custom elements?",
  "What are the mapping rules between Angular component and custom element?",
  "How do you define typings for custom elements?",
  "What are dynamic components?",
  "What are the various kinds of directives?",
  "How do you create directives using CLI?",
  "Give an example for attribute directives?",
  "What is Angular Router?",
  "What is the purpose of base href tag?",
  "What are the router imports?",
  "What is router outlet?",
  "What are router links?",
  "What are active router links?",
  "What is router state?",
  "What are router events?",
  "What is activated route?",
  "How do you define routes?",
  "What is the purpose of Wildcard route?",
  "Do I need a Routing Module always?",
  "What is Angular Universal?",
  "What are different types of compilation in Angular?",
  "What is JIT?",
  "What is AOT?",
  "Why do we need compilation process?",
  "What are the advantages with AOT?",
  "What are the ways to control AOT compilation?",
  "What are the restrictions of metadata?",
  "What are the three phases of AOT?",
  "Can I use arrow functions in AOT?",
  "What is the purpose of metadata json files?",
  "Can I use any javascript feature for expression syntax in AOT?",
  "What is folding?",
  "What are macros?",
  "Give an example of few metadata errors?",
  "What is metadata rewriting?",
  "How do you provide configuration inheritance?",
  "How do you specify angular template compiler options?",
  "How do you enable binding expression validation?",
  "What is the purpose of any type cast function?",
  "What is Non null type assertion operator?",
  "What is type narrowing?",
  "How do you describe various dependencies in angular application?",
  "What is zone?",
  "What is the purpose of common module?",
  "What is codelyzer?",
  "What is angular animation?",
  "What are the steps to use animation module?",
  "What is State function?",
  "What is Style function?",
  "What is the purpose of animate function?",
  "What is transition function?",
  "How to inject the dynamic script in angular?",
  "What is a service worker and its role in Angular?",
  "What are the design goals of service workers?",
  "What are the differences between AngularJS and Angular with respect to dependency injection?",
  "What is Angular Ivy?",
  "What are the features included in ivy preview?",
  "Can I use AOT compilation with Ivy?",
  "What is Angular Language Service?",
  "How do you install angular language service in the project?",
  "Is there any editor support for Angular Language Service?",
  "Explain the features provided by Angular Language Service?",
  "How do you add web workers in your application?",
  "What are the limitations with web workers?",
  "What is Angular CLI Builder?",
  "What is a builder?",
  "How do you invoke a builder?",
  "How do you create app shell in Angular?",
  "What are the case types in Angular?",
  "What are the class decorators in Angular?",
  "What are class field decorators?",
  "What is declarable in Angular?",
  "What are the restrictions on declarable classes?",
  "What is a DI token?",
  "What is Angular DSL?",
  "What is an rxjs Subject?",
  "What is Bazel tool?",
  "What are the advantages of Bazel tool?",
  "How do you use Bazel with Angular CLI?",
  "How do you run Bazel directly?",
  "What is platform in Angular?",
  "What happens if I import the same module twice?",
  "How do you select an element with in a component template?",
  "How do you detect route change in Angular?",
  "How do you pass headers for HTTP client?",
  "What is the purpose of differential loading in CLI?",
  "Does Angular support dynamic imports?",
  "What is lazy loading?",
  "What are workspace APIs?",
  "How do you upgrade angular version?",
  "What is Angular Material?",
  "How do you upgrade location service of angularjs?",
  "What is NgUpgrade?",
  "How do you test Angular application using CLI?",
  "How to use polyfills in Angular application?",
  "What are the ways to trigger change detection in Angular?",
  "What are the differences of various versions of Angular?",
  "What are the security principles in angular?",
  "What is the reason to deprecate Web Tracing Framework?",
  "What is the reason to deprecate web worker packages?",
  "How do you find angular CLI version?",
  "What is the browser support for Angular?",
  "What is schematic",
  "What is rule in Schematics?",
  "What is Schematics CLI?",
  "What are the best practices for security in angular?",
  "What is Angular security model for preventing XSS attacks?",
  "What is the role of template compiler for prevention of XSS attacks?",
  "What are the various security contexts in Angular?",
  "What is Sanitization? Does Angular support it?",
  "What is the purpose of innerHTML?",
  "What is the difference between interpolated content and innerHTML?",
  "How do you prevent automatic sanitization?",
  "Is it safe to use direct DOM API methods in terms of security?",
  "What is DOM sanitizer?",
  "How do you support server side XSS protection in Angular application?",
  "Does Angular prevent HTTP level vulnerabilities?",
  "What are Http Interceptors?",
  "What are the applications of HTTP interceptors?",
  "Are multiple interceptors supported in Angular?",
  "How can I use interceptor for an entire application?",
  "How does Angular simplify Internationalization?",
  "How do you manually register locale data?",
  "What are the four phases of template translation?",
  "What is the purpose of i18n attribute?",
  "What is the purpose of custom id?",
  "What happens if the custom id is not unique?",
  "Can I translate text without creating an element?",
  "How can I translate attribute?",
  "List down the pluralization categories?",
  "What is select ICU expression?",
  "How do you report missing translations?",
  "How do you provide build configuration for multiple locales?",
  "What is an angular library?",
  "What is AOT compiler?",
  "How do you select an element in component template?",
  "What is TestBed?",
  "What is protractor?",
  "What is collection?",
  "How do you create schematics for libraries?",
  "How do you use jquery in Angular?",
  "What is the reason for No provider for HTTP exception?",
  "What is router state?",
  "How can I use SASS in angular project?",
  "What is the purpose of hidden property?",
  "What is the difference between ngIf and hidden property?",
  "What is slice pipe?",
  "What is index property in ngFor directive?",
  "What is the purpose of ngFor trackBy?",
  "What is the purpose of ngSwitch directive?",
  "Is it possible to do aliasing for inputs and outputs?",
  "What is safe navigation operator?",
  "Is any special configuration required for Angular9?",
  "What are type safe TestBed API changes in Angular9?",
  "Is mandatory to pass static flag for ViewChild?",
  "What are the list of template expression operators?",
  "What is the precedence between pipe and ternary operators?",
  "What is an entry component?",
  "What is a bootstrapped component?",
  "How do you manually bootstrap an application?",
  "Is it necessary for bootstrapped component to be entry component?",
  "What is a routed entry component?",
  "Why is not necessary to use entryComponents array every time?",
  "Do I still need to use entryComponents array in Angular9?",
  "Is it all components generated in production build?",
  "What is Angular compiler?",
  "What is the role of ngModule metadata in compilation process?",
  "How does angular finds components, directives and pipes?",
  "Give few examples for NgModules?",
  "What are feature modules?",
  "What are the imported modules in CLI generated feature modules?",
  "What are the differences between ngmodule and javascript module?",
  "What are the possible errors with declarations?",
  "What are the steps to use declaration elements?",
  "What happens if browserModule used in feature module?",
  "What are the types of feature modules?",
  "What is a provider?",
  "What is the recommendation for provider scope?",
  "How do you restrict provider scope to a module?",
  "How do you provide a singleton service?",
  "What are the different ways to remove duplicate service registration?",
  "How does forRoot method helpful to avoid duplicate router instances?",
  "What is a shared module?",
  "Can I share services using modules?",
  "How do you get current direction for locales??",
  "What is ngcc?",
  "What classes should not be added to declarations?",
  "What is ngzone?",
  "What is NoopZone?",
  "How do you create displayBlock components?",
  "What are the possible data change scenarios for change detection?",
  "What is a zone context?",
  "What are the lifecycle hooks of a zone?",
  "Which are the methods of NgZone used to control change detection?",
  "How do you change the settings of zonejs?",
  "How do you trigger an animation?",
  "How do you configure injectors with providers at different levels?",
  "Is it mandatory to use injectable on every service class?",
  "What is an optional dependency?",
  "What are the types of injector hierarchies?",
  "What are reactive forms?",
  "What are dynamic forms?",
  "What are template driven forms?",
  "What are the differences between reactive forms and template driven forms?",
  "What are the different ways to group form controls?",
  "How do you update specific properties of a form model?",
  "What is the purpose of FormBuilder?",
  "How do you verify the model changes in forms?",
  "What are the state CSS classes provided by ngModel?",
  "How do you reset the form?",
  "What are the types of validator functions?",
  "Can you give an example of built-in validators?",
  "How do you optimize the performance of async validators?",
  "How to set ngFor and ngIf on the same element?",
  "What is host property in css?",
  "How do you get the current route?",
  "What is Component Test Harnesses?",
  "What is the benefit of Automatic Inlining of Fonts?",
  "What is content projection?",
  "What is ng-content and its purpose?",
  "What is standalone component?",
  "How to create a standalone component uing CLI command?",
  "How to create a standalone component manually?",
  "What is hydration ?",
  "What are Angular Signals?",
  "Explain Angular Signals with an example",
  "What are the Route Parameters? Could you explain each of them?"
];

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[?.!,;:]/g, '')
    .replace(/\s+/g, ' ');
}

async function analyzeQuestions() {
  console.log('🔍 Analyzing 282 new questions against existing database...\n');
  
  const existingQuestions = await prisma.question.findMany({
    select: {
      title: true,
      slug: true,
    }
  });
  
  console.log(`📊 Current database: ${existingQuestions.length} questions`);
  console.log(`📝 New list: ${NEW_QUESTIONS.length} questions\n`);
  
  const existingTitlesNormalized = new Set(
    existingQuestions.map(q => normalizeTitle(q.title))
  );
  
  const duplicates: string[] = [];
  const newQuestions: string[] = [];
  
  for (const newQ of NEW_QUESTIONS) {
    const normalized = normalizeTitle(newQ);
    if (existingTitlesNormalized.has(normalized)) {
      duplicates.push(newQ);
    } else {
      newQuestions.push(newQ);
    }
  }
  
  console.log('✅ ANALYSIS COMPLETE');
  console.log('═'.repeat(80));
  console.log(`Duplicates (already exist): ${duplicates.length}`);
  console.log(`New questions to add: ${newQuestions.length}`);
  console.log('');
  
  console.log('📋 SAMPLE DUPLICATES (First 10):');
  console.log('─'.repeat(80));
  duplicates.slice(0, 10).forEach((q, i) => {
    console.log(`${i + 1}. ${q}`);
  });
  
  console.log('\n\n🆕 NEW QUESTIONS TO ADD (First 20):');
  console.log('─'.repeat(80));
  newQuestions.slice(0, 20).forEach((q, i) => {
    console.log(`${i + 1}. ${q}`);
  });
  
  if (newQuestions.length > 20) {
    console.log(`\n... and ${newQuestions.length - 20} more questions\n`);
  }
  
  // Save to file for batch processing
  const fs = require('fs');
  fs.writeFileSync(
    'new-questions-to-add.json',
    JSON.stringify({ newQuestions, duplicates }, null, 2)
  );
  
  console.log('\n💾 Full list saved to: new-questions-to-add.json');
  console.log('\n📊 CATEGORIZATION OF NEW QUESTIONS:');
  console.log('─'.repeat(80));
  
  const categories = {
    basics: [] as string[],
    components: [] as string[],
    directives: [] as string[],
    forms: [] as string[],
    routing: [] as string[],
    http: [] as string[],
    rxjs: [] as string[],
    testing: [] as string[],
    compilation: [] as string[],
    security: [] as string[],
    i18n: [] as string[],
    advanced: [] as string[],
    other: [] as string[]
  };
  
  newQuestions.forEach(q => {
    const lower = q.toLowerCase();
    if (lower.includes('form')) categories.forms.push(q);
    else if (lower.includes('route') || lower.includes('router') || lower.includes('navigation')) categories.routing.push(q);
    else if (lower.includes('http') || lower.includes('httpclient') || lower.includes('interceptor')) categories.http.push(q);
    else if (lower.includes('rxjs') || lower.includes('observable') || lower.includes('subject') || lower.includes('subscribe')) categories.rxjs.push(q);
    else if (lower.includes('test') || lower.includes('protractor') || lower.includes('jasmine')) categories.testing.push(q);
    else if (lower.includes('directive')) categories.directives.push(q);
    else if (lower.includes('component')) categories.components.push(q);
    else if (lower.includes('aot') || lower.includes('jit') || lower.includes('compil') || lower.includes('ivy')) categories.compilation.push(q);
    else if (lower.includes('security') || lower.includes('xss') || lower.includes('sanitiz')) categories.security.push(q);
    else if (lower.includes('i18n') || lower.includes('internation') || lower.includes('locale')) categories.i18n.push(q);
    else if (lower.includes('animation') || lower.includes('worker') || lower.includes('bazel') || lower.includes('schematic')) categories.advanced.push(q);
    else if (lower.includes('what is') || lower.includes('what are')) categories.basics.push(q);
    else categories.other.push(q);
  });
  
  Object.entries(categories).forEach(([cat, questions]) => {
    if (questions.length > 0) {
      console.log(`\n${cat.toUpperCase()}: ${questions.length} questions`);
    }
  });
  
  console.log('\n\n🎯 NEXT STEPS:');
  console.log('═'.repeat(80));
  console.log('1. Review new-questions-to-add.json');
  console.log('2. Run batch import script to add questions with high-quality content');
  console.log('3. Questions will be added following our best practices template');
  console.log(`4. Estimated time: ~${Math.ceil(newQuestions.length / 10)} minutes\n`);
  
  await prisma.$disconnect();
}

analyzeQuestions().catch(console.error);

