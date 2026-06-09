import { db } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; 

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req); 

    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 200 });
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || '';
    const name = clerkUser?.firstName || clerkUser?.username || '';
    const image = clerkUser?.imageUrl || '';

    const newUser = await db.user.create({
      data: {
        clerkId: userId,
        email,
        name,
        image,
        role: 'USER',
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}