# Importing Questions Guide

This guide explains how to import questions from your GitHub repository into the database.

## 📋 Overview

Your questions are stored in **two places**:
1. **GitHub Markdown Files** - Source of truth, easy to edit and version control
2. **Database (PostgreSQL)** - What the app reads to display questions

## 🎯 Recommended Workflow

```
GitHub Markdown → Parse → Database → Display in App
```

### Why This Approach?

✅ **Single source of truth**: Edit questions in GitHub markdown  
✅ **Easy collaboration**: Anyone can contribute via GitHub  
✅ **Version control**: Full history of changes  
✅ **Performance**: Database queries are fast  
✅ **Scalability**: Can handle 1000+ questions easily  

❌ **Don't create individual files** for each question  
❌ **Don't duplicate content** in multiple places  

## 🚀 Two Ways to Import

### Option 1: Direct from GitHub (Recommended)

This fetches your markdown files directly from GitHub and imports them:

```bash
cd frontend-prep-lab-app
npm run import:questions
```

**Configure in `scripts/fetch-and-import.ts`:**
```typescript
const FILES_TO_IMPORT = [
  { url: `${GITHUB_RAW_BASE}/frameworks/angular.md`, category: 'angular' },
  { url: `${GITHUB_RAW_BASE}/frameworks/react.md`, category: 'react' },
  // Add more files
];
```

**Pros:**
- No need to download files
- Always gets latest version
- Can run on deployment

### Option 2: From Local Files

If you have markdown files locally:

```bash
cd frontend-prep-lab-app
npm run import:local
```

**Configure in `prisma/import-questions.ts`:**
```typescript
const imports = [
  { path: '../frameworks/angular.md', category: 'angular' },
  { path: '../frameworks/react.md', category: 'react' },
];
```

## 📝 Expected Markdown Format

Your markdown files should follow this structure:

```markdown
## Question Title Here

**Difficulty:** Medium
**Tags:** angular, change-detection, performance

Question content goes here. Explain the concept, provide context, etc.

### Answer

The answer or solution goes here. Include explanations, examples, and code.

\`\`\`typescript
// Code examples
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {}
\`\`\`

## Next Question Title

**Difficulty:** Easy
**Tags:** react, hooks

...
```

### Format Rules

1. **Question Title**: Use `## ` (H2 heading)
2. **Difficulty**: Optional, defaults to "medium"
   - Format: `**Difficulty:** easy|medium|hard`
3. **Tags**: Optional, automatically includes category
   - Format: `**Tags:** tag1, tag2, tag3`
4. **Answer Section**: Use `### Answer` or `## Answer`
5. **Code Blocks**: Use triple backticks with language

## 🔄 What the Script Does

1. **Fetches/Reads** markdown file
2. **Parses** questions by splitting on `## ` headers
3. **Extracts** metadata (difficulty, tags)
4. **Generates** slug from title (e.g., "angular-what-is-change-detection")
5. **Calculates** reading time based on word count
6. **Checks** if question exists (by slug)
7. **Creates or Updates** question in database

## 📊 Question Data Model

Each question in the database has:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Auto-generated unique ID |
| slug | string | URL-friendly identifier |
| title | string | Question title |
| category | string | angular, react, javascript, etc. |
| difficulty | string | easy, medium, hard |
| tags | array | List of tags |
| content | text | Question content (markdown) |
| answer | text | Answer content (markdown) |
| codeExample | text | Code snippets (optional) |
| readingTime | number | Estimated minutes to read |
| order | number | Order within category |

## 🛠️ Customizing the Parser

If your markdown format is different, edit these files:

- **`scripts/fetch-and-import.ts`** - For GitHub imports
- **`prisma/import-questions.ts`** - For local file imports

### Common Customizations

**Change heading level for questions:**
```typescript
// Current: splits on ## (H2)
const sections = markdownContent.split(/^## /gm);

// Change to: splits on ### (H3)
const sections = markdownContent.split(/^### /gm);
```

**Change difficulty format:**
```typescript
// Current: **Difficulty:** Medium
const difficultyMatch = section.match(/\*\*Difficulty:\*\*\s*(easy|medium|hard)/i);

// Custom: [Difficulty: Medium]
const difficultyMatch = section.match(/\[Difficulty:\s*(easy|medium|hard)\]/i);
```

**Change answer section:**
```typescript
// Current: ### Answer or ## Answer
const answerSplit = section.split(/^###?\s*(Answer|Solution)/im);

// Custom: --- Answer ---
const answerSplit = section.split(/^---\s*Answer\s*---/im);
```

## 🔍 Troubleshooting

### No questions imported?

1. Check console output for parsing errors
2. Verify markdown format matches expected structure
3. Check that questions have enough content (>50 characters)
4. Ensure GitHub URL is correct (raw.githubusercontent.com)

### Questions already exist?

The script skips existing questions by default. To update them:

```typescript
// In fetch-and-import.ts, update mode is enabled by default
if (existing) {
  await prisma.question.update({
    where: { slug: question.slug },
    data: { ...question, updatedAt: new Date() },
  });
}
```

### Wrong difficulty/tags?

- Add explicit metadata to markdown files
- Or customize the parser's inference logic

## 📈 Best Practices

### 1. Organize by Category

```
frameworks/
  - angular.md
  - react.md
  - vue.md
languages/
  - javascript.md
  - typescript.md
tools/
  - webpack.md
  - git.md
```

### 2. Use Consistent Formatting

Keep format consistent across all files for reliable parsing.

### 3. Test Import on Small Files First

Before importing 50+ questions:
1. Test with a file containing 2-3 questions
2. Verify they display correctly in the app
3. Then import the rest

### 4. Version Control Database Changes

After importing, you can create a migration:
```bash
npx prisma migrate dev --name add_angular_questions
```

### 5. Regular Syncing

Set up a cron job or GitHub Action to auto-import when markdown files change.

## 🚢 Deployment

For production, you can:

1. **Manual Import**: Run import script before deployment
2. **Build-time Import**: Add to build process
3. **GitHub Actions**: Auto-import on push
4. **Admin Panel**: Build UI for importing

## 📚 Example: Full Workflow

```bash
# 1. Clone your Frontend-Prep-Lab repo
git clone https://github.com/sahilKumar1122/Frontend-Prep-Lab.git

# 2. Go to your app directory
cd Frontend-Prep-Lab/frontend-prep-lab-app

# 3. Update the import script with correct paths
# Edit scripts/fetch-and-import.ts

# 4. Run the import
npm run import:questions

# 5. Check imported questions
npx prisma studio

# 6. Start the app
npm run dev

# 7. Visit http://localhost:3000/questions
```

## 🎓 Next Steps

1. ✅ Configure `scripts/fetch-and-import.ts` with your GitHub URLs
2. ✅ Run `npm run import:questions`
3. ✅ Verify questions in the app
4. ✅ Set up study paths using imported questions
5. ✅ Add more questions to GitHub
6. ✅ Re-run import to sync

---

**Questions?** Check the console output for detailed logs during import.

