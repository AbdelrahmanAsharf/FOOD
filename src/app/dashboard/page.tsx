// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

export default async function DashboardPage() {
  const { userId } = await auth(); 

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect('/sign-in');
  }

  if (user.role === 'ADMIN') {
    redirect('/admin');
  }

  redirect('/profile');
}
