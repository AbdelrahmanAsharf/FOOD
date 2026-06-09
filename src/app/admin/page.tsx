'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileForm } from '@/app/profile/ProfileForm';
import { ProfileFormData } from '@/validations/profile';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [defaultValues, setDefaultValues] = useState<ProfileFormData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch('/api/get-role');
        const data = await res.json();

        if (data?.role !== 'ADMIN') {
          router.replace('/');
          return;
        }

        setDefaultValues({
          name: data.name || '',
          image: user?.imageUrl || '',
          phone: data.phone || '',
          streetAddress: data.streetAddress || '',
          postalCode: data.postalCode || '',
          city: data.city || '',
          country: data.country || '',
          role: data.role,
        });
      } catch (err) {
        console.error('❌ Failed to fetch admin profile:', err);
        router.replace('/');
      }
    };

    if (isLoaded && user) {
      fetchAdminProfile();
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !defaultValues) {
    return <p className="text-center mt-10">Loading admin data...</p>;
  }

  return (
    <main className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-600">👑 Admin Dashboard</h1>
      <ProfileForm
      defaultValues={defaultValues}
      userRole="ADMIN"
      userId={user?.id || ''}
      />
    </main>
  );
}
