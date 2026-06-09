import { getOrders } from '@/server/db/ordesr';
import React from 'react';
import { format } from 'date-fns';
import { arEG } from 'date-fns/locale';

async function Page() {
  const orders = await getOrders();

  return (
    <main className="max-w-xl mx-auto my-10 p-6 border rounded-lg shadow-lg bg-white" dir="rtl">
      <h1 className="text-xl font-bold mb-6 text-center">جميع الطلبات</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد طلبات حالياً.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-col gap-2 p-4 rounded-md bg-gray-100 shadow-sm">
              
              <div className="text-sm text-gray-800">
                <span className="font-semibold">الاسم:</span> {order.customerName}
              </div>

              <div className="text-sm text-gray-800">
                <span className="font-semibold">التليفون:</span> {order.customerPhone}
              </div>

              <div className="text-sm text-gray-800">
                <span className="font-semibold">نوع التوصيل:</span>{" "}
                {order.deliveryType === "HOME" ? "🚚 توصيل للمنزل" : "🏪 استلام من الفرع"}
              </div>

              {order.deliveryType === "HOME" && (
                <div className="text-sm text-gray-800">
                  <span className="font-semibold">العنوان:</span> {order.streetAddress}
                </div>
              )}

              {order.deliveryType === "PICKUP" && order.branch && (
                <div className="text-sm text-gray-800">
                  <span className="font-semibold">الفرع:</span> {order.branch.name} - {order.branch.city}
                </div>
              )}

              <div className="text-sm text-gray-800">
                <span className="font-semibold">طريقة الدفع:</span>{" "}
                {order.paymentMethod === "VISA" ? "💳 فيزا" : "💵 كاش عند الاستلام"}
              </div>

              <div className="text-sm text-gray-800">
                <span className="font-semibold">الإجمالي:</span> {order.totalPrice} ج.م
              </div>

              <div className="text-sm">
                <span className="font-semibold">الحالة:</span>{" "}
                <span className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "✅ مدفوع" : "⏳ غير مدفوع"}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                <span className="font-semibold">التاريخ:</span>{" "}
                {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm", { locale: arEG })}
              </div>

              {order.products?.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">المنتجات:</span>
                  {order.products.map((item, idx) => (
                    <div key={idx} className="pl-2">
                      - {item.product.name} × {item.quantity}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Page;