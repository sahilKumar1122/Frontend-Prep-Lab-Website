# Vercel Deployment Setup Guide

## ✅ Code Fixes Applied

I've made the following changes to handle database connection during build:

### 1. **Updated `src/app/questions/[slug]/page.tsx`**
- Wrapped `generateStaticParams` in try-catch
- If database is unavailable during build, returns empty array
- Pages will be generated on-demand instead of at build time

### 2. **Updated `src/lib/prisma.ts`**
- Only attempts database connection if `DATABASE_URL` is set
- Gracefully handles missing credentials during build

## 🚀 Vercel Environment Variables Required

You need to add these environment variables in your Vercel project:

### Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add the following:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview, Development |
| `CLERK_WEBHOOK_SECRET` | Your Clerk webhook secret | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Your Clerk publishable key | Production, Preview, Development |
| `CLERK_SECRET_KEY` | Your Clerk secret key | Production, Preview, Development |

### Database URL Format:
```
postgresql://username:password@host:port/database?sslmode=require
```

**Important:** For Vercel, your database should be publicly accessible or use Vercel's database service.

## 📝 Deployment Steps

1. **Push your changes to Git:**
   ```bash
   git add .
   git commit -m "Fix Vercel build errors and database connection"
   git push
   ```

2. **In Vercel Dashboard:**
   - Add all environment variables (see table above)
   - Trigger a new deployment or wait for auto-deploy

3. **After deployment:**
   - Pages will be generated on-demand the first time they're visited
   - Subsequent visits will be cached (1 hour revalidation)

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

## 🆘 Troubleshooting

### If build still fails:
1. Check all environment variables are set in Vercel
2. Verify DATABASE_URL format is correct
3. Ensure database accepts connections from Vercel's IP ranges
4. Check Vercel build logs for specific errors

### If pages don't load after deployment:
1. Verify DATABASE_URL is accessible from Vercel
2. Check Vercel function logs for runtime errors
3. Ensure database firewall allows Vercel connections

## 🎯 Ready to Deploy!

Your code is now resilient and ready for Vercel deployment. Just add the environment variables and push your changes!

