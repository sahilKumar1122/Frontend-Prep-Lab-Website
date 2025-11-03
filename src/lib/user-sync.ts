import { prisma } from './prisma';

interface ClerkUser {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
}

/**
 * Sync Clerk user to our database
 * Called from webhooks or after sign-in
 */
export async function syncUserToDatabase(clerkUser: ClerkUser) {
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  
  if (!email) {
    throw new Error('User email not found');
  }

  const name = clerkUser.firstName && clerkUser.lastName
    ? `${clerkUser.firstName} ${clerkUser.lastName}`
    : clerkUser.firstName || clerkUser.lastName || null;

  // Upsert user (create if doesn't exist, update if exists)
  const user = await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    create: {
      id: clerkUser.id,
      clerkId: clerkUser.id,
      email,
      name,
      avatar: clerkUser.imageUrl,
      lastLoginAt: new Date(),
    },
    update: {
      email,
      name,
      avatar: clerkUser.imageUrl,
      lastLoginAt: new Date(),
    },
  });

  // Create UserStats if it doesn't exist
  await prisma.userStats.upsert({
    where: {
      userId: user.id,
    },
    create: {
      userId: user.id,
    },
    update: {},
  });

  return user;
}

/**
 * Get or create user from Clerk ID
 */
export async function getOrCreateUser(clerkUserId: string, email: string, name?: string, avatar?: string) {
  return prisma.user.upsert({
    where: {
      clerkId: clerkUserId,
    },
    create: {
      id: clerkUserId,
      clerkId: clerkUserId,
      email,
      name,
      avatar,
      lastLoginAt: new Date(),
    },
    update: {
      lastLoginAt: new Date(),
    },
  });
}

