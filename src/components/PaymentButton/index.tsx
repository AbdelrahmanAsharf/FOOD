/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  basePrice?: number;
  price?: number;
  quantity?: number;
}

interface Props {
  amount: number;
  billingData: any;
  userId: string;
  subTotal?: number;
  deliveryFee?: number;
  cartItems?: CartItem[];
  deliveryType?: 'HOME' | 'PICKUP';
  selectedBranchId?: string;
}

export default function PaymentButton({ 
  amount, 
  billingData, 
  userId, 
  subTotal, 
  deliveryFee = 0,
  cartItems = [],
  deliveryType = 'HOME',
  selectedBranchId,   // ← محتفظ بيه بدون _
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
          deliveryFee,
          cartItems,
          deliveryType,
          selectedBranchId,     // ← مستخدم هنا
        }),
      });

      const data = await res.json();

      if (data.success && data.iframe_url) {
        toast.success('جاري تحويلك إلى صفحة الدفع');
        window.location.href = data.iframe_url;
      } else {
        toast.error(data.error || 'حدث خطأ في بدء الدفع');
      }
    } catch (err) {
      console.error(err);
      toast.error('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                 text-white font-bold py-5 px-8 rounded-2xl text-lg transition-all duration-200 
                 disabled:opacity-70 shadow-lg shadow-green-500/30 active:scale-[0.985]"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          جاري التحضير...
        </>
      ) : (
        `ادفع ${amount} جنيه`
      )}
    </button>
  );
}