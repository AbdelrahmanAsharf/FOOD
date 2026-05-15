'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const params = useSearchParams();

  const orderId = params.get('order');

  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const checkOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);

        const data = await res.json();

        setPaid(data.paid);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      checkOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحقق من الدفع...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        {paid ? (
          <>
            <h1 className="text-4xl font-bold text-green-600">
              ✅ تم الدفع بنجاح
            </h1>

            <p className="mt-4 text-gray-600">
              رقم الطلب: {orderId}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-yellow-500">
              ⏳ جاري تأكيد الدفع
            </h1>

            <p className="mt-4 text-gray-600">
              انتظر لحظات...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}