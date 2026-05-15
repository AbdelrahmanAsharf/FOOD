'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-100 p-8 rounded-xl text-center">
        <h1 className="text-3xl font-bold text-red-600">
          فشل الدفع ❌
        </h1>

        <p className="mt-4 text-gray-700">
          حاول مرة أخرى
        </p>

        {orderId && (
          <p className="mt-2 text-sm text-gray-500">
            رقم الطلب: {orderId}
          </p>
        )}
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailureContent />
    </Suspense>
  );
}