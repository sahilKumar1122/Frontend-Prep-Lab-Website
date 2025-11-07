# Frontend Prep Lab 🚀

A modern interview preparation platform for frontend developers, featuring comprehensive Angular questions with detailed explanations, code examples, and real-world applications.

## ✨ Features

### 📚 Question Bank
- **114 high-quality Angular interview questions**
- **96/100 average quality score**
- **100% excellent quality rating** (all questions 80+/100)
- Organized by difficulty: Easy (52), Medium (47), Hard (15)
- 4-6 specific, searchable tags per question
- LeetCode-style table layout for easy browsing

### 📖 Question Quality
Each question includes:
- ✅ Concise Quick Summary (2-3 sentences)
- ✅ Comprehensive conceptual explanations
- ✅ Multiple code examples (basic → advanced)
- ✅ Real-world applications and use cases
- ✅ Best practices and common pitfalls
- ✅ Interview tips (for medium/hard questions)
- ✅ Mermaid diagrams for visual learning
- ✅ Related topics for deeper exploration

### 🎯 User Features
- **Progress Tracking**: Track your learning progress
- **Streak System**: Build daily learning habits
- **Study Paths**: Curated learning paths for different skill levels
- **Authentication**: Secure user accounts with Clerk
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Markdown**: React Markdown with syntax highlighting
- **Diagrams**: Mermaid for visual representations

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend-prep-lab-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up database**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:seed` - Seed database with initial data
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio

### Question Management
- `npm run assess:questions` - Assess question quality
- `npm run show:difficulty` - View questions by difficulty
- `npm run reassess:difficulty` - Reassess difficulty and tags

### Question Enhancement (for maintainers)
- `npm run semantic:check` - Check for duplicate questions
- `npm run import:new` - Import new questions
- `npm run enhance:new` - Add summaries to new questions
- `npm run enhance:good` - Enhance 60-79 score questions
- `npm run enhance:remaining` - Final polish on questions

## 📂 Project Structure

```
frontend-prep-lab-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── questions/      # Questions pages
│   │   └── study-paths/    # Study paths pages
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── markdown/      # Markdown renderer
│   │   ├── questions/     # Question components
│   │   └── study-paths/   # Study path components
│   ├── lib/               # Utility libraries
│   └── types/             # TypeScript type definitions
├── prisma/                # Database schema and migrations
├── scripts/               # Utility scripts for question management
└── public/               # Static assets
```

## 📊 Question Categories

### Angular Topics Covered
- **Core Concepts**: Components, Directives, Pipes, Services, Modules
- **Advanced Features**: RxJS, State Management (NgRx), Signals
- **Routing**: Navigation, Guards, Lazy Loading
- **Forms**: Reactive Forms, Template-driven Forms, Validation
- **Performance**: Change Detection, Optimization Techniques
- **Testing**: Unit Tests, Integration Tests, E2E Tests
- **Build & Tooling**: AOT/JIT, CLI, Ivy, Bazel
- **Production**: SSR, Hydration, PWA, Security
- **Migration**: AngularJS Upgrade, Version Differences
- **Internationalization**: i18n, Translation, Localization

## 🎯 Difficulty Levels

- **Easy (52 questions)**: Fundamental concepts and definitions
- **Medium (47 questions)**: Practical implementation and patterns
- **Hard (15 questions)**: Advanced topics and production scenarios

## 📖 Documentation

Additional documentation available in the repository:
- `IMPORTING_QUESTIONS.md` - Guidelines for adding new questions
- `INTERVIEW_ANSWER_TEMPLATE.md` - Template for high-quality answers
- `QUESTION_IMPROVEMENT_GUIDE.md` - Guide for improving questions
- `QUICK_REFERENCE.md` - Quick command reference
- `STREAK_FEATURES.md` - Documentation on streak system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by LeetCode, CP-31, and TakeUForward (TUF)
- Built with modern web technologies
- Community-driven question bank

---

**Made with ❤️ for frontend developers preparing for interviews**
