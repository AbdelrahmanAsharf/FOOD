/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const { signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    try {
      const result = await signUp!.attemptEmailAddressVerification({ code });

      if (result?.status !== 'complete') {
        toast.error('❌ Verification failed');
        return;
      }

      const userId = result.createdUserId;
      const sessionId = result.createdSessionId;

      if (!userId || !sessionId) {
        toast.error('❌ Missing session or user ID');
        return;
      }

      await setActive?.({ session: sessionId });

      const setRoleRes = await fetch('/api/set-role', {
        method: 'POST',
        body: JSON.stringify({ userId, role: 'USER' }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!setRoleRes.ok) throw new Error('❌ Failed to set role');

      toast.success('✅ Email verified successfully!');
      router.push('/profile');
    } catch (err: any) {
      console.error('[verify] error:', err);
      toast.error(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded space-y-4 text-center">
      <div className="flex justify-end">
        <Button variant="link" onClick={() => router.push('/sign-in')}>
          🔐 Sign In
        </Button>
      </div>

      <h2 className="text-xl font-bold text-center">📧 Verify Your Email</h2>
      <p className="text-sm text-gray-600 mb-4">
        Please check your inbox and enter the verification code to continue.
      </p>

      <input
        type="text"
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <Button onClick={handleVerify} disabled={loading} className="w-full">
        {loading ? 'Verifying...' : 'Verify Email'}
      </Button>
    </div>
  );
}
