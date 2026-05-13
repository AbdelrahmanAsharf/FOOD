// app/failed/page.tsx

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function FailedPage() {
  const params = useSearchParams();

  const orderId = params.get('order');

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-red-600">
          ❌ فشل الدفع
        </h1>

        <p className="text-gray-600 mt-4">
          رقم الطلب: {orderId}
        </p>

        <p className="text-gray-500 mt-2">
          حاول مرة أخرى أو استخدم بطاقة مختلفة
        </p>

        <Link
          href="/cart"
          className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl"
        >
          الرجوع للسلة
        </Link>
      </div>
    </div>
  );
}