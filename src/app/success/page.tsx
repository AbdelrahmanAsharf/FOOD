/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

function SuccessContent() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  const paymobOrderId = searchParams.get("order");
  const isSuccess = searchParams.get("success") === "true"; 

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

useEffect(() => {
  if (isSuccess) clearCart();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => {
    if (!paymobOrderId) {
      setLoading(false);
      return;
    }
    if (!isSuccess) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `/api/verify-order?paymobOrderId=${paymobOrderId}`,
        );
        if (res.ok) {
          const data = await res.json();
          console.log("Order data:", data);
          if (data.success && data.order) {
            setOrder(data.order);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error(error);
      }

      if (attempts < 5) {
        setTimeout(() => setAttempts((a) => a + 1), 2000);
      } else {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [paymobOrderId, attempts, isSuccess]);
  if (!isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md w-full">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-red-700 mb-3">فشل الدفع</h1>
          <p className="text-gray-500 mb-2">
            {searchParams.get("data.message") || "حدث خطأ أثناء الدفع"}
          </p>
          <p className="text-sm text-gray-400 mb-8">
            يرجى التحقق من بيانات الكارت والمحاولة مرة أخرى
          </p>
          <button
            onClick={() => (window.location.href = "/cart")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl text-lg"
          >
            العودة للكارت
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">جاري التحقق من الدفع...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md w-full">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-700 mb-3">
            تم الدفع بنجاح
          </h1>
          <p className="text-gray-500 mb-8">سيتم التواصل معك قريباً</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-lg"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-6xl">✅</span>
        </div>

        <h1 className="text-3xl font-bold text-green-700 mb-2">
          تم الدفع بنجاح
        </h1>

        <p className="text-xl text-gray-700 mb-6">
          شكراً لك{" "}
          <span className="font-semibold text-green-600">
            {order.name || "العميل العزيز"}
          </span>
        </p>

        {/* ملخص الطلب */}
        {order.products?.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-right">
            <h2 className="font-bold text-gray-700 mb-3 text-center">
              🍕 ملخص الطلب
            </h2>
            {order.products.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-500 text-sm">× {item.quantity}</span>
                <span className="text-gray-700 font-medium">
                  {item.product?.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* المبلغ */}
        <div className="bg-green-50 border border-green-100 rounded-2xl py-4 mb-4">
          <p className="text-sm text-gray-500">المبلغ المدفوع</p>
          <p className="text-4xl font-bold text-green-700">
            {order.totalPrice?.toFixed(2)}{" "}
            <span className="text-2xl">جنيه</span>
          </p>
        </div>

        {/* رقم الطلب */}
        <div className="text-sm text-gray-400 mb-8">
          رقم الطلب: <span className="font-mono text-gray-600">{order.id}</span>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-lg transition-all"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-green-50">
          <p className="text-xl">جاري التحميل...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
