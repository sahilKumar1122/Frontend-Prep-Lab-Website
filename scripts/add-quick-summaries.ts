import { prisma } from '../src/lib/prisma';

/**
 * Automatically adds Quick Summary sections to all questions
 * Based on the format: [Concept] is [definition]. It's [why it matters], particularly useful for [use case]. [benefit].
 */

interface QuestionSummary {
  title: string;
  summary: string;
}

// Pre-defined summaries for Angular questions based on common topics
const summaryTemplates: Record<string, QuestionSummary> = {
  'change-detection': {
    title: 'Change Detection',
    summary: `Change Detection is Angular's automatic system for synchronizing the UI with application data changes. It's essential for building reactive applications, particularly useful for maintaining consistency between component state and DOM without manual updates. It ensures your UI always reflects the current application state efficiently.`
  },
  'dependency-injection': {
    title: 'Dependency Injection',
    summary: `Dependency Injection (DI) is Angular's design pattern for providing dependencies to components and services rather than creating them internally. It's crucial for building testable and maintainable applications, particularly useful for managing service instances and sharing data across components. It promotes loose coupling and improves code reusability.`
  },
  'angular-router': {
    title: 'Angular Router',
    summary: `Angular Router is the official routing library that enables navigation between different views and components based on URL changes. It's essential for building Single Page Applications (SPAs), particularly useful for creating multi-page experiences without full page reloads. It provides features like lazy loading, route guards, and nested routing for complex application architectures.`
  },
  'rxjs': {
    title: 'RxJS',
    summary: `RxJS (Reactive Extensions for JavaScript) is a library for composing asynchronous and event-based programs using observable sequences. It's fundamental to Angular's reactive programming model, particularly useful for handling async operations like HTTP requests, user events, and real-time data streams. It provides powerful operators for transforming, combining, and managing data flows.`
  },
  'component-lifecycle': {
    title: 'Component Lifecycle',
    summary: `Component Lifecycle refers to the series of events that occur from component creation to destruction in Angular. It's critical for managing component initialization, updates, and cleanup, particularly useful for performing setup, fetching data, and resource cleanup at the right moments. It gives developers precise control over component behavior throughout its existence.`
  },
  'data-binding': {
    title: 'Data Binding',
    summary: `Data Binding is Angular's mechanism for coordinating data between the component class and the template. It's fundamental to building interactive UIs, particularly useful for displaying dynamic data and capturing user input without manual DOM manipulation. It supports multiple binding types (interpolation, property, event, and two-way) for different scenarios.`
  },
  'modules': {
    title: 'Angular Modules',
    summary: `Angular Modules (NgModules) are containers that group related components, directives, pipes, and services into cohesive blocks of functionality. They're essential for organizing large applications, particularly useful for lazy loading features and managing dependencies. They help structure applications and optimize bundle sizes.`
  },
  'directives': {
    title: 'Directives',
    summary: `Directives are classes that add behavior to elements in Angular applications, including structural directives (*ngIf, *ngFor) and attribute directives. They're powerful tools for DOM manipulation, particularly useful for conditional rendering, list rendering, and custom element behaviors. They enable declarative programming and code reuse across templates.`
  },
  'pipes': {
    title: 'Pipes',
    summary: `Pipes are simple functions that transform data in Angular templates for display purposes without changing the underlying data. They're convenient for formatting, particularly useful for dates, currencies, text transformation, and custom data formatting. They promote clean templates and reusable transformation logic.`
  },
  'services': {
    title: 'Services',
    summary: `Services are singleton classes that encapsulate business logic, data access, and shared functionality in Angular applications. They're crucial for separation of concerns, particularly useful for API calls, state management, and logic that multiple components need. They promote code reusability and testability through dependency injection.`
  },
  'reactive-forms': {
    title: 'Reactive Forms',
    summary: `Reactive Forms provide a model-driven approach to handling form inputs in Angular with explicit, immutable data flow. They're ideal for complex forms, particularly useful for dynamic form controls, custom validation, and complex form logic. They offer more control, testability, and scalability compared to template-driven forms.`
  },
  'template-driven-forms': {
    title: 'Template-Driven Forms',
    summary: `Template-Driven Forms use directives in templates to create and manipulate form models, offering a simpler approach for basic forms. They're suitable for simple scenarios, particularly useful for quick forms with straightforward validation. They require less component code but offer less flexibility than reactive forms.`
  },
  'http-client': {
    title: 'HTTP Client',
    summary: `HttpClient is Angular's service for making HTTP requests to backend APIs with built-in features like interceptors and typed responses. It's essential for data-driven applications, particularly useful for CRUD operations, authentication, and API integration. It provides a powerful, observable-based API for handling async HTTP operations.`
  },
  'interceptors': {
    title: 'HTTP Interceptors',
    summary: `HTTP Interceptors are middleware that intercept and transform HTTP requests and responses in Angular applications. They're powerful for cross-cutting concerns, particularly useful for authentication tokens, error handling, logging, and request/response transformation. They enable centralized HTTP request management.`
  },
  'route-guards': {
    title: 'Route Guards',
    summary: `Route Guards are interfaces that control navigation to and from routes based on specific conditions like authentication or data availability. They're essential for securing applications, particularly useful for protecting routes, preventing navigation, and implementing authorization logic. They ensure users only access routes they're permitted to view.`
  },
  'lazy-loading': {
    title: 'Lazy Loading',
    summary: `Lazy Loading is a technique that loads feature modules only when needed rather than at application startup. It's crucial for performance optimization, particularly useful for large applications where loading everything upfront would slow initial load times. It significantly reduces initial bundle size and improves time-to-interactive.`
  },
  'ngrx': {
    title: 'NgRx',
    summary: `NgRx is a state management library for Angular inspired by Redux, using RxJS for reactive state management. It's essential for complex applications, particularly useful for managing shared state, handling side effects, and maintaining predictable state updates. It provides a unidirectional data flow and excellent debugging capabilities.`
  },
  'signals': {
    title: 'Angular Signals',
    summary: `Signals are Angular's new reactive primitive for fine-grained reactivity and change detection. They're a modern alternative to RxJS for many scenarios, particularly useful for simpler reactive state management with better performance. They provide a simpler mental model and more efficient change detection for local component state.`
  },
  'onpush': {
    title: 'OnPush Change Detection',
    summary: `OnPush is a change detection strategy that checks components only when inputs change or events occur within the component. It's critical for performance optimization, particularly useful in large component trees where checking every component on every change would be expensive. It can significantly reduce change detection cycles and improve app responsiveness.`
  },
  'content-projection': {
    title: 'Content Projection',
    summary: `Content Projection (ng-content) allows components to accept and render external content in designated slots. It's powerful for creating reusable components, particularly useful for building flexible layouts, wrapper components, and component libraries. It enables component composition and increases component flexibility.`
  },
  'view-encapsulation': {
    title: 'View Encapsulation',
    summary: `View Encapsulation controls how component styles are scoped and applied in Angular. It's important for style isolation, particularly useful for preventing style leakage between components and maintaining consistent styling. It offers three modes: Emulated (default), ShadowDOM, and None.`
  },
  'testing': {
    title: 'Angular Testing',
    summary: `Angular Testing encompasses unit testing with Jasmine/Jest and integration testing with TestBed for components, services, and other Angular constructs. It's crucial for code quality, particularly useful for catching bugs early, ensuring functionality works as expected, and enabling safe refactoring. It provides confidence in application reliability.`
  },
  'performance': {
    title: 'Performance Optimization',
    summary: `Performance Optimization in Angular involves techniques like lazy loading, OnPush strategy, trackBy, and bundle optimization to improve application speed and responsiveness. It's essential for user experience, particularly useful for large-scale applications where poor performance leads to user frustration. It ensures fast load times and smooth interactions.`
  },
  'ssr': {
    title: 'Server-Side Rendering (SSR)',
    summary: `Server-Side Rendering (SSR) with Angular Universal renders applications on the server before sending HTML to the client. It's important for SEO and performance, particularly useful for content-heavy sites that need search engine visibility and faster initial page loads. It improves perceived performance and enables better social media sharing.`
  },
  'security': {
    title: 'Angular Security',
    summary: `Angular Security covers built-in protections against common web vulnerabilities like XSS, CSRF, and injection attacks. It's critical for protecting users and data, particularly useful for understanding Angular's sanitization, trusted types, and security best practices. Angular provides multiple layers of defense by default.`
  },
  'i18n': {
    title: 'Internationalization (i18n)',
    summary: `Internationalization (i18n) is the process of designing Angular applications to support multiple languages and locales. It's essential for global applications, particularly useful for reaching international audiences and providing localized experiences. Angular provides built-in tools for message extraction, translation, and locale-specific formatting.`
  },
  'animations': {
    title: 'Angular Animations',
    summary: `Angular Animations use the Web Animations API to create smooth transitions and animated effects in applications. They're important for UX, particularly useful for providing visual feedback, guiding user attention, and creating polished interfaces. They integrate declaratively with Angular's template syntax.`
  },
  'ivy': {
    title: 'Angular Ivy',
    summary: `Ivy is Angular's modern compilation and rendering pipeline that produces smaller bundles and faster compilation. It's the foundation of modern Angular, particularly useful for improved performance, better debugging, and more flexible compilation. It enables features like smaller bundle sizes and faster builds.`
  },
  'zone': {
    title: 'Zone.js',
    summary: `Zone.js is a library that intercepts async operations and notifies Angular when to run change detection. It's fundamental to Angular's automatic change detection, particularly useful for triggering UI updates after async operations without manual intervention. It makes Angular "magically" reactive to async events.`
  },
  'standalone': {
    title: 'Standalone Components',
    summary: `Standalone Components are a modern Angular feature that allows components to function without NgModules. They're the future of Angular architecture, particularly useful for simplifying application structure and reducing boilerplate. They make Angular more approachable and easier to understand.`
  },
};

// Function to generate a quick summary based on question title
function generateQuickSummary(title: string, content: string): string {
  const lowerTitle = title.toLowerCase();
  
  // Try to match with predefined templates
  for (const [key, template] of Object.entries(summaryTemplates)) {
    if (lowerTitle.includes(key) || lowerTitle.includes(template.title.toLowerCase())) {
      return template.summary;
    }
  }
  
  // Extract concept from title
  const concept = title.replace(/^(What is|What are|How does|How do you|How to|Explain|When to use|Compare)\s+/i, '').replace(/\?$/, '');
  
  // Generate a generic summary
  return `${concept} is a fundamental concept in Angular development. It's important for building robust applications, particularly useful for managing complex scenarios effectively. Understanding this concept helps developers create better, more maintainable Angular applications.`;
}

async function addQuickSummaries() {
  console.log('🚀 Adding Quick Summaries to all questions...\n');
  
  const questions = await prisma.question.findMany({
    select: {
      id: true,
      title: true,
      answer: true,
      content: true,
    },
  });
  
  let updated = 0;
  let skipped = 0;
  
  for (const question of questions) {
    // Check if already has Quick Summary
    if (question.answer.includes('#### 🎯 Quick Summary') || 
        question.answer.includes('## 🎯 Quick Summary') ||
        question.answer.includes('### 🎯 Quick Summary')) {
      console.log(`⏭️  Skipping: ${question.title} (already has Quick Summary)`);
      skipped++;
      continue;
    }
    
    // Generate summary
    const summary = generateQuickSummary(question.title, question.content);
    
    // Add Quick Summary at the beginning of the answer
    const updatedAnswer = `#### 🎯 Quick Summary

${summary}

${question.answer}`;
    
    // Update in database
    await prisma.question.update({
      where: { id: question.id },
      data: { answer: updatedAnswer },
    });
    
    console.log(`✅ Updated: ${question.title}`);
    updated++;
  }
  
  console.log('\n' + '═'.repeat(50));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(50));
  console.log(`✅ Updated: ${updated} questions`);
  console.log(`⏭️  Skipped: ${skipped} questions (already had summaries)`);
  console.log(`📈 Total: ${questions.length} questions`);
  
  console.log('\n🎉 Done! Run assessment to see improved scores:');
  console.log('   npm run assess:questions\n');
  
  await prisma.$disconnect();
}

addQuickSummaries().catch(console.error);

