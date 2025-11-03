# Setup Guide for Frontend Prep Lab

## 🗄️ Database Setup

You need a PostgreSQL database to run this application. Here are your options:

### Option 1: Supabase (Recommended - Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection strings:
   - **Connection Pooling** (for DATABASE_URL with `?pgbouncer=true`)
   - **Direct Connection** (for DIRECT_URL)

### Option 2: Neon (Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### Option 3: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create a database
createdb frontend_prep_lab
```

## 🔐 Authentication Setup

1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your API keys

## ⚙️ Environment Variables

Create a file named `.env.local` in the `frontend-prep-lab-app` directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/database_name?pgbouncer=true"
DIRECT_URL="postgresql://username:password@host:5432/database_name"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 📊 Database Migration

After setting up your database, run:

```bash
cd frontend-prep-lab-app
npx prisma generate
npx prisma db push
```

## 📝 Import Questions

Once the database is set up, import your questions:

```bash
npm run import:local
```

This will import questions from:
- `markdown-files/angular.md` (current configuration)
- Or `../../angular.md` (root directory - commented out)

## 🎯 Seed Study Paths

Optionally, seed some study paths:

```bash
npm run db:seed
```

## 🚀 Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 File Locations

- **Questions**: Import from markdown files
  - Current: `frontend-prep-lab-app/markdown-files/angular.md`
  - Also available: Root `angular.md`
- **Import script**: `prisma/import-questions.ts`
- **Database schema**: `prisma/schema.prisma`

## 🔧 Troubleshooting

### "Environment variable not found"
- Make sure `.env.local` exists and has valid values
- Restart your terminal/IDE after creating the file

### "Can't reach database"
- Check your DATABASE_URL is correct
- Ensure your database is running (for local setup)
- Check firewall settings for cloud databases

### "Questions not importing"
- Check the file path in `prisma/import-questions.ts`
- Verify the markdown file exists
- Look at console output for parsing errors

### "Prisma Client not generated"
```bash
npx prisma generate
```

## 📚 Next Steps

1. ✅ Set up database (Supabase/Neon/Local)
2. ✅ Create `.env.local` with credentials
3. ✅ Run `npx prisma db push`
4. ✅ Run `npm run import:local`
5. ✅ Run `npm run dev`
6. ✅ Visit http://localhost:3000

---

For more details, see `IMPORTING_QUESTIONS.md`

