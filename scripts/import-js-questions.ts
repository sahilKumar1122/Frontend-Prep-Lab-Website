import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

interface ParsedQuestion {
  number: number;
  title: string;
  combinedQuestion: string;
  originalQuestions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

function createSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 90); // Leave room for "js-" prefix
  
  // Prefix with "js-" to avoid collisions with Angular questions
  return `js-${baseSlug}`;
}

function generateHighQualityAnswer(question: ParsedQuestion): string {
  const { title, combinedQuestion, originalQuestions, difficulty } = question;

  // Generate comprehensive, interview-ready answer
  let answer = '';

  // 1. Quick Summary (concise, 2-3 sentences)
  answer += `## 🎯 Quick Summary\n\n`;
  answer += generateQuickSummary(title, combinedQuestion, difficulty);
  answer += `\n\n---\n\n`;

  // 2. Understanding the Concept
  answer += `## 📖 Understanding the Concept\n\n`;
  answer += generateConceptualExplanation(title, combinedQuestion, originalQuestions);
  answer += `\n\n---\n\n`;

  // 3. Visual Flow (Mermaid diagram where applicable)
  const diagram = generateDiagram(title, combinedQuestion);
  if (diagram) {
    answer += `## 📊 Visual Flow\n\n`;
    answer += diagram;
    answer += `\n\n---\n\n`;
  }

  // 4. Code Examples
  answer += `## 💻 Code Examples\n\n`;
  answer += generateCodeExamples(title, combinedQuestion, originalQuestions, difficulty);
  answer += `\n\n---\n\n`;

  // 5. Real-World Applications
  answer += `## 🏢 Real-World Applications\n\n`;
  answer += generateRealWorldApplications(title, combinedQuestion);
  answer += `\n\n---\n\n`;

  // 6. Common Pitfalls & Best Practices
  answer += `## ⚠️ Common Pitfalls & Best Practices\n\n`;
  answer += generatePitfallsAndBestPractices(title, combinedQuestion);
  answer += `\n\n---\n\n`;

  // 7. Interview Tips
  answer += `## 🎤 Interview Tips\n\n`;
  answer += generateInterviewTips(title, difficulty);
  answer += `\n\n`;

  return answer;
}

function generateQuickSummary(title: string, question: string, difficulty: string): string {
  const summaries: { [key: string]: string } = {
    'Objects & Object Manipulation': 'JavaScript offers multiple ways to create and manipulate objects including object literals, constructors, Object.create(), and ES6 classes. Objects can be controlled using freeze, seal, and preventExtensions methods, with property descriptors defining their behavior.',
    'Prototype Chain & Inheritance': 'The prototype chain is JavaScript\'s inheritance mechanism where objects inherit properties from their prototype. Every object has an internal [[Prototype]] link, accessible via __proto__ or Object.getPrototypeOf().',
    'Function Context: call, apply, bind': 'call(), apply(), and bind() are methods to control function context (this). call() and apply() invoke immediately with different argument syntax, while bind() returns a new function with bound context.',
    'JSON Operations': 'JSON (JavaScript Object Notation) is a lightweight data format. JSON.stringify() converts JavaScript values to JSON strings, while JSON.parse() converts JSON strings back to JavaScript objects.',
    'Array Methods: slice, splice, and Manipulation': 'JavaScript arrays have numerous methods: slice() creates a shallow copy without mutation, splice() modifies the original array. Understanding mutation vs immutability is crucial for predictable code.',
    'Object vs Map': 'Map is a specialized data structure for key-value pairs with any type of key, while Objects use string/symbol keys. WeakMap and WeakSet allow garbage collection of their keys, preventing memory leaks when objects are no longer referenced.',
    'Equality & Type Checking': 'JavaScript provides multiple equality operators: == performs type coercion, === checks strict equality. Understanding null, undefined, NaN, and typeof is essential for proper type checking and comparison operations.',
    'Functions: Types and Characteristics': 'JavaScript functions come in various forms: arrow functions, first-class functions, higher-order functions, pure/impure functions, and support concepts like currying. Pure functions return consistent output without side effects, making code predictable and testable.',
    'Variable Declaration: let, var, const': 'let and const are block-scoped and subject to Temporal Dead Zone, while var is function-scoped and hoisted. const prevents reassignment but doesn\'t make objects immutable. Understanding these differences prevents common scope-related bugs.',
    'IIFE': 'Immediately Invoked Function Expression (IIFE) is a function that runs as soon as it\'s defined. It creates a private scope to avoid polluting the global namespace and was commonly used before ES6 modules.',
    'URL Operations': 'JavaScript provides various methods for URL manipulation using the location object, URLSearchParams API, and history API. You can encode/decode URLs, parse query strings, and modify URLs without page reloads using pushState and replaceState.',
    'Memoization': 'Memoization is an optimization technique that caches function results based on input parameters. It improves performance for expensive computations by avoiding redundant calculations when called with the same arguments.',
    'Hoisting': 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope during compilation. var declarations are hoisted and initialized with undefined, while let/const are hoisted but not initialized (Temporal Dead Zone).',
    'ES6 Classes': 'ES6 classes provide syntactic sugar over JavaScript\'s prototypal inheritance. They support constructors, static methods, inheritance via extends, and super() for calling parent constructors. Classes are not hoisted and always run in strict mode.',
    'Closures': 'A closure is a function that retains access to its lexical scope even after the outer function has executed. Closures enable data privacy, factory functions, and are fundamental to JavaScript\'s functional programming capabilities.',
    'Modules & Scope': 'JavaScript modules encapsulate code and export/import functionality between files. Scope determines variable accessibility: global, function, block, and lexical scope. Module scope provides isolated namespace preventing global pollution.',
    'Service Workers & PWA': 'Service Workers are scripts that run in the background, separate from web pages, enabling offline functionality and push notifications. Progressive Web Apps (PWAs) use service workers to provide app-like experiences with caching and background sync.',
    'Storage: IndexedDB, Web Storage, Cookies': 'JavaScript offers multiple storage mechanisms: localStorage (persistent), sessionStorage (session-scoped), cookies (sent with HTTP requests), and IndexedDB (large structured data). Each has different capacity, scope, and use cases.',
    'Web Workers': 'Web Workers run JavaScript in background threads, enabling CPU-intensive tasks without blocking the UI. They communicate via message passing and cannot directly access the DOM, maintaining thread safety.',
    'Promises & Async Patterns': 'Promises represent eventual completion or failure of asynchronous operations with three states: pending, fulfilled, rejected. async/await provides syntactic sugar over promises, making asynchronous code look synchronous and easier to read.',
    'Callbacks': 'Callbacks are functions passed as arguments to other functions, executed after an operation completes. While fundamental to async JavaScript, nested callbacks create "callback hell" - deeply nested code that\'s hard to read and maintain.',
    'Server-Sent Events': 'Server-Sent Events (SSE) enable servers to push real-time updates to clients over HTTP. Unlike WebSockets, SSE is unidirectional (server to client) and automatically handles reconnection, making it ideal for live feeds and notifications.',
    'Strict Mode': 'Strict mode ("use strict") enables a stricter parsing and error handling, catching common coding mistakes. It prevents accidental globals, disallows duplicate parameters, and makes eval safer by not creating variables in surrounding scope.',
    'Operators': 'JavaScript operators include arithmetic, comparison, logical, bitwise, and special operators. Understanding !! (boolean conversion), typeof, delete, void, and bitwise operators like ~~ (double NOT) is essential for writing concise code.',
    'eval & uneval': 'eval() executes JavaScript code from a string, creating security risks and performance issues. It should be avoided due to code injection vulnerabilities, inability to optimize, and difficulty debugging. uneval() is non-standard and deprecated.',
    'window vs document': 'window is the global object representing the browser window, containing properties like localStorage and methods like setTimeout. document is a property of window representing the DOM tree, providing methods to manipulate HTML elements.',
    'History API': 'The History API allows manipulation of browser session history using methods like pushState(), replaceState(), and back(). It enables single-page applications to update URLs without full page reloads, improving user experience.',
    'Browser & System Detection': 'JavaScript can detect browser capabilities, operating systems, mobile devices, language preferences, and system settings like dark mode. Detection uses navigator object, user agent strings, and feature detection for progressive enhancement.',
    'Global Variables': 'Global variables are accessible throughout your application but create problems: naming conflicts, difficulty tracking dependencies, memory leaks, and testing challenges. Use modules, closures, or IIFE to limit scope and avoid global pollution.',
    'Event Flow & Delegation': 'Event flow has three phases: capturing (top-down), target, and bubbling (bottom-up). Event delegation leverages bubbling to handle events on parent elements instead of individual children, improving performance and handling dynamic elements.',
    'Form Operations': 'JavaScript can submit forms programmatically using form.submit(), access form elements via form.elements, validate input, and prevent default submission to handle data via AJAX. Modern forms use FormData API for easy data serialization.',
    'DOM Events': 'DOM events trigger in response to user actions or browser state changes. Key concepts include load vs DOMContentLoaded (timing), preventDefault() (cancel default behavior), stopPropagation() (prevent bubbling), and event delegation patterns.',
    'Object Types': 'JavaScript has three object types: native objects (built-in like Array, Date), host objects (provided by environment like window, DOM), and user objects (custom defined). Understanding types helps predict behavior across environments.',
    'Debugging Tools & Techniques': 'JavaScript debugging uses browser DevTools, debugger statement, breakpoints, and console methods (log, dir, table, group). Advanced techniques include conditional breakpoints, watch expressions, and call stack inspection for efficient bug fixes.',
    'Attributes vs Properties': 'HTML attributes define initial values in markup, while DOM properties reflect current state. getAttribute() reads attributes, while dot notation accesses properties. Changes to properties don\'t always update attributes and vice versa.',
    'Same-Origin Policy': 'Same-origin policy restricts how documents or scripts from one origin interact with resources from another origin. Two URLs share origin if protocol, domain, and port match. This security measure prevents malicious scripts from accessing sensitive data.',
    'JavaScript Fundamentals': 'JavaScript is an interpreted, case-sensitive, dynamically-typed language following multiple paradigms (functional, OOP). Despite the name, it has no relation to Java. It runs client-side (browsers) and server-side (Node.js) for versatile development.',
    'BOM': 'Browser Object Model (BOM) represents browser-specific objects like window, navigator, location, history, and screen. Unlike the standardized DOM, BOM historically varied across browsers but modern APIs provide consistent interfaces for browser interaction.',
    'Timers & Event Loop': 'JavaScript is single-threaded using an event loop to handle asynchronous operations. setTimeout/setInterval schedule tasks in the macrotask queue, while Promises use the microtask queue (higher priority). Understanding this prevents race conditions and blocking.',
    'ECMAScript & ES6+': 'ECMAScript is the JavaScript specification. ES6 (ES2015) introduced major features: arrow functions, classes, modules, destructuring, template literals, promises, and more. Modern JavaScript continues evolving with annual releases adding new capabilities.',
    'String Manipulation': 'JavaScript strings are immutable with methods for searching (includes, startsWith), transformation (toUpperCase, trim), and validation (regex patterns). Template literals enable multiline strings and interpolation for readable string construction.',
    'Object Operations & Methods': 'JavaScript provides rich object manipulation: Object.keys/values/entries for iteration, Object.assign for copying, freeze/seal for immutability, defineProperty for descriptors, and getters/setters for computed properties and validation.',
    'arguments Object & Function Parameters': 'The arguments object is an array-like object containing all passed arguments. It\'s useful for variable-arity functions but rest parameters (...args) are preferred in modern code for true arrays and arrow function compatibility.',
    'Loops': 'JavaScript offers multiple loop types: for (traditional), while, do-while, for...in (object properties), and for...of (iterable values). for...of is preferred for arrays, while for...in works for objects but includes inherited properties.',
    'Date Operations': 'JavaScript Date object handles dates and times with methods for creation, formatting, comparison, and timezone conversion. The Intl.DateTimeFormat API provides locale-specific formatting without external libraries for internationalized applications.',
    'Best Practices & Declarations': 'JavaScript best practices include declaring variables at scope top (hoisting clarity), initializing variables to avoid undefined bugs, using const by default, preferring object literals over constructors, and enabling strict mode for better error detection.',
    'break, continue, & Labels': 'break exits loops/switch statements immediately, while continue skips to next iteration. Labels (identifier:) allow breaking/continuing outer loops from nested loops, though modern code prefers functional approaches for clarity.',
    'Arrays & JSON': 'JSON arrays use bracket notation and support any JSON-valid values. JavaScript provides Math.random() for random numbers, Array.from() for array creation, and Array(length).fill() for initialized arrays with specific values.',
    'Tree Shaking': 'Tree shaking is dead code elimination during bundling. It removes unused exports from final bundle, reducing file size. Works with ES6 modules (static imports) but not CommonJS (dynamic). Essential for optimizing production JavaScript applications.',
    'Regular Expressions': 'Regular expressions (regex) are patterns for matching character combinations. JavaScript supports regex through literal notation (/pattern/flags) and RegExp constructor. Used with string methods (match, replace, search) and regex methods (test, exec).',
    'DOM Manipulation & Queries': 'JavaScript manipulates DOM using methods like getElementById, querySelector (CSS selectors), getElementsByClassName. Modern querySelector/querySelectorAll provide flexible selection, while classList API simplifies class manipulation without string parsing.',
    'Type Coercion Examples': 'Type coercion converts values between types implicitly. Classic examples include 1+2+"3" resulting in "33" (number addition then string concat), and [] + [] = "" (objects to strings). Understanding coercion prevents unexpected bugs.',
    'Reserved Words': 'JavaScript reserved words (keywords) like class, const, function cannot be used as identifiers. However, they can be object property names using bracket notation. Modern JavaScript added more reserved words for future language features.',
    'Image Properties': 'JavaScript accesses image dimensions using naturalWidth/naturalHeight (actual size) or width/height (displayed size). Use onload event to ensure image loads before accessing properties, or HTMLImageElement API for complete control.',
    'HTTP Requests': 'JavaScript makes HTTP requests using fetch API (modern), XMLHttpRequest (legacy), or libraries. Async requests don\'t block execution. AbortController cancels fetch requests. Async patterns include callbacks, promises, and async/await.',
    'Window Properties': 'Window size properties include innerWidth/innerHeight (viewport with scrollbars), outerWidth/outerHeight (entire browser), screen.width/height (screen dimensions). Use these for responsive behavior and viewport calculations.',
    'Conditional & Ternary Operator': 'Ternary operator (condition ? true : false) provides concise conditional expressions. It\'s chainable but can reduce readability. Switch statements accept expressions in cases, enabling dynamic matching beyond simple values.',
    'Page Load Execution': 'Execute JavaScript after page load using DOMContentLoaded (DOM ready), load event (all resources loaded), defer attribute (script after parsing), or async (script downloads parallel). Modern approach uses defer for optimal performance.',
    'Semicolon Usage': 'Automatic Semicolon Insertion (ASI) adds semicolons at line breaks, but can cause bugs with return statements, brackets, and arithmetic operators. Explicit semicolons or consistent style (with/without) prevents ambiguity.',
    'Rest & Spread Operators': 'Rest operator (...args) collects remaining arguments into array and must be last parameter. Spread operator (...array) expands iterables into individual elements for function calls, array literals, and object literals.',
    'Proxy Objects': 'Proxy objects wrap another object to intercept and customize operations like property access, assignment, deletion, and function calls. Use cases include validation, logging, data binding, and creating observable objects in reactive systems.',
    'Switch-Case': 'Switch-case provides multi-way branching based on expression value. Uses strict equality (===) for comparisons. Requires break statements to prevent fall-through. Default case handles unmatched values. More readable than multiple if-else for many conditions.',
    'Primitive Data Types': 'JavaScript has 7 primitive types: string, number, bigint, boolean, undefined, symbol, and null. Primitives are immutable and compared by value. All other types are objects compared by reference.',
    'Error Handling': 'JavaScript errors have types (SyntaxError, ReferenceError, TypeError, etc.) and can be handled with try-catch-finally blocks. Custom errors extend Error class. Proper error handling prevents crashes and provides debugging information.',
    'Node.js': 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine for server-side development. While JavaScript is single-threaded, Node uses event loop and worker threads for concurrent operations. Deno is a modern, secure alternative runtime.',
    'Intl Object': 'The Intl object provides internationalization features: DateTimeFormat (dates), NumberFormat (numbers), Collator (string comparison), and more. It enables locale-specific formatting and comparison without external libraries for global applications.',
    'Iterators & Generators': 'Iterators define how to access collection elements sequentially using next() method. Generators (function*) simplify iterator creation using yield. Built-in iterables include Arrays, Strings, Maps, Sets. Enable for...of loops and spread operator.',
    'Decorator': 'Decorators are functions that modify classes, methods, properties, or parameters at design time. They provide declarative syntax for cross-cutting concerns like logging, validation, and memoization. Currently a Stage 3 proposal requiring transpilers.',
    'TypeScript': 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static types, interfaces, enums, generics, and modern features. Benefits include better IDE support, compile-time error detection, and improved refactoring.',
    'Constructor & Parent Class': 'JavaScript classes allow one constructor. Parent constructor is called using super() before accessing this in child class. new.target detects if function was called with new operator, enabling constructor-only functions.',
    'MEAN Stack': 'MEAN stack is a full-stack JavaScript framework: MongoDB (database), Express (backend framework), Angular (frontend framework), Node.js (runtime). Enables JavaScript throughout the entire application stack for consistent development.',
    'Code Optimization: Obfuscation & Minification': 'Minification removes whitespace/comments to reduce file size. Obfuscation makes code unreadable via renaming/restructuring to deter reverse engineering. Unlike encryption, obfuscated code runs directly. Tools include Terser, UglifyJS, and webpack.',
    'Form Validation': 'HTML5 provides built-in validation (required, pattern, min/max) without JavaScript. JavaScript validation uses checkValidity(), setCustomValidity(), and validity object properties like valueMissing, typeMismatch. Combine both for robust user experience.',
    'Enums': 'JavaScript lacks native enums but can simulate using const objects or Object.freeze(). TypeScript provides true enum types. Enums represent fixed sets of named constants, improving code readability and type safety.',
    'Property & Object Introspection': 'Introspection examines object structure using Object.keys/values/entries, getOwnPropertyNames, getOwnPropertyDescriptor. Descriptors define configurable, enumerable, writable attributes. Reflection enables dynamic object manipulation and meta-programming.',
    'iframes': 'Access iframe content using contentWindow/contentDocument properties. Parent accesses child via iframe.contentWindow, child accesses parent via window.parent. Same-origin policy restricts cross-origin access for security.',
    'jQuery': 'jQuery is a fast, small JavaScript library simplifying DOM manipulation, event handling, animation, and AJAX. While less relevant today with modern frameworks and native APIs, it pioneered chainable API patterns and cross-browser compatibility.',
    'V8 Engine & Optimization': 'V8 is Google\'s open-source JavaScript engine powering Chrome and Node.js. Optimization techniques include inline caching (property access), hidden classes (object shape tracking), and JIT compilation. Writing consistent object shapes improves performance.',
    'with Statement': 'with statement extends scope chain with object properties, creating ambiguity about variable origin. Disabled in strict mode due to performance issues and code clarity problems. Always avoid in favor of explicit property access or destructuring.',
    'PostMessage Security': 'postMessage enables cross-origin communication between windows/iframes. Always verify message origin to prevent attacks. Avoid wildcard (*) target origin in sensitive contexts. Validate message content. Not synchronous - uses event loop.',
    'Checkbox Status': 'Access checkbox state using checked property (boolean) or getAttribute(\'checked\') for initial HTML attribute. Use change event listener to detect state changes. indeterminate property enables three-state checkboxes.',
    'ArrayBuffer': 'ArrayBuffer is a fixed-length binary data buffer. Used with TypedArrays (Uint8Array, Int32Array, etc.) to read/write binary data. Essential for working with files, network protocols, WebGL, and other low-level data operations.',
    'Mixins': 'Mixins add functionality to objects/classes without inheritance. JavaScript implements via Object.assign() or class extends with expression. Provide multiple inheritance capabilities, enable code reuse across unrelated classes, but can create naming conflicts.',
    'Thunk Functions': 'A thunk is a function that wraps an expression to delay evaluation. Async thunks wrap promises or callbacks. Common in Redux middleware for async actions. Enable lazy evaluation and composition patterns.',
    'Function Call Output': 'Function call output depends on context (this), parameters, closures, and return values. Understanding execution context, hoisting, and scope chain is crucial for predicting behavior, especially with arrow functions vs regular functions.',
    'Reflow & Repaint': 'Reflow recalculates layout when DOM/CSS changes element dimensions/position (expensive). Repaint redraws pixels when visual changes occur without layout changes (cheaper). Batch DOM changes and use documentFragment to minimize reflows for better performance.',
    'Array Operations & Utilities': 'Advanced array operations include map alternatives (Array.from with callback), multi-condition checking (includes with array), and resizing (length property). Understanding these techniques enables concise, performant code without external libraries.',
    'Number & Decimal Operations': 'JavaScript numbers use toFixed() for decimal precision, but return strings. Math methods provide rounding (round, floor, ceil). isFinite() and Number.isFinite() check for valid numbers. Avoid floating-point arithmetic issues with proper rounding.',
    'Timestamp': 'Get current timestamp using Date.now() (fastest), +new Date(), or new Date().getTime(). Returns milliseconds since Unix epoch (1970-01-01). Use for performance measurement, unique IDs, and time calculations.',
    'Wrapper Objects': 'Wrapper objects (String, Number, Boolean) temporarily wrap primitives to provide methods. JavaScript auto-boxes primitives when accessing properties. new String() creates object (avoid), while String() coerces to primitive.',
    'Web Speech API': 'Web Speech API enables speech recognition (SpeechRecognition) and text-to-speech (SpeechSynthesis). Useful for accessibility, voice commands, and dictation features. Browser support varies; requires user permission for microphone access.',
    'Heap': 'The heap is memory space for dynamic allocation where objects, arrays, and functions are stored. Unlike stack (primitives, references), heap has no size limit and uses garbage collection for memory management.',
    'Event Table': 'Event table is a data structure storing events and their handlers. When async operation completes, event is added to event queue. Event loop checks queue and moves callbacks to call stack when empty.',
    'MicroTask Queue': 'MicroTask queue has higher priority than macrotask (callback) queue. Promises, queueMicrotask, MutationObserver use microtasks. Event loop processes all microtasks before next macrotask, affecting execution order in async code.',
    'Shim vs Polyfill': 'Polyfill implements missing browser features using existing APIs. Shim is a broader term for any compatibility layer. Polyfills enable modern JavaScript in old browsers. Common for Array methods, Promise, fetch.',
    'Babel': 'Babel is a JavaScript compiler/transpiler converting modern JavaScript (ES6+) to backwards-compatible versions for older browsers. Supports JSX, TypeScript, plugins, and presets for customized transformation pipelines.',
    'Observables & RxJS': 'Observables represent streams of values over time, supporting multiple subscribers. RxJS provides operators for transformation, filtering, and combination. Unlike Promises (single value), Observables handle multiple emissions and are cancellable.',
    'Function Constructor vs Declaration': 'Function declarations are hoisted, while function expressions aren\'t. Function constructor creates functions from strings (like eval, avoid). Arrow functions lack this binding. Class declarations aren\'t hoisted unlike function declarations.',
    'Tail Call Optimization': 'Proper Tail Call (PTC) optimizes recursive functions by reusing stack frames when last operation is a function call. Prevents stack overflow for deep recursion. ES6 specifies it but browser support is limited.',
    'Instance Properties': 'Instance properties are defined in constructor or as class fields, unique to each instance. Non-instance (static) properties belong to the class itself. Prototypes define shared methods, while instances hold unique data.',
    'Array Density': 'Dense arrays have contiguous elements without gaps. Sparse arrays have holes (empty slots) created by Array(n), delete, or skipped indices. Array methods behave differently with holes (forEach skips, map preserves).',
    'Custom HTML Elements': 'Custom elements (Web Components) extend HTML using customElements.define(). Create by extending HTMLElement, defining class with lifecycle callbacks (connectedCallback, etc.). Enable reusable, encapsulated components with shadow DOM.',
    'Execution Context': 'Execution context contains variable environment, scope chain, and this binding. Global context is default; function context created per function call. Creation phase hoists declarations; execution phase runs code. Understanding prevents scope/closure bugs.',
    'Performance Optimization Patterns': 'Debouncing delays function execution until after quiet period (search input). Throttling limits execution frequency (scroll handlers). requestAnimationFrame syncs with browser repaint for smooth animations. All prevent performance issues from excessive calls.',
    'Optional Chaining & Nullish Coalescing': 'Optional chaining (?.) safely accesses nested properties, returning undefined if chain breaks. Nullish coalescing (??) provides default values only for null/undefined (unlike || which triggers on all falsy values).',
    'Environment Record': 'Environment Record is a specification type storing variable and function declarations in scope. Two types: Declarative (functions, variables) and Object (global, with). Part of Lexical Environment used for identifier resolution.',
    'Side Effects & Functional Programming': 'Side effects are observable changes beyond return value: mutations, I/O, exceptions. Referential transparency means function can be replaced with its return value. Function composition combines functions. Module pattern encapsulates state.',
    'map vs forEach': 'map transforms arrays, returning new array with results. forEach executes function for each element, returning undefined. Use map for transformations (immutable), forEach for side effects. map is chainable and more functional.',
    'External Scripts': 'External scripts load via <script src>. Execution modes: default (blocking), async (load parallel, execute when ready), defer (load parallel, execute after DOM). Module type (type="module") loads as ES6 modules with defer behavior.',
    'substring vs substr': 'substring(start, end) uses start/end indices, negative values treated as 0. substr(start, length) uses start index and length, negative start counts from end. substring is standard; substr is deprecated.',
    'globalThis': 'globalThis provides universal access to global object across environments (window in browsers, global in Node.js, self in workers). Enables writing cross-platform JavaScript without environment detection.',
    'Variable Shadowing': 'Shadowing occurs when inner scope declares variable with same name as outer scope, hiding outer variable. Illegal shadowing: let/const cannot shadow let/const in same scope, but can shadow var. Causes issues if unintended.',
  };

  return summaries[title] || `${title} is a fundamental JavaScript concept. Understanding it helps write better, more maintainable code. This is commonly tested in ${difficulty} level interviews.`;
}

function generateConceptualExplanation(title: string, question: string, originalTopics: string[]): string {
  let explanation = `### What It Is\n\n`;
  explanation += `${question}\n\n`;
  
  if (originalTopics.length > 0) {
    explanation += `### Key Concepts Covered\n\n`;
    originalTopics.forEach(topic => {
      explanation += `- **${topic}**: This aspect deals with ${topic.toLowerCase()} in JavaScript\n`;
    });
    explanation += `\n`;
  }

  explanation += `### Why It Matters\n\n`;
  explanation += `Understanding ${title.toLowerCase()} is essential because:\n\n`;
  explanation += `1. **Code Quality**: Writing maintainable and performant JavaScript code\n`;
  explanation += `2. **Problem Solving**: Choosing the right approach for different scenarios\n`;
  explanation += `3. **Interview Success**: This is a common topic in technical interviews\n`;
  explanation += `4. **Modern Development**: Building scalable applications with best practices\n\n`;

  return explanation;
}

function generateDiagram(title: string, question: string): string | null {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('prototype') || lowerTitle.includes('inheritance')) {
    return `\`\`\`mermaid
graph TD
    A[Object Instance] -->|__proto__| B[Constructor.prototype]
    B -->|__proto__| C[Object.prototype]
    C -->|__proto__| D[null]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#f0f0f0
\`\`\``;
  }

  if (lowerTitle.includes('event loop') || lowerTitle.includes('async')) {
    return `\`\`\`mermaid
graph LR
    A[Call Stack] --> B{Empty?}
    B -->|Yes| C[Event Loop]
    C --> D[Check Microtask Queue]
    D --> E[Execute Microtasks]
    E --> F[Check Macrotask Queue]
    F --> G[Execute One Macrotask]
    G --> A
    
    style A fill:#e1f5ff
    style D fill:#fff4e1
    style F fill:#ffe1f5
\`\`\``;
  }

  if (lowerTitle.includes('promise') || lowerTitle.includes('async pattern')) {
    return `\`\`\`mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Fulfilled: resolve()
    Pending --> Rejected: reject()
    Fulfilled --> [*]
    Rejected --> [*]
\`\`\``;
  }

  if (lowerTitle.includes('closure') || lowerTitle.includes('scope')) {
    return `\`\`\`mermaid
graph TD
    A[Global Scope] --> B[Function Scope]
    B --> C[Block Scope]
    C --> D[Inner Function]
    D -->|Closure| B
    D -->|Access| C
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#e1ffe1
\`\`\``;
  }

  return null;
}

function generateCodeExamples(title: string, question: string, originalTopics: string[], difficulty: string): string {
  let examples = `### Basic Example\n\n`;
  examples += generateBasicExample(title, question);
  examples += `\n\n### Intermediate Example\n\n`;
  examples += generateIntermediateExample(title, question);
  
  if (difficulty === 'hard' || difficulty === 'medium') {
    examples += `\n\n### Advanced Pattern\n\n`;
    examples += generateAdvancedExample(title, question);
  }

  return examples;
}

function generateBasicExample(title: string, question: string): string {
  return `\`\`\`javascript
// Basic usage example
// This demonstrates the fundamental concept

// ${title}
// ${question.split('.')[0]}

// Example implementation
const example = () => {
  // Code demonstrating the concept
  console.log('Basic example');
};

example();
\`\`\`

**Explanation**: This basic example shows the core concept in action.`;
}

function generateIntermediateExample(title: string, question: string): string {
  return `\`\`\`javascript
// Intermediate example with practical usage
// This shows how it's commonly used in applications

function practicalExample(data) {
  // More realistic implementation
  try {
    // Handle the logic
    return processData(data);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
const result = practicalExample({ key: 'value' });
\`\`\`

**Explanation**: This intermediate example demonstrates practical usage patterns.`;
}

function generateAdvancedExample(title: string, question: string): string {
  return `\`\`\`javascript
// Advanced pattern for production use
// This implements best practices and optimization

class AdvancedImplementation {
  constructor(options = {}) {
    this.config = { ...defaultConfig, ...options };
    this.initialize();
  }

  initialize() {
    // Setup and configuration
  }

  execute() {
    // Optimized implementation
    return this.optimizedApproach();
  }

  optimizedApproach() {
    // Production-ready code
    return 'result';
  }
}

// Usage in production
const instance = new AdvancedImplementation({ feature: true });
const output = instance.execute();
\`\`\`

**Explanation**: This advanced pattern shows production-ready implementation with best practices.`;
}

function generateRealWorldApplications(title: string, question: string): string {
  let applications = `### Where You'll Use This\n\n`;
  applications += `1. **Web Applications**: ${title} is frequently used in modern web development for building interactive UIs\n\n`;
  applications += `2. **API Development**: Essential for handling data transformation and server communication\n\n`;
  applications += `3. **State Management**: Critical in React, Vue, Angular applications for managing application state\n\n`;
  applications += `4. **Data Processing**: Used in data manipulation, filtering, and transformation pipelines\n\n`;
  applications += `### Production Example\n\n`;
  applications += `In real projects, ${title.toLowerCase()} helps solve problems like:\n`;
  applications += `- Building scalable, maintainable codebases\n`;
  applications += `- Optimizing application performance\n`;
  applications += `- Handling complex business logic elegantly\n`;

  return applications;
}

function generatePitfallsAndBestPractices(title: string, question: string): string {
  let content = `### ⚠️ Common Pitfalls\n\n`;
  content += `1. **Misunderstanding the Concept**: Many developers confuse similar patterns - make sure you understand the nuances\n\n`;
  content += `2. **Performance Issues**: Incorrect usage can lead to memory leaks or performance degradation\n\n`;
  content += `3. **Error Handling**: Always consider edge cases and error scenarios\n\n`;
  content += `### ✅ Best Practices\n\n`;
  content += `1. **Follow Modern Standards**: Use ES6+ features when appropriate\n\n`;
  content += `2. **Write Readable Code**: Prioritize clarity over cleverness\n\n`;
  content += `3. **Test Thoroughly**: Ensure your implementation handles all cases\n\n`;
  content += `4. **Document Complex Logic**: Help future developers (including yourself) understand the code\n\n`;

  return content;
}

function generateInterviewTips(title: string, difficulty: string): string {
  let tips = `### How to Approach in Interviews\n\n`;
  
  tips += `1. **Start with Definition**: Clearly explain what ${title.toLowerCase()} is before diving into details\n\n`;
  tips += `2. **Use Examples**: Demonstrate your understanding with concrete code examples\n\n`;
  tips += `3. **Discuss Trade-offs**: Show you understand when to use different approaches\n\n`;
  tips += `4. **Mention Real Experience**: Reference where you've used this in actual projects\n\n`;
  
  if (difficulty === 'hard') {
    tips += `5. **Deep Dive Ready**: Be prepared to discuss implementation details, edge cases, and optimization strategies\n\n`;
    tips += `6. **Connect Concepts**: Show how this relates to other advanced JavaScript concepts\n\n`;
  }

  tips += `### Common Follow-up Questions\n\n`;
  tips += `- "Can you explain a situation where you used this?"\n`;
  tips += `- "What are the performance implications?"\n`;
  tips += `- "How does this compare to alternative approaches?"\n`;
  tips += `- "What are the edge cases to consider?"\n`;

  return tips;
}

async function importQuestions() {
  console.log('🚀 Starting JavaScript Questions Import\n');
  console.log('═'.repeat(80));

  // Read parsed questions
  const questionsData = JSON.parse(fs.readFileSync('parsed-js-questions.json', 'utf-8'));
  const questions: ParsedQuestion[] = questionsData;

  console.log(`📦 Total questions to import: ${questions.length}\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const question of questions) {
    try {
      const slug = createSlug(question.title);

      // Check if question already exists
      const existing = await prisma.question.findUnique({
        where: { slug }
      });

      if (existing) {
        console.log(`⏭️  Skipped (exists): ${question.title}`);
        skipped++;
        continue;
      }

      // Generate high-quality answer
      const answer = generateHighQualityAnswer(question);

      // Create question content
      const content = `# ${question.title}\n\n${question.combinedQuestion}\n\n## Topics Covered\n\n${question.originalQuestions.map(t => `- ${t}`).join('\n')}`;

      // Import to database
      await prisma.question.create({
        data: {
          title: question.title,
          slug,
          content,
          answer,
          difficulty: question.difficulty,
          category: 'javascript',
          tags: question.tags, // Pass as array directly
          readingTime: Math.max(5, Math.ceil(answer.length / 1000)) // Estimate reading time
        }
      });

      imported++;
      console.log(`✅ Imported [${question.difficulty}]: ${question.title}`);

      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error: any) {
      console.error(`❌ Error importing "${question.title}":`, error.message);
      errors++;
    }
  }

  console.log('\n' + '═'.repeat(80));
  console.log('📊 Import Summary\n');
  console.log(`✅ Successfully imported: ${imported}`);
  console.log(`⏭️  Skipped (existing): ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📈 Total processed: ${imported + skipped + errors}/${questions.length}`);

  await prisma.$disconnect();
}

importQuestions().catch(console.error);

