import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleQuestions = [
  {
    slug: 'what-is-angular-change-detection',
    title: 'What is Angular Change Detection?',
    category: 'angular',
    difficulty: 'medium',
    tags: ['change-detection', 'performance', 'angular'],
    content: `# What is Angular Change Detection?

Angular's change detection is the mechanism that keeps the UI in sync with the application state. It's what makes Angular applications reactive and ensures that when data changes, the view updates accordingly.

## How It Works

Angular uses a tree of change detectors, one for each component. When an event occurs (user input, HTTP response, timer), Angular runs change detection from the root component down through the component tree.

## Key Concepts

- **Zone.js**: Angular uses Zone.js to automatically trigger change detection
- **Change Detection Strategy**: Components can use Default or OnPush strategies
- **Performance**: Understanding change detection is crucial for optimization`,
    answer: `# Answer: Angular Change Detection

Angular change detection is a mechanism that synchronizes the model state with the view. Here are the key points:

## Default Strategy
- Checks every component in the tree
- Runs on every asynchronous event
- Simple but can be less performant

## OnPush Strategy
- Only checks when:
  - Input properties change (by reference)
  - Events originate from the component
  - Async pipe receives a new value
- More performant for large applications

## Best Practices
1. Use OnPush strategy where possible
2. Use immutable data structures
3. Avoid heavy computations in templates
4. Use trackBy with *ngFor

\`\`\`typescript
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  // Component logic
}
\`\`\``,
    codeExample: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-efficient',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
  \`
})
export class EfficientComponent {
  title = 'Optimized Component';
  count = 0;
}`,
    readingTime: 8,
    order: 1,
  },
  {
    slug: 'react-hooks-useeffect-cleanup',
    title: 'How does useEffect cleanup work in React?',
    category: 'react',
    difficulty: 'medium',
    tags: ['hooks', 'useEffect', 'cleanup', 'react'],
    content: `# How does useEffect cleanup work in React?

The useEffect hook in React allows you to perform side effects in function components. The cleanup function is a crucial part of useEffect that helps prevent memory leaks and unwanted behavior.

## When Cleanup Runs

The cleanup function runs:
- Before the effect runs again (on re-render)
- When the component unmounts

## Why It's Important

Without proper cleanup, you might experience:
- Memory leaks
- Stale closures
- Duplicate subscriptions
- Race conditions`,
    answer: `# Answer: useEffect Cleanup

The cleanup function in useEffect is returned from the effect function and runs at specific times:

## Syntax

\`\`\`javascript
useEffect(() => {
  // Effect logic here
  
  return () => {
    // Cleanup logic here
  };
}, [dependencies]);
\`\`\`

## Common Use Cases

1. **Subscriptions**: Unsubscribe from event listeners
2. **Timers**: Clear intervals or timeouts
3. **API Calls**: Cancel pending requests
4. **WebSockets**: Close connections

## Example with Event Listener

\`\`\`javascript
useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup: remove event listener
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // Empty array = runs once on mount
\`\`\`

## Best Practices
- Always cleanup subscriptions and event listeners
- Cancel pending API requests
- Clear timers
- Close WebSocket connections`,
    codeExample: `import { useEffect, useState } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    // Cleanup function
    return () => clearInterval(interval);
  }, []);
  
  return <div>Seconds: {seconds}</div>;
}`,
    readingTime: 6,
    order: 1,
  },
  {
    slug: 'javascript-closures-explained',
    title: 'What are Closures in JavaScript?',
    category: 'javascript',
    difficulty: 'medium',
    tags: ['closures', 'scope', 'functions', 'javascript'],
    content: `# What are Closures in JavaScript?

A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

## Key Concept

Closures allow functions to "remember" the environment in which they were created.

## Why Are They Useful?

- Data privacy
- Function factories
- Callbacks and event handlers
- Partial application
- Memoization`,
    answer: `# Answer: JavaScript Closures

A closure is created when a function is defined inside another function and the inner function references variables from the outer function.

## Simple Example

\`\`\`javascript
function outer() {
  const message = 'Hello';
  
  function inner() {
    console.log(message); // Accesses outer variable
  }
  
  return inner;
}

const myFunction = outer();
myFunction(); // Logs: "Hello"
\`\`\`

## Practical Use Cases

### 1. Data Privacy (Module Pattern)
\`\`\`javascript
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.getCount()); // 0
counter.increment();
console.log(counter.getCount()); // 1
\`\`\`

### 2. Function Factory
\`\`\`javascript
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
\`\`\`

## Common Gotcha: Loops
\`\`\`javascript
// Wrong
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Logs: 3, 3, 3
}

// Right (using let)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Logs: 0, 1, 2
}

// Right (using closure)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100); // Logs: 0, 1, 2
  })(i);
}
\`\`\``,
    codeExample: `// Counter with closure
function createCounter() {
  let count = 0;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => count = 0,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getCount()); // 2`,
    readingTime: 7,
    order: 1,
  },
  {
    slug: 'css-flexbox-vs-grid',
    title: 'CSS Flexbox vs Grid: When to use each?',
    category: 'css',
    difficulty: 'easy',
    tags: ['flexbox', 'grid', 'layout', 'css'],
    content: `# CSS Flexbox vs Grid: When to use each?

Both Flexbox and Grid are powerful CSS layout systems, but they serve different purposes and excel in different scenarios.

## Flexbox (1D Layout)

Flexbox is designed for one-dimensional layouts - either a row or a column.

## Grid (2D Layout)

Grid is designed for two-dimensional layouts - rows and columns simultaneously.`,
    answer: `# Answer: Flexbox vs Grid

## Use Flexbox When:

1. **One-dimensional layouts**
   - Navigation bars
   - Card layouts in a single row/column
   - Centering items
   - Space distribution

2. **Content-first design**
   - Content size determines layout
   - Flexible sizing based on content

## Use Grid When:

1. **Two-dimensional layouts**
   - Page layouts
   - Complex grids
   - Gallery layouts
   - Magazine-style layouts

2. **Layout-first design**
   - Layout structure is predetermined
   - Need precise placement

## Quick Comparison

| Feature | Flexbox | Grid |
|---------|---------|------|
| Dimension | 1D (row or column) | 2D (rows and columns) |
| Content | Content-driven | Layout-driven |
| Best for | Components, navigation | Page layouts |
| Browser Support | Excellent | Excellent (modern) |

## Examples

### Flexbox Example
\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

### Grid Example
\`\`\`css
.page-layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
\`\`\`

## Can You Use Both?

**Yes!** They work great together:
- Use Grid for overall page layout
- Use Flexbox for component-level layouts`,
    codeExample: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}`,
    readingTime: 5,
    order: 1,
  },
  {
    slug: 'typescript-generics-basics',
    title: 'What are Generics in TypeScript?',
    category: 'typescript',
    difficulty: 'hard',
    tags: ['generics', 'types', 'typescript', 'advanced'],
    content: `# What are Generics in TypeScript?

Generics provide a way to create reusable components that work with multiple types while maintaining type safety.

## Why Use Generics?

- Code reusability
- Type safety
- Flexibility
- Better IDE support

## Basic Syntax

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\``,
    answer: `# Answer: TypeScript Generics

Generics allow you to write flexible, reusable code that works with multiple types while preserving type information.

## Basic Generic Function

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

// Usage
const num = identity<number>(42);
const str = identity<string>("hello");
const auto = identity("inferred"); // Type inferred
\`\`\`

## Generic Interfaces

\`\`\`typescript
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 123 };
const stringBox: Box<string> = { value: "hello" };
\`\`\`

## Generic Classes

\`\`\`typescript
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
\`\`\`

## Generic Constraints

\`\`\`typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}

logLength("hello");     // OK
logLength([1, 2, 3]);   // OK
logLength(123);         // Error: number doesn't have length
\`\`\`

## Multiple Type Parameters

\`\`\`typescript
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const result = pair("age", 25); // [string, number]
\`\`\`

## Real-World Example

\`\`\`typescript
class ApiService<T> {
  async fetchData(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
  }
}

interface User {
  id: number;
  name: string;
}

const userService = new ApiService<User>();
const user = await userService.fetchData('/api/user');
// user is typed as User
\`\`\``,
    codeExample: `// Generic function with constraint
function findMax<T extends { value: number }>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  
  return items.reduce((max, item) => 
    item.value > max.value ? item : max
  );
}

// Usage
const items = [
  { value: 10, name: 'a' },
  { value: 20, name: 'b' },
  { value: 15, name: 'c' }
];

const max = findMax(items); // { value: 20, name: 'b' }`,
    readingTime: 10,
    order: 1,
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing questions (optional)
  await prisma.question.deleteMany();
  console.log('✓ Cleared existing questions');

  // Create sample questions
  for (const question of sampleQuestions) {
    await prisma.question.create({
      data: question,
    });
    console.log(`✓ Created: ${question.title}`);
  }

  console.log('\n✅ Seed completed successfully!');
  console.log(`📝 Created ${sampleQuestions.length} questions`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

