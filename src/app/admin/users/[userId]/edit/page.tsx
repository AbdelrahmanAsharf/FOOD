// app/admin/users/[userId]/edit/page_.tsx

import { ProfileForm } from '@/app/profile/ProfileForm';
import { getUser, getUsers } from '@/server/db/users';
import { notFound } from 'next/navigation';
import { ProfileFormData } from '@/validations/profile';

export async function generateStaticParams() {
  const users = await getUsers();
  return users.map((user) => ({
    userId: user.id,
  }));
}
interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function EditUserPage({ params }: PageProps) {
  const { userId } =await params;
  const user = await getUser(userId);

  if (!user) return notFound();

  const defaultValues: ProfileFormData = {
    name: user.name || '',
    phone: user.phone || '',
    streetAddress: user.streetAddress || '',
    postalCode: user.postalCode || '',
    city: user.city || '',
    country: user.country || '',
    role: user.role,
  };

  return (
    <main className="max-w-xl mx-auto my-10 p-6 border rounded-lg shadow-lg bg-white">
      {/* هنا غير userId لـ user.clerkId */}
      <ProfileForm defaultValues={defaultValues} userRole="ADMIN" userId={user.clerkId} />
    </main>
  );
}
