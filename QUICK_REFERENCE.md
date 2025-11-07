# Quick Reference - Question Management

## 🎯 Current Status

- **Total Questions**: 82
- **Quality Score**: 91/100 (Average)
- **Excellent (80+)**: 72 questions (88%)
- **Good (60-79)**: 10 questions (12%)

## 📊 Difficulty Distribution

- **Easy**: 34 questions (41%)
- **Medium**: 35 questions (43%)
- **Hard**: 13 questions (16%)

## 🔧 Most Useful Scripts

### Assessment & Analysis
```bash
npm run assess:questions          # Check quality of all questions
npm run show:difficulty           # Show questions by difficulty level
```

### Adding New Questions
```bash
# Step 1: Check for duplicates
npm run semantic:check           # Smart duplicate detection (checks content, not just titles)

# Step 2: Import only new questions
npm run import:new               # Imports truly new questions from truly-new-questions.json

# Step 3: Enhance with summaries
npm run enhance:new              # Adds Quick Summaries to new questions

# Step 4: Verify quality
npm run assess:questions         # Check final quality scores
```

### Reassigning Difficulty & Tags
```bash
npm run reassess:difficulty      # Dry run (preview changes)
npm run reassess:difficulty -- --preview    # See all changes
npm run reassess:difficulty -- --apply      # Apply changes to database
```

## 📁 Generated Files

- `new-questions-to-add.json` - Raw list after title duplicate check
- `semantic-analysis-results.json` - Detailed coverage analysis
- `truly-new-questions.json` - Final list to import (filtered by semantic check)
- `question-quality-report.json` - Latest quality assessment

## 🎨 Tag Categories

Common tags across questions:
- Core: `angular`, `fundamentals`, `advanced`
- Features: `components`, `directives`, `pipes`, `services`, `modules`
- Patterns: `lifecycle`, `change-detection`, `dependency-injection`, `rxjs`, `observables`
- Development: `forms`, `routing`, `http`, `testing`, `security`
- Build: `compilation`, `ivy`, `aot`, `cli`, `schematics`
- Advanced: `ssr`, `hydration`, `performance`, `optimization`, `animations`

## 💡 Tips

1. **Always use semantic:check** before importing questions - it saved us from adding 237 duplicates!

2. **Quality baseline**: Aim for 70+ score (Good) minimum, 80+ (Excellent) ideal

3. **Tag strategy**: Each question has 4-6 tags for better filtering

4. **Difficulty assignment**: 
   - Easy: "What is..." questions, basic concepts
   - Medium: "How to..." implementation questions
   - Hard: Debugging, optimization, architecture questions

## 🚀 Next Actions

Choose one:

1. **Add Filter UI** - Let users filter by difficulty and tags
2. **Improve the 10 "Good" questions** - Bring them from 70 to 80+ score
3. **Start using the app** - 82 questions at 91/100 is production-ready!
4. **Add more question categories** - React, Vue, etc using same scripts

## 📞 Quick Commands Cheat Sheet

```bash
# See what you have
npm run show:difficulty

# Check quality
npm run assess:questions

# Before adding questions
npm run semantic:check

# After changes
npm run assess:questions

# Database
cd prisma && npx prisma studio    # Visual database browser
```

