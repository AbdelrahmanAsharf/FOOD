
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existing = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existing) {
      await db.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.username || user.firstName || 'User',
          image: user.imageUrl,
          role: 'USER',
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error setting role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
