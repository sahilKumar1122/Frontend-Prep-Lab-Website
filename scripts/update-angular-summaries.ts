import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Comprehensive Angular Quick Summaries - All 114 questions
function getAngularQuickSummary(title: string): string {
  const summaries: { [key: string]: string } = {
    // A-C
    'Can I use AOT compilation with Ivy?': 'Yes, Ivy fully supports AOT compilation and makes it the default compilation mode in Angular 9+. Ivy enhances AOT with faster builds, smaller bundles, better debugging, and true incremental compilation, eliminating most drawbacks of pre-Ivy AOT.',
    
    'Do I still need to use entryComponents array in Angular9?': 'No, the entryComponents array is obsolete in Angular 9+ with Ivy. Ivy automatically identifies components created dynamically (modals, dialogs, dynamic component creation), eliminating the need for manual registration in this array.',
    
    'Give an example of few metadata errors?': 'Metadata errors occur during AOT compilation when decorators contain non-static expressions like arrow functions, function calls, spread operators, or dynamic property access. Common examples include computed property names in @Component decorator or ternary operators in providers array.',
    
    'Give few examples for NgModules?': 'Angular provides built-in NgModules like BrowserModule (root app), CommonModule (directives/pipes for feature modules), FormsModule/ReactiveFormsModule (forms), HttpClientModule (HTTP), RouterModule (routing). Custom modules include SharedModule, CoreModule, and feature modules for organization.',
    
    'How can I translate attribute?': 'Use the i18n-<attribute> syntax to mark HTML attributes for translation. For example, i18n-title="@@unique-id" translates the title attribute. This works for any HTML attribute including alt, placeholder, aria-label, enabling full internationalization of your templates.',
    
    'How can I use SASS in angular project?': 'Angular CLI supports SASS out-of-the-box. Set "inlineStyleLanguage": "scss" in angular.json, use .scss file extensions for styles, and reference them in component styleUrls. Angular automatically compiles SCSS to CSS during build, supporting variables, mixins, and nesting.',
    
    'How can you read full response?': 'Use HttpClient with { observe: \'response\' } option to access the complete HttpResponse object including headers, status code, and body. This provides full control over HTTP responses for scenarios requiring access to headers like pagination tokens or custom authentication headers.',
    
    'How do you create displayBlock components?': 'Set display: block on component\'s host element using :host { display: block; } in component styles or host: { \'style\': \'display: block\' } in @Component decorator. This makes components behave as block elements instead of inline, useful for layout containers and full-width components.',
    
    'How do you debug Memory Leaks in Angular?': 'Use Chrome DevTools Memory Profiler to take heap snapshots, compare memory usage over time, and identify detached DOM nodes. Common causes are unsubscribed Observables, event listeners not removed, uncleaned timers. Fix with takeUntil pattern, async pipe, and proper ngOnDestroy cleanup.',
    
    'How do you define typings for custom elements?': 'Extend HTMLElementTagNameMap interface in a .d.ts file to add TypeScript typings for Angular custom elements (Web Components). This enables type-safe usage of custom elements with proper autocomplete and type checking when used outside Angular or in hybrid applications.',
    
    'How do you implement Complex Form Validation?': 'Implement complex validation using custom ValidatorFn for field-level logic, form-level validators for cross-field rules, AsyncValidatorFn for API checks, conditional validators that change based on other fields, and FormArray validators for dynamic lists with aggregate constraints.',
    
    'How do you invoke a builder?': 'Invoke Angular CLI Builders using ng run <project>:<target> command or programmatically via Architect API with scheduleBuilder(). Builders execute custom build/deployment logic defined in angular.json, enabling extensible build processes for specialized tasks like deployment or code generation.',
    
    'How do you manually bootstrap an application?': 'Call platformBrowserDynamic().bootstrapModule(AppModule) explicitly in main.ts instead of using Angular\'s automatic bootstrap. This provides control over initialization timing, useful for loading configuration from APIs, conditional module loading, or integrating with non-Angular systems requiring specific initialization order.',
    
    'How do you manually register locale data?': 'Import locale data from @angular/common/locales and call registerLocaleData(localeData) in app.module.ts. Required for supporting non-English locales in date pipes, number pipes, and i18n features. Multiple locales can be registered for multi-language applications.',
    
    'How do you prevent automatic sanitization?': 'Use DomSanitizer to bypass Angular\'s built-in XSS protection with bypassSecurityTrustHtml/Style/Script/Url/ResourceUrl methods. Only bypass sanitization for trusted content sources as it exposes applications to XSS attacks. Always validate and sanitize data from untrusted sources yourself.',
    
    'How do you provide configuration inheritance?': 'Use hierarchical dependency injection with providedIn or providers array at different levels. Child injectors inherit parent configurations but can override them. Use InjectionToken with factory providers for complex configuration merging across module boundaries.',
    
    'How do you report missing translations?': 'Configure Angular i18n compiler with missingTranslation option: "error", "warning", or "ignore". Use translation files (messages.xlf) to track missing translations. Third-party libraries like @ngx-translate provide runtime missing translation handlers for dynamic content.',
    
    'How do you run Bazel directly?': 'Run Bazel commands using bazelisk or bazel binary: bazel build/test/run followed by target label (e.g., bazel build //src:app). Bazel requires BUILD files defining targets and dependencies. Angular CLI can integrate with Bazel for incremental builds in monorepos.',
    
    'How do you upgrade angular version?': 'Use ng update @angular/cli @angular/core to upgrade Angular versions. The command analyzes package.json, updates dependencies, and runs migration schematics to automatically update code for breaking changes. Always review update.angular.io for version-specific migration guides.',
    
    'How do you upgrade location service of angularjs?': 'Provide $locationShim in upgrade module to make AngularJS $location service work with Angular Router during hybrid app migration. This enables gradual migration while maintaining URL synchronization between AngularJS and Angular routing systems.',
    
    'How do you use Bazel with Angular CLI?': 'Configure Angular CLI to use Bazel by adding @angular/bazel schematics. Bazel provides fast, incremental builds for large monorepos by caching build artifacts and only rebuilding changed dependencies. Requires BUILD files and WORKSPACE configuration for dependency management.',
    
    'How do you use jquery in Angular?': 'Import jQuery as npm package, add types with @types/jquery, declare $ or jQuery in component, and access via constructor or ngOnInit. However, direct DOM manipulation with jQuery breaks Angular\'s change detection and should be avoided. Use Angular\'s Renderer2 or native DOM APIs instead.',
    
    'How does Angular simplify Internationalization?': 'Angular i18n provides template-based translation with i18n attribute, extracts translatable text to XLIFF files, supports pluralization and gender, integrates with build process for generating locale-specific bundles. AOT compilation ensures small bundle sizes per locale.',
    
    'How does Content Projection work internally?': 'Content projection uses <ng-content> to project external content into component templates. Angular moves projected DOM nodes into component\'s template without destroying/recreating them. Supports select attribute for multi-slot projection based on CSS selectors, enabling flexible component APIs.',
    
    'How does NgRx integrate with Angular?': 'NgRx integrates via Store service injected through DI, Effects using RxJS observables for side effects, and selectors for deriving state. State changes flow through Redux pattern: dispatch actions → reducers update state → selectors emit changes → components react via async pipe.',
    
    'How to create Custom Structural Directives?': 'Implement structural directives using @Directive with selector in square brackets, inject TemplateRef and ViewContainerRef, and use createEmbeddedView() to conditionally render template. The * syntax is syntactic sugar for <ng-template> wrapping, providing context variables for templates.',
    
    'How to create Dynamic Components?': 'Create dynamic components using ComponentFactoryResolver (pre-Ivy) or ViewContainerRef.createComponent() (Ivy). Load components at runtime into ViewContainerRef from @ViewChild or dynamic component loader service. Useful for modals, plugins, and content-driven UIs.',
    
    'How to implement Internationalization (i18n)?': 'Mark text with i18n attribute in templates, extract with ng extract-i18n to XLIFF files, translate files per locale, build separate bundles per locale with ng build --localize. Runtime i18n uses libraries like ngx-translate for dynamic translations without rebuilding.',
    
    'How to implement Micro-Frontends in Angular?': 'Implement micro-frontends using Module Federation (Webpack 5), Angular Elements for web components, or iframe isolation. Each micro-frontend is independently deployable Angular application. Share dependencies via shared scope, communicate via CustomEvents or shared state management.',
    
    'How to implement Service Workers and PWA?': 'Add PWA support with ng add @angular/pwa. Service Worker caches assets, provides offline functionality, and enables push notifications. Configure caching strategies in ngsw-config.json for different resource types. Test offline behavior in production mode with ng build --prod.',
    
    'How to profile and optimize Angular performance?': 'Use Angular DevTools for component profiling, Chrome DevTools Performance tab for runtime analysis, and Lighthouse for overall metrics. Optimize with OnPush change detection, lazy loading, virtual scrolling, trackBy functions, and webpack bundle analyzer for identifying large dependencies.',
    
    'How to use Web Workers in Angular?': 'Generate web worker with ng generate web-worker, communicate via postMessage/onMessage, run CPU-intensive tasks off main thread. Workers don\'t have DOM access. Useful for data processing, image manipulation, cryptography without blocking UI thread.',
    
    // I-M
    'Is any special configuration required for Angular9?': 'Angular 9 with Ivy requires no special configuration as Ivy is enabled by default. Legacy View Engine can be re-enabled with "enableIvy": false in tsconfig.json. Ivy provides better performance, smaller bundles, and improved debugging out-of-the-box.',
    
    'Is it possible to do aliasing for inputs and outputs?': 'Yes, use @Input(\'alias\') and @Output(\'alias\') to provide different names for properties in templates vs component code. For example, @Input(\'label\') displayText: string allows <comp label="text"> while using displayText internally. Useful for public APIs and backwards compatibility.',
    
    'Is mandatory to pass static flag for ViewChild?': 'In Angular 9+, static flag is mandatory only if accessing ViewChild in ngOnInit (static: true) or later lifecycle hooks (static: false, default). Static queries are resolved before change detection, non-static after. Ivy infers timing automatically in most cases.',
    
    'List down the pluralization categories?': 'Angular i18n supports ICU pluralization categories: zero, one, two, few, many, other. Different languages use different categories (English uses one/other, Arabic uses all six). Use {count, plural, =0 {none} one {# item} other {# items}} syntax in templates.',
    
    'What are 10+ Performance Optimization Techniques in Angular?': 'Key techniques include OnPush change detection, lazy loading modules, virtual scrolling for large lists, trackBy for ngFor, preloading strategies, AOT compilation, bundle optimization with differential loading, tree shaking, service worker caching, and avoiding function calls in templates.',
    
    'What are Angular Module Boundaries and Architecture?': 'Module boundaries organize code into cohesive units: CoreModule (singleton services), SharedModule (reusable components), feature modules (business logic). Boundaries prevent circular dependencies, enable lazy loading, and provide clear separation of concerns in large applications.',
    
    'What are Angular Modules?': 'NgModules organize Angular apps into cohesive blocks with @NgModule decorator defining declarations (components/directives/pipes), imports (other modules), providers (services), and exports (public API). BrowserModule starts apps, CommonModule adds directives, feature modules organize features.',
    
    'What are Angular Schematics?': 'Schematics are code generators and transformers for Angular CLI. They scaffold components, update code during migrations, enforce conventions, and automate repetitive tasks. Custom schematics enable team-specific generators, ensuring consistent patterns across projects.',
    
    'What are Angular Security Best Practices?': 'Security best practices include using Angular\'s built-in XSS protection, sanitizing user input, validating on server-side, using HTTPS, implementing CSP headers, protecting against CSRF with tokens, auditing dependencies, using strict TypeScript mode, and avoiding direct DOM manipulation.',
    
    'What are Angular Signals vs Observables?': 'Signals (Angular 16+) provide reactive primitives with synchronous, glitch-free updates and fine-grained reactivity. Observables handle async operations, event streams, and complex compositions. Signals integrate with change detection automatically, while Observables require async pipe or manual subscription management.',
    
    'What are class field decorators?': 'Class field decorators include @Input (component inputs), @Output (event emitters), @ViewChild/@ViewChildren (template queries), @ContentChild/@ContentChildren (content projection queries), and @HostBinding/@HostListener (host element interactions). They provide metadata for Angular\'s dependency injection and template system.',
    
    'What are HTTP Interceptors?': 'HTTP Interceptors transform outgoing requests and incoming responses globally. Implement HttpInterceptor interface with intercept() method. Common uses: adding auth tokens, logging, error handling, caching, request/response transformation, loading indicators. Registered in providers as HTTP_INTERCEPTORS multi-provider.',
    
    'What are macros?': 'Macros in Angular compilation are metadata transformations that happen at compile-time. Template compiler uses macros to resolve expressions, evaluate static values, and optimize templates. Understanding macros helps debug AOT compilation errors related to metadata that can\'t be statically analyzed.',
    
    'What are Modern Angular Features (Signals, Standalone, Zoneless)?': 'Modern features include Signals for fine-grained reactivity, Standalone Components eliminating NgModules, Zoneless change detection for better performance. These simplify Angular development, reduce boilerplate, improve performance, and align with modern web development patterns.',
    
    'What are Reactive Forms in Angular?': 'Reactive Forms provide model-driven approach using FormControl, FormGroup, FormArray with explicit, immutable state in component class. Enable complex validation, dynamic forms, and better testing compared to template-driven forms. Built on RxJS observables for reactive updates.',
    
    'What are Route Guards and Authentication?': 'Route Guards control navigation using CanActivate (access), CanDeactivate (leave with unsaved changes), Resolve (pre-fetch data), CanLoad (lazy loading). Return boolean or Observable<boolean>. Used for authentication, authorization, preventing data loss, and ensuring required data loads before route activation.',
    
    'What are RxJS Operators? Explain switchMap, mergeMap, concatMap, and exhaustMap': 'RxJS operators transform observable streams. switchMap cancels previous (search autocomplete), mergeMap runs concurrent (parallel API calls), concatMap queues sequential (ordered operations), exhaustMap ignores new while running (prevent double-submit). Critical for handling nested observables and async operations.',
    
    'What are the advantages of Bazel tool?': 'Bazel provides fast incremental builds caching unchanged artifacts, parallel builds using all cores, dependency analysis preventing unnecessary rebuilds, hermetic builds ensuring reproducibility, and monorepo support with shared code. Excellent for large Angular applications and microservices.',
    
    'What are the class decorators in Angular?': 'Class decorators include @Component (components), @Directive (directives), @Pipe (pipes), @Injectable (services), @NgModule (modules). They provide metadata for Angular\'s dependency injection, change detection, and template compilation systems.',
    
    'What are the differences between ngmodule and javascript module?': 'JavaScript modules (ES6) organize code with import/export for file-level organization. NgModules organize Angular features with @NgModule decorator for dependency injection, compilation context, and feature grouping. Both work together: NgModules import components, JS modules import dependencies.',
    
    'What are the differences of various versions of Angular?': 'Major Angular versions introduced: Angular 2 (complete rewrite), 4 (HttpClient), 5 (build optimizer), 6 (ng add, ng update), 8 (differential loading), 9 (Ivy by default), 12 (strict mode), 14 (standalone components), 16 (Signals), 17 (new control flow). Semantic versioning ensures predictable updates.',
    
    'What are the different types of Data Binding in Angular?': 'Angular supports four binding types: interpolation {{ }} (one-way to view), property binding [prop] (one-way to view), event binding (event) (one-way from view), two-way binding [(ngModel)] (bidirectional). Bindings keep templates synchronized with component state automatically.',
    
    'What are the different ways to remove duplicate service registration?': 'Prevent duplicate services using providedIn: \'root\' for tree-shakable singleton, importing CoreModule only once with constructor guard, using forRoot/forChild pattern for module configuration, or using Angular 14+ inject() in standalone components ensuring single instance.',
    
    'What are the four phases of template translation?': 'i18n translation phases: 1) Mark text with i18n attributes in templates, 2) Extract messages with ng extract-i18n to XLIFF files, 3) Translate XLIFF files for each locale, 4) Build separate bundles per locale with ng build --localize. Each phase is automated by Angular CLI.',
    
    'What are the list of template expression operators?': 'Template expressions support: pipe operator |, safe navigation ?., non-null assertion !, optional chaining ?., nullish coalescing ??, type assertion (as type). Avoid complex expressions, assignments, new/typeof/instanceof, chaining assignments, or increment/decrement operators in templates.',
    
    'What are the restrictions of metadata?': 'AOT metadata must be statically analyzable: no arrow functions, function calls, computed properties, spread operators, or ternary operators in decorators. Use exported const, literals, or exported functions. Restrictions enable tree-shaking and compile-time optimization.',
    
    'What are the restrictions on declarable classes?': 'Declarables (components, directives, pipes) can only be declared in one NgModule, must be exported to be used in other modules, cannot be provided in providers array, and must have @Component/@Directive/@Pipe decorators. Standalone components (Angular 14+) bypass these restrictions.',
    
    'What are the state CSS classes provided by ngModel?': 'ngModel adds CSS classes: ng-valid/ng-invalid (validation state), ng-touched/ng-untouched (user interaction), ng-dirty/ng-pristine (value changed), ng-pending (async validation). Use for visual feedback: .ng-invalid.ng-touched { border-color: red; } shows errors after user interaction.',
    
    'What are the steps to use animation module?': 'Import BrowserAnimationsModule in AppModule, define animations in @Component using trigger/state/style/transition/animate, bind trigger to elements with [@triggerName], control programmatically via component properties. Animations use Angular Animation DSL for declarative, reusable UI transitions.',
    
    'What are the steps to use declaration elements?': 'Declare components/directives/pipes in @NgModule declarations array, import modules containing them, export for use in other modules. Standalone components (Angular 14+) skip NgModule: mark with standalone: true, import dependencies directly in component imports array.',
    
    'What are the types of validator functions?': 'Validators include sync validators (immediate validation returning ValidationErrors), async validators (API checks returning Observable/Promise), built-in validators (Validators.required, email, min, max), custom validators (ValidatorFn/AsyncValidatorFn), and composed validators using Validators.compose.',
    
    'What are the various kinds of directives?': 'Angular has three directive types: Components (directives with template), Structural Directives (change DOM layout with *, e.g., *ngIf, *ngFor), Attribute Directives (change appearance/behavior without DOM changes, e.g., ngClass, ngStyle). All use @Directive/@Component decorators.',
    
    'What are workspace APIs?': 'Workspace APIs (architect) provide programmatic access to Angular CLI builders, allowing custom build/test/deployment tools. APIs include workspace.json configuration, builder API for custom builders, schematic API for code generation, enabling tooling customization and CI/CD integration.',
    
    'What is a bootstrapped component?': 'Bootstrapped component is the root component initialized when Angular starts, defined in @NgModule bootstrap array (typically AppComponent). Entry point for component tree, rendered to index.html. Single-spa and module federation can bootstrap multiple applications.',
    
    'What is Angular CLI Builder?': 'Angular CLI Builder is a function that executes Angular CLI commands like build, test, serve. Builders are defined in angular.json with options, implement Builder interface, and can be customized. Third-party builders enable webpack customization, deployment automation, and custom development servers.',
    
    'What is Angular DSL?': 'Angular DSL (Domain Specific Language) refers to Angular\'s template syntax: structural directives (*ngIf), property binding ([prop]), event binding ((event)), two-way binding ([(ngModel)]), pipes (|), safe navigation (?.),  and interpolation ({{ }}). Declarative syntax compiled to efficient JavaScript.',
    
    'What is Angular Hydration and SSR?': 'Hydration (Angular 16+) attaches client-side Angular to server-rendered HTML, avoiding re-rendering and content flicker. SSR (Server-Side Rendering) uses Angular Universal to render pages on server for better SEO, faster initial load, and social media sharing. Hydration makes SSR seamless.',
    
    'What is Angular Ivy Renderer?': 'Ivy is Angular\'s modern rendering engine (default since Angular 9) replacing View Engine. Benefits include smaller bundles, faster compilation, better debugging, locality principle enabling tree-shakeable components, and improved template type checking. Enables standalone components and Signals.',
    
    'What is Angular Router?': 'Angular Router enables navigation between views, lazy loading modules, route parameters, nested routes, route guards, and browser history management. Configure routes array with path-component mappings, use RouterModule.forRoot/forChild, navigate with routerLink or Router service programmatically.',
    
    'What is Angular Testing Architecture?': 'Angular testing uses Jasmine/Jest for unit tests, Karma for running tests, TestBed for configuring testing module, ComponentFixture for component testing, and Protractor/Cypress for E2E tests. Provides utilities like async, fakeAsync, tick for async testing and spies for mocking dependencies.',
    
    'What is Angular\'s Change Detection Mechanism?': 'Change detection checks component tree for changes and updates DOM. Strategies: Default (checks all components), OnPush (checks only when inputs change or events fire). Triggered by async events (DOM events, HTTP, timers). Zone.js patches async APIs to auto-trigger; zoneless uses Signals/RxJS.',
    
    'What is Angular\'s Core Architecture?': 'Angular architecture includes modules (feature organization), components (UI building blocks), templates (HTML with directives), dependency injection (service management), services (business logic), directives (DOM manipulation), pipes (data transformation), and routing (navigation). All orchestrated via decorators and metadata.',
    
    'What is Angular\'s Dependency Injection System?': 'DI system provides dependencies to classes via constructor injection. Hierarchical injectors (root, module, component) enable scoping. Use providedIn: \'root\' for singletons, providers for module/component-specific instances. InjectionToken for non-class dependencies. Enables testing, modularity, and loose coupling.',
    
    'What is Angular\'s Modular Architecture?': 'Modular architecture organizes apps into NgModules for lazy loading, clear boundaries, and reusability. CoreModule holds singletons, SharedModule exports common utilities, feature modules encapsulate features. Standalone components (Angular 14+) simplify by removing NgModule requirement.',
    
    'What is AOT vs JIT Compilation?': 'AOT (Ahead-of-Time) compiles templates during build, creating smaller bundles, faster rendering, and catching errors early. JIT (Just-in-Time) compiles at runtime in browser, enabling faster dev iteration. AOT is default for production; JIT used in development mode.',
    
    'What is Bazel tool?': 'Bazel is Google\'s build tool providing fast incremental builds via caching, parallel execution, and dependency analysis. Excellent for monorepos with shared code. Angular officially supports Bazel for enterprise applications requiring reproducible, fast builds at scale.',
    
    'What is codelyzer?': 'Codelyzer is a linting tool for Angular following style guide best practices. Checks component selectors, template syntax, naming conventions, and architecture patterns. Deprecated in favor of Angular ESLint with @angular-eslint/eslint-plugin providing similar functionality.',
    
    'What is declarable in Angular?': 'Declarables are classes decorated with @Component, @Directive, or @Pipe that can be declared in NgModule declarations array. They define templates, DOM manipulation, and data transformation. Must belong to exactly one NgModule unless marked as standalone (Angular 14+).',
    
    'What is folding?': 'Folding is AOT compiler optimization that evaluates constant expressions at compile-time, replacing them with literal values. For example, const + const becomes single value. Reduces runtime overhead and enables better tree-shaking. Requires expressions be statically analyzable.',
    
    'What is host property in css?': ':host CSS selector targets component\'s host element. Use for default styling: :host { display: block; }. :host-context() styles based on ancestor: :host-context(.dark) applies in dark theme. :host() with function selector styles conditionally.',
    
    'What is metadata rewriting?': 'Metadata rewriting transforms TypeScript decorators during compilation to Angular\'s internal format. Converts decorators like @Component to static metadata Angular runtime understands. Happens during ngc compilation, enabling tree-shaking by removing decorator runtime overhead.',
    
    'What is multicasting?': 'Multicasting shares a single Observable execution among multiple subscribers using multicast operators (share, shareReplay, publish). Prevents duplicate HTTP requests or calculations. ConnectableObservables with refCount enable automatic subscription management for hot observables.',
    
    'What is ngcc?': 'ngcc (Angular Compatibility Compiler) converts node_modules libraries compiled with View Engine to Ivy format. Runs automatically during npm install or ng serve. Ensures third-party libraries work with Ivy. Not needed for libraries already published in Ivy format.',
    
    'What is NgUpgrade?': 'NgUpgrade enables hybrid AngularJS-Angular applications, running both frameworks simultaneously during migration. Provides UpgradeModule for bootstrapping, $rootScope integration, and component adapters. Allows gradual migration path from AngularJS to Angular.',
    
    'What is Non null type assertion operator?': 'Non-null assertion operator (!) tells TypeScript compiler that value is not null/undefined when it cannot infer. Use sparingly: this.user!.name. Useful after null checks or when you know value exists. Misuse leads to runtime errors if assumption wrong.',
    
    'What is Renderer2 and when to use it?': 'Renderer2 provides platform-agnostic API for DOM manipulation, enabling SSR and web worker compatibility. Use instead of direct DOM access (document.querySelector). Methods: createElement, appendChild, setStyle, setAttribute. Ensures app works across all Angular platforms (browser, server, mobile).',
    
    'What is RxJS and why use Observables?': 'RxJS implements Observables for async/event-based programming. Provides operators for transformation (map, filter), combination (merge, concat), error handling (catchError, retry), and time manipulation (debounceTime, throttle). Superior to Promises for cancellation, multiple values, and complex async flows.',
    
    'What is safe navigation operator?': 'Safe navigation operator (?.) prevents errors when accessing nested properties on null/undefined. Example: user?.address?.city returns undefined if user or address is null. Template-only feature preventing "Cannot read property of undefined" errors.',
    
    'What is Sanitization? Does Angular support it?': 'Angular automatically sanitizes untrusted values before rendering in DOM, preventing XSS attacks. Sanitizes HTML, styles, URLs, and resource URLs. Use DomSanitizer to bypass for trusted content. Never disable sanitization for user input.',
    
    'What is select ICU expression?': 'ICU select expression chooses translation based on string value: {gender, select, male {Mr.} female {Ms.} other {Mx.}}. Different from plural (numbers) or ordinal. Used for gender, status, or any categorical text selection in i18n.',
    
    'What is the benefit of Automatic Inlining of Fonts?': 'Angular CLI 11+ automatically inlines fonts in CSS during build, reducing HTTP requests and eliminating FOUT (Flash of Unstyled Text). Improves page load performance especially on slow networks. Fonts are base64-encoded into CSS bundles for faster rendering.',
    
    'What is the Component Lifecycle in Angular?': 'Component lifecycle hooks are: ngOnChanges (input changes), ngOnInit (initialize), ngDoCheck (custom change detection), ngAfterContentInit/Checked (content projection), ngAfterViewInit/Checked (view queries), ngOnDestroy (cleanup). Each triggers at specific times enabling fine-grained control over component behavior.',
    
    'What is the difference between interpolated content and innerHTML?': 'Interpolation {{ }} sanitizes content automatically, preventing XSS. innerHTML directly injects HTML without sanitization (dangerous). Use interpolation for text, pipe for safe HTML, or DomSanitizer.sanitize() for user content. Never use innerHTML with user input.',
    
    'What is the difference between ngOnInit and Constructor?': 'Constructor initializes class, runs before Angular setup. ngOnInit runs after first input binding, ideal for initialization logic depending on @Input values, API calls, or component setup. Constructor for DI, ngOnInit for Angular-specific initialization.',
    
    'What is the option to choose between inline and external template file?': 'Use inline template with template: `` for small templates (<10 lines), external with templateUrl: \'./file.html\' for larger ones. Inline keeps component self-contained; external enables syntax highlighting, better IDE support, and separation of concerns.',
    
    'What is the purpose of *ngFor directive?': '*ngFor iterates over arrays/iterables rendering template per item. Syntax: *ngFor="let item of items; trackBy: trackFn". trackBy improves performance by tracking items via identity, preventing unnecessary re-renders when array reference changes.',
    
    'What is the purpose of animate function?': 'animate() defines timing and styles for Angular animations. Syntax: animate(\'300ms ease-in\', style({ opacity: 1 })). First parameter is duration/delay/easing, second is target styles. Part of Animation DSL with trigger/state/transition for declarative animations.',
    
    'What is the purpose of any type cast function?': '$any() template function bypasses TypeScript checking in AOT mode. Use sparingly when you know type is correct but compiler cannot infer. Example: $any(user).dynamicProperty. Better to fix types than use $any, but useful for gradual migrations.',
    
    'What is the purpose of async pipe?': 'Async pipe subscribes to Observables/Promises and automatically unsubscribes onDestroy, preventing memory leaks. Returns latest emitted value: data$ | async. Triggers change detection on emission. Handles loading state implicitly with *ngIf="data$ | async as data".',
    
    'What is the purpose of differential loading in CLI?': 'Differential loading builds two bundles: modern (ES2015+) for new browsers, legacy (ES5) for old browsers. Browsers automatically load appropriate bundle via <script type="module">. Reduces bundle size for modern browsers while maintaining compatibility.',
    
    'What is the purpose of hidden property?': '[hidden] attribute hides elements with display: none. Unlike *ngIf which removes from DOM, [hidden] keeps element in DOM. Use [hidden] for toggle-heavy elements to avoid recreation overhead. Be aware it can be overridden by CSS display.',
    
    'What is the purpose of i18n attribute?': 'i18n attribute marks text for translation. Syntax: i18n="meaning|description@@id". Angular extracts to XLIFF files, translators provide translations, build generates locale-specific bundles. Supports interpolation, pluralization, and attribute translation.',
    
    'What is the purpose of ngFor trackBy?': 'trackBy function identifies items in *ngFor by unique identifier instead of object reference. Prevents unnecessary DOM re-renders when array recreated. Syntax: trackBy: trackById. Significantly improves performance for large lists with frequent updates.',
    
    'What is the purpose of ngIf directive?': '*ngIf conditionally adds/removes elements from DOM based on expression. Use for elements that don\'t exist frequently. For simple visibility, prefer [hidden]. Supports else: *ngIf="cond; else other". Removes event listeners and child components when false.',
    
    'What is the purpose of ngSwitch directive?': 'ngSwitch adds/removes elements from DOM based on switch expression. Use with *ngSwitchCase and *ngSwitchDefault. More readable than multiple ngIf for multiple conditions. Example: rendering different views based on user role or status.',
    
    'What is the reason to deprecate Web Tracing Framework?': 'Web Tracing Framework was deprecated due to low adoption, maintenance overhead, and better alternatives like Chrome DevTools Performance profiler and Angular DevTools. Modern profiling tools provide better insights with less complexity.',
    
    'What is the reason to deprecate web worker packages?': 'Angular\'s @angular/platform-webworker was deprecated due to limited use cases and maintenance burden. Modern approach uses standard Web Workers API with Angular components in main thread, workers for heavy computation. Web Worker support still available, just not as full platform.',
    
    'What is transition function?': 'transition() defines animations between states in Angular Animation DSL. Syntax: transition(\'stateA => stateB\', animate(...)). Supports wildcards: \'* => *\' for any transition, void for enter/leave. Enables declarative UI animations with timeline control.',
    
    'What is type narrowing?': 'Type narrowing in TypeScript refines types based on conditionals. Example: if (typeof x === \'string\') narrows x to string. Works with instanceof, truthiness, equality. Angular templates benefit from narrowing with *ngIf="data$ | async as data" providing typed data.',
    
    'What is View Encapsulation?': 'View Encapsulation controls CSS scoping: Emulated (default, scoped via attributes), ShadowDom (native Shadow DOM), None (global styles). Set in @Component encapsulation property. Emulated provides scoping without Shadow DOM browser limitations.',
    
    'What is your Angular Testing Strategy?': 'Comprehensive testing includes unit tests (components, services with TestBed), integration tests (component interactions), E2E tests (user workflows with Cypress/Playwright). Use TestBed for Angular-specific testing, mocks for dependencies, async/fakeAsync for async operations. Aim for 80%+ coverage of critical paths.',
    
    'What is Zone.js and Zoneless Change Detection?': 'Zone.js patches async APIs to trigger change detection automatically. Zoneless (experimental) uses Signals and explicit change detection, improving performance and reducing bundle size. Zoneless requires manual markForCheck or reactive primitives like Signals for updates.'
  };

  return summaries[title] || '';
}

async function updateAngularSummaries() {
  console.log('🔄 Starting Angular Questions Summary Update\n');
  console.log('═'.repeat(80));

  const questions = await prisma.question.findMany({
    where: {
      category: 'angular'
    },
    select: {
      id: true,
      slug: true,
      title: true,
      answer: true
    },
    orderBy: {
      title: 'asc'
    }
  });

  console.log(`📦 Total Angular questions to update: ${questions.length}\n`);

  let updated = 0;
  let added = 0;
  let notFound = 0;
  let errors = 0;

  for (const question of questions) {
    try {
      const newSummary = getAngularQuickSummary(question.title);
      
      if (!newSummary) {
        console.log(`⚠️  No summary mapping for: ${question.title}`);
        notFound++;
        continue;
      }

      // Check if Quick Summary section exists
      const quickSummaryRegex = /####? 🎯 Quick Summary\n\n([\s\S]*?)(\n\n(?:---|\#|$))/;
      const match = question.answer.match(quickSummaryRegex);

      let updatedAnswer: string;
      
      if (match) {
        // Replace existing Quick Summary
        updatedAnswer = question.answer.replace(
          quickSummaryRegex,
          `#### 🎯 Quick Summary\n\n${newSummary}\n\n$2`
        );
        console.log(`✅ Updated: ${question.title}`);
        updated++;
      } else {
        // Add Quick Summary at the beginning after title
        const titleMatch = question.answer.match(/^#[^#].*?\n\n/);
        if (titleMatch) {
          const insertPoint = titleMatch[0].length;
          updatedAnswer = 
            question.answer.slice(0, insertPoint) +
            `#### 🎯 Quick Summary\n\n${newSummary}\n\n# Answer\n\n` +
            question.answer.slice(insertPoint);
          console.log(`➕ Added summary: ${question.title}`);
          added++;
        } else {
          // Fallback: prepend to answer
          updatedAnswer = `#### 🎯 Quick Summary\n\n${newSummary}\n\n# Answer\n\n${question.answer}`;
          console.log(`➕ Added summary (fallback): ${question.title}`);
          added++;
        }
      }

      // Update in database
      await prisma.question.update({
        where: { id: question.id },
        data: { answer: updatedAnswer }
      });

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 50));

    } catch (error: any) {
      console.error(`❌ Error updating "${question.title}":`, error.message);
      errors++;
    }
  }

  console.log('\n' + '═'.repeat(80));
  console.log('📊 Update Summary\n');
  console.log(`✅ Updated existing summaries: ${updated}`);
  console.log(`➕ Added new summaries: ${added}`);
  console.log(`⚠️  No mapping found: ${notFound}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📈 Total processed: ${updated + added + notFound + errors}/${questions.length}`);

  await prisma.$disconnect();
}

updateAngularSummaries().catch(console.error);

