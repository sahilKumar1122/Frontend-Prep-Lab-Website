import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { syncUserToDatabase } from '@/lib/user-sync';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  // Get Clerk webhook secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If no headers, return error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    try {
      await syncUserToDatabase(evt.data);
      console.log(`✅ User ${eventType}:`, evt.data.id);
    } catch (error) {
      console.error(`Error syncing user:`, error);
      return new Response('Error syncing user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await prisma.user.delete({
        where: { clerkId: evt.data.id! },
      });
      console.log(`✅ User deleted:`, evt.data.id);
    } catch (error) {
      console.error(`Error deleting user:`, error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}

