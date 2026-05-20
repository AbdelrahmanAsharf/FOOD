
'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormData } from '@/validations/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

interface Props {
  defaultValues: ProfileFormData;
  userRole: 'ADMIN' | 'USER';
  userId: string; 
}

export function ProfileForm({ defaultValues, userRole, userId }: Props) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: ProfileFormData) => {
  setLoading(true);
  try {
    await fetch("/api/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        targetUserId: userId, // هنا userId هو بتاع المستخدم اللي الأدمن بيعدله
      }),
    });
    toast.success("Profile updated");
  } catch {
    toast.error("Failed to update profile");
  } finally {
    setLoading(false);
  }
};



  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* name */}
      <div>
        <Label>Name</Label>
        <Input {...form.register('name')} />
      </div>

      {/* phone */}
      <div>
        <Label>Phone</Label>
        <Input {...form.register('phone')} />
      </div>

      {/* street */}
      <div>
        <Label>Street Address</Label>
        <Input {...form.register('streetAddress')} />
      </div>

      {/* postal */}
      <div>
        <Label>Postal Code</Label>
        <Input {...form.register('postalCode')} />
      </div>

      {/* city */}
      <div>
        <Label>City</Label>
        <Input {...form.register('city')} />
      </div>

      {/* country */}
      <div>
        <Label>Country</Label>
        <Input {...form.register('country')} />
      </div>

      {/* role */}
      <div>
        <Label>Role</Label>
        {userRole === 'ADMIN' ? (
          <select {...form.register('role')} className="border p-2 rounded w-full">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        ) : (
          <Input value={userRole} disabled />
        )}
      </div>

      <Button type="submit" className="w-full mt-4" disabled={loading} >
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}