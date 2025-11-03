'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = '/dashboard';
    }
  }, [isLoaded, isSignedIn]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If already signed in, show redirecting message
  if (isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-[450px]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Sign in to continue your frontend interview preparation
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-xl w-full",
              formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
            },
            layout: {
              socialButtonsVariant: "blockButton",
            }
          }}
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}

