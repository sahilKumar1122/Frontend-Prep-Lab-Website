/**
 * Interactive script to improve a question's answer quality
 * Helps restructure existing answers to match interview standards
 */

import { prisma } from '../src/lib/prisma';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

const TEMPLATE = `#### 🎯 Quick Summary

[2-3 sentences: Concise explanation of the concept]

#### 📖 Understanding the Concept

**What is [Concept]?**

[Clear explanation in simple terms, use analogies]

**Why Does It Matter?**

[Business/technical value, problems it solves]

Without it:
- ❌ Problem 1
- ❌ Problem 2

With it:
- ✅ Benefit 1
- ✅ Benefit 2

**How Does It Work Conceptually?**

1. Step 1 - [Brief explanation]
2. Step 2 - [Brief explanation]
3. Step 3 - [Brief explanation]

#### 💡 Key Concepts

**1. [Concept Name]**
- Key point 1
- Key point 2

**2. [Concept Name]**
- Key point 1
- Key point 2

#### 📊 Visual Flow

\`\`\`mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`

#### 💻 Code Examples

**Basic Example**

\`\`\`typescript
// Clear, simple example
// With explanatory comments

export class Example {
  // Implementation
}
\`\`\`

**Real-World Production Example**

\`\`\`typescript
// Production-ready code
// Including error handling and best practices

export class ProductionExample {
  // Your real-world implementation
}
\`\`\`

#### 🏢 Real-World Applications

**Where I've Used This:**
- **Project Name at Company**
  - Problem: [What you were solving]
  - Solution: [How you used this concept]
  - Impact: [Results/metrics]

**Common Use Cases:**
- Use case 1
- Use case 2
- Use case 3

**Industry Applications:**
- Company/Product: How they use it
- Company/Product: How they use it

#### ⚠️ Common Pitfalls & Best Practices

**Common Mistakes:**

❌ **Mistake 1**
- Why it's wrong
- What problems it causes

❌ **Mistake 2**
- Why it's wrong
- What problems it causes

**Best Practices:**

✅ **Practice 1**
- Why it's right
- How to implement

✅ **Practice 2**
- Why it's right
- How to implement

#### 🎯 Interview Tips

**What interviewers look for:**
- Point 1
- Point 2
- Point 3

**How to structure your answer:**
1. Start with quick summary
2. Ask if they want details
3. Provide real-world example
4. Demonstrate practical knowledge

**Follow-up questions to expect:**
- Question 1
- Question 2
- Question 3

#### 📚 Related Topics

- [Related Topic 1] - How it connects
- [Related Topic 2] - How it connects
`;

async function improveQuestion() {
  console.log('🎯 Question Improvement Assistant\n');
  
  // Ask for question ID or slug
  const identifier = await question('Enter question ID or slug: ');
  
  // Find question
  const questionData = await prisma.question.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier }
      ]
    }
  });
  
  if (!questionData) {
    console.log('❌ Question not found');
    rl.close();
    await prisma.$disconnect();
    return;
  }
  
  console.log(`\n📝 Found: ${questionData.title}`);
  console.log(`   Category: ${questionData.category}`);
  console.log(`   Difficulty: ${questionData.difficulty}\n`);
  
  // Analyze current state
  console.log('📊 Current State Analysis:');
  const hasQuickSummary = questionData.answer.includes('Quick Summary');
  const hasDiagram = questionData.answer.includes('```mermaid');
  const hasRealWorld = questionData.answer.includes('Real-World') || questionData.answer.includes('Production');
  const hasBestPractices = questionData.answer.includes('Best Practices');
  const codeBlocks = (questionData.answer.match(/```[\s\S]*?```/g) || []).length;
  
  console.log(`   Quick Summary: ${hasQuickSummary ? '✅' : '❌'}`);
  console.log(`   Mermaid Diagram: ${hasDiagram ? '✅' : '❌'}`);
  console.log(`   Real-World Context: ${hasRealWorld ? '✅' : '❌'}`);
  console.log(`   Best Practices: ${hasBestPractices ? '✅' : '❌'}`);
  console.log(`   Code Examples: ${codeBlocks} blocks`);
  
  console.log('\n───────────────────────────────────────');
  console.log('Current Answer:');
  console.log('───────────────────────────────────────');
  console.log(questionData.answer.substring(0, 500) + '...\n');
  
  // Ask what to do
  console.log('What would you like to do?');
  console.log('1. Show full template');
  console.log('2. Show current full answer');
  console.log('3. Get improvement suggestions');
  console.log('4. Exit');
  
  const choice = await question('\nYour choice (1-4): ');
  
  switch (choice) {
    case '1':
      console.log('\n📋 Full Template:');
      console.log('═══════════════════════════════════════');
      console.log(TEMPLATE);
      console.log('\n💡 Copy this template and customize it for your question');
      break;
      
    case '2':
      console.log('\n📄 Current Full Answer:');
      console.log('═══════════════════════════════════════');
      console.log(questionData.answer);
      break;
      
    case '3':
      console.log('\n💡 Improvement Suggestions:');
      console.log('═══════════════════════════════════════');
      
      if (!hasQuickSummary) {
        console.log('\n1. ADD Quick Summary:');
        console.log('   Start with 2-3 sentences that answer the question concisely');
        console.log('   Example: "Change detection is Angular\'s system for keeping..."');
      }
      
      if (!hasDiagram) {
        console.log('\n2. ADD Visual Diagram:');
        console.log('   Create a mermaid flowchart or sequence diagram');
        console.log('   Shows system thinking and makes concepts clearer');
      }
      
      if (codeBlocks < 2) {
        console.log('\n3. ADD More Code Examples:');
        console.log('   Include at least 2-3 examples:');
        console.log('   - Basic implementation');
        console.log('   - Production-ready example with error handling');
        console.log('   - Advanced pattern (optional)');
      }
      
      if (!hasRealWorld) {
        console.log('\n4. ADD Real-World Applications:');
        console.log('   Share where you\'ve used this in actual projects');
        console.log('   Include problem, solution, and measurable impact');
        console.log('   List common industry use cases');
      }
      
      if (!hasBestPractices) {
        console.log('\n5. ADD Best Practices & Pitfalls:');
        console.log('   List common mistakes with ❌');
        console.log('   List best practices with ✅');
        console.log('   Explain why each matters');
      }
      
      console.log('\n6. ADD Interview Tips:');
      console.log('   What interviewers look for in this answer');
      console.log('   How to structure your response');
      console.log('   Common follow-up questions to expect');
      
      console.log('\n7. Balance Code vs Text:');
      const totalLength = questionData.answer.length;
      const codeLength = (questionData.answer.match(/```[\s\S]*?```/g) || []).join('').length;
      const ratio = Math.round((codeLength / totalLength) * 100);
      console.log(`   Current: ${ratio}% code`);
      console.log(`   Target: 20-40% code, rest explanation`);
      
      break;
      
    case '4':
      console.log('👋 Goodbye!');
      break;
      
    default:
      console.log('Invalid choice');
  }
  
  rl.close();
  await prisma.$disconnect();
}

improveQuestion().catch(console.error);

