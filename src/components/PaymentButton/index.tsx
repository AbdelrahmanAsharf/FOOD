/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  amount: number;
  billingData: any;
  userId: string;
  subTotal?: number;
  deliveryFee?: number;
}

export default function PaymentButton({
  amount,
  billingData,
  userId,
  subTotal,
  deliveryFee,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);

    try {
      router.push('/loading-payment');

      const res = await fetch('/api/pay', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          amount,
          billingData,
          userId,
          subTotal: subTotal || amount,
          deliveryFee: deliveryFee || 0,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.iframe_url) {
        router.push('/failed');

        return;
      }

      window.location.href = data.iframe_url;
    } catch (err) {
      console.log(err);

      router.push('/failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition disabled:opacity-70"
    >
      {loading ? 'جاري التحضير...' : `ادفع ${amount} جنيه`}
    </button>
  );
}