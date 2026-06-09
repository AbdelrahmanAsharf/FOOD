import{ db } from '@/lib/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    
    await db.user.update({
      where: { clerkId: userId },
      data: { role },
    });

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[update-role] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
