/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  basePrice?: number;
  price?: number;
  quantity?: number;     // خليها optional
}

interface Props {
  amount: number;
  billingData: any;
  userId: string;
  subTotal?: number;
  deliveryFee?: number;
  cartItems?: CartItem[];        
}

export default function PaymentButton({ 
  amount, 
  billingData, 
  userId, 
  subTotal, 
  deliveryFee,
  cartItems = [] 
}: Props) {

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          billingData, 
          userId,
          subTotal: subTotal || amount,
          deliveryFee: deliveryFee || 0,
          cartItems   
        }),
      });

      const data = await res.json();

      if (data.success && data.iframe_url) {
        window.location.href = data.iframe_url;
      } else {
        alert('حدث خطأ: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('فشل في بدء عملية الدفع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition disabled:opacity-70 w-full"
    >
      {loading ? 'جاري التحضير...' : `ادفع ${amount} جنيه`}
    </button>
  );
}