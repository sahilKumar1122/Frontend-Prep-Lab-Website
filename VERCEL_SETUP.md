# Vercel Deployment Setup Guide

## ✅ Code Fixes Applied

I've made the following changes to make the app resilient for Vercel deployment:

### 1. **Updated `src/app/questions/[slug]/page.tsx`**
- Wrapped `generateStaticParams` in try-catch
- If database is unavailable during build, returns empty array
- Pages will be generated on-demand instead of at build time
- Added comprehensive error handling with user-friendly error pages

### 2. **Updated `src/lib/prisma.ts`**
- Only attempts database connection if `DATABASE_URL` is set
- Optimized for serverless environments (connection pooling)
- Gracefully handles missing credentials during build

### 3. **Updated `src/app/api/webhooks/clerk/route.ts`**
- Returns error response instead of throwing when secret is missing
- Prevents server crashes during initialization

### 4. **Added Error Handling to All Pages**
- `/questions/page.tsx` - Shows user-friendly error page
- `/dashboard/page.tsx` - Shows user-friendly error page
- `/questions/[slug]/page.tsx` - Shows user-friendly error page

## 🚀 CRITICAL: Environment Variables Required

**⚠️ Your app will NOT work without these environment variables!**

### Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add **ALL** of the following:

| Variable Name | Where to Get It | Required | Environment |
|--------------|-----------------|----------|-------------|
| `DATABASE_URL` | Your database provider (see below) | ✅ YES | Production, Preview, Development |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys | ✅ YES | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys | ✅ YES | Production, Preview, Development |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks | ⚠️ Optional* | Production, Preview, Development |

*Optional but recommended for user sync

## 📊 Database Setup (Choose One)

### Option 1: Vercel Postgres (Recommended - Easiest)
1. Go to Vercel Dashboard → Storage → Create Database → Postgres
2. Connect it to your project
3. Vercel will automatically add `DATABASE_URL`
4. No manual configuration needed!

### Option 2: External PostgreSQL (e.g., Neon, Supabase, Railway)
Your `DATABASE_URL` format:
```
postgresql://username:password@host:port/database?sslmode=require
```

**Important for Vercel:**
- Add connection pooling parameters:
  ```
  postgresql://user:pass@host:5432/db?sslmode=require&connection_limit=1&pool_timeout=20
  ```
- Database must accept connections from `0.0.0.0/0` (or Vercel's IP range)
- Enable SSL/TLS connections

## 🔑 Getting Clerk API Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **API Keys** section
4. Copy:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`

### Setting up Clerk Webhook (Optional):
1. In Clerk Dashboard → **Webhooks**
2. Click **Add Endpoint**
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/clerk`
4. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
5. Copy the **Signing Secret** → `CLERK_WEBHOOK_SECRET`

## 📝 Deployment Steps

### Step 1: Set Environment Variables in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add **ALL** required variables (see table above)
4. **Important:** Select all environments (Production, Preview, Development)

### Step 2: Push Your Code
```bash
git add .
git commit -m "Fix Vercel build errors and add error handling"
git push
```

### Step 3: Wait for Deployment
- Vercel will auto-deploy after push
- Check deployment logs for any errors
- Build should complete successfully

### Step 4: Test Your Deployment
1. Visit your deployed URL
2. If you see "Database Connection Error":
   - ✅ Good! Error handling is working
   - ❌ Need to fix: Add correct `DATABASE_URL`
3. Once DATABASE_URL is set, redeploy (Settings → Deployments → Redeploy)

## 🔧 How It Works Now

### Build Time:
- If database is available → Generates first 50 question pages statically
- If database is NOT available → Skips static generation, no build error

### Runtime:
- All pages work normally
- Pages are generated on first visit
- Cached for 1 hour (configured via `revalidate = 3600`)

## ✨ Benefits

- ✅ Build succeeds even without database access
- ✅ No more repeated deployment failures
- ✅ Pages still cached for performance
- ✅ Dynamic rendering ensures always up-to-date content

## 🆘 Troubleshooting Common Errors

### Error: "PrismaClientInitializationError: Timed out fetching a new connection"
**Cause:** Database is unreachable or connection parameters are wrong

**Solutions:**
1. ✅ **Verify DATABASE_URL is set in Vercel**
   - Go to Settings → Environment Variables
   - Check if `DATABASE_URL` exists
   
2. ✅ **Check DATABASE_URL format:**
   ```
   postgresql://username:password@host:port/database?sslmode=require&connection_limit=1&pool_timeout=20
   ```
   
3. ✅ **Database firewall settings:**
   - Allow connections from `0.0.0.0/0` (all IPs)
   - Or add Vercel's IP addresses to allowlist
   
4. ✅ **Test database connection:**
   - Try connecting from a different tool (e.g., pgAdmin, TablePlus)
   - Verify username/password are correct
   
5. ✅ **Use Vercel Postgres (easiest fix):**
   - Vercel Dashboard → Storage → Create Database
   - Automatically configures everything

### Error: "Please add CLERK_WEBHOOK_SECRET to .env"
**Cause:** Missing Clerk webhook secret environment variable

**Solutions:**
1. ✅ **Add the variable in Vercel:**
   - Settings → Environment Variables
   - Add `CLERK_WEBHOOK_SECRET` with value from Clerk Dashboard
   
2. ✅ **Or skip webhooks (temporary):**
   - The app will work without it
   - User sync won't be automatic but manual login works

### Error: "Application error: a server-side exception has occurred"
**Cause:** Runtime error, usually database connection

**Solutions:**
1. ✅ **Check Vercel Function Logs:**
   - Deployments → Your Deployment → Function Logs
   - Look for specific error messages
   
2. ✅ **Verify all environment variables are set:**
   ```
   DATABASE_URL ✓
   CLERK_SECRET_KEY ✓
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ✓
   ```
   
3. ✅ **Redeploy after adding variables:**
   - Settings → Deployments → Redeploy
   - Environment variables require redeploy to take effect

### Database Connection Checklist:
- [ ] DATABASE_URL is set in Vercel
- [ ] DATABASE_URL includes `?sslmode=require`
- [ ] DATABASE_URL includes `&connection_limit=1&pool_timeout=20`
- [ ] Database allows external connections
- [ ] Database SSL/TLS is enabled
- [ ] You've redeployed after adding variables

### Clerk Setup Checklist:
- [ ] CLERK_SECRET_KEY is set
- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set
- [ ] Both keys are from the same Clerk application
- [ ] Keys are set in all environments (Production, Preview, Development)
- [ ] You've redeployed after adding variables

## 🎯 Ready to Deploy!

Your code is now resilient and ready for Vercel deployment. Just add the environment variables and push your changes!

