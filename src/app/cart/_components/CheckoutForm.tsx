"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deliveryFee, getSubTotal, getTotalAmount } from "@/lib/cart";
import { useCartStore } from "@/store/cart-store";
import PaymentButton from "@/components/PaymentButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Branch = { id: string; name: string };

type UserProps = {
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    country: string;
  };
  branches: Branch[];
};

function CheckoutForm({ user, branches }: UserProps) {
  const cart = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const subTotal = getSubTotal(cart);
  const delivery = deliveryFee;
  const totalAmount = getTotalAmount(cart);

  const [deliveryType, setDeliveryType] = useState<"HOME" | "PICKUP">("HOME");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "CASH">("CARD");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [customerName, setCustomerName] = useState(user.username || "");
  const [customerPhone, setCustomerPhone] = useState(user.phone || "");
  const [streetAddress, setStreetAddress] = useState(user.streetAddress || "");
  const [city, setCity] = useState(user.city || "");

  const [cashLoading, setCashLoading] = useState(false);

  const finalAmount = deliveryType === "HOME" ? totalAmount : subTotal;
  const finalDeliveryFee = deliveryType === "HOME" ? delivery : 0;

  const billingData = {
    first_name: customerName,
    last_name: ".",
    email: user.email,
    phone_number: customerPhone || "+201000000000",
    country: "EG",
    city: city,
    street: streetAddress || "NA",
    building: "NA",
    floor: "1",
    apartment: "1",
    postal_code: "12345",
  };

  const handleCashOrder = async () => {
    if (!customerName.trim()) {
      toast.error("من فضلك أدخل اسمك");
      return;
    }
    if (!customerPhone.trim()) {
      toast.error("من فضلك أدخل رقم التليفون");
      return;
    }
    if (!city.trim()) {
      // ✅ أضف
      toast.error("من فضلك أدخل المدينة");
      return;
    }
    if (deliveryType === "HOME" && !streetAddress.trim()) {
      toast.error("من فضلك أدخل العنوان");
      return;
    }
    if (deliveryType === "PICKUP" && !selectedBranchId) {
      toast.error("من فضلك اختر الفرع");
      return;
    }

    setCashLoading(true);
    try {
      const res = await fetch("/api/cash-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          subTotal,
          deliveryFee: finalDeliveryFee,
          totalPrice: finalAmount,
          cartItems: cart,
          deliveryType,
          selectedBranchId: selectedBranchId || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        toast.success("تم تسجيل طلبك بنجاح!");
        router.refresh(); // ✅ يحدث الصفحة

        router.push("/cash-success");
      } else {
        toast.error("حدث خطأ، حاول مرة أخرى");
      }
    } catch {
      toast.error("فشل الاتصال بالخادم");
    } finally {
      setCashLoading(false);
    }
  };

  if (!cart || cart.length === 0) return null;

  return (
    <div className="space-y-8 bg-white rounded-3xl shadow-sm border p-8">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        إتمام الطلب
      </h2>

      <div className="space-y-5">
        <div>
          <Label className="text-gray-700">الاسم</Label>
          <Input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="اسمك"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-gray-700">رقم التليفون</Label>
          <Input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="01xxxxxxxxx"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-gray-700">المدينة</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="القاهرة، الإسكندرية..."
            className="mt-1.5"
          />
        </div>
        {deliveryType === "HOME" && (
          <div>
            <Label className="text-gray-700">العنوان بالتفصيل</Label>
            <Textarea
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="أدخل العنوان الكامل"
              className="mt-1.5 resize-none h-20"
            />
          </div>
        )}
      </div>

      {/* نوع التوصيل */}
      <div>
        <Label className="text-gray-700 block mb-3">نوع التوصيل</Label>
        <div className="grid grid-cols-2 gap-3">
          {(["HOME", "PICKUP"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setDeliveryType(type)}
              className={`py-4 rounded-2xl border-2 font-medium transition-all ${
                deliveryType === type
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {type === "HOME" ? "🚚 توصيل للمنزل" : "🏪 استلام من الفرع"}
            </button>
          ))}
        </div>
      </div>

      {/* اختيار الفرع */}
      {deliveryType === "PICKUP" && (
        <div>
          <Label className="text-gray-700">اختر الفرع</Label>
          <Select onValueChange={setSelectedBranchId} value={selectedBranchId}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="اختر أقرب فرع" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* طريقة الدفع */}
      <div>
        <Label className="text-gray-700 block mb-3">طريقة الدفع</Label>
        <div className="grid grid-cols-2 gap-3">
          {(["CARD", "CASH"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`py-4 rounded-2xl border-2 font-medium transition-all ${
                paymentMethod === method
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {method === "CARD" ? "💳 فيزا / بطاقة" : "💵 كاش عند الاستلام"}
            </button>
          ))}
        </div>
      </div>

      {/* ملخص المبلغ */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>المجموع</span>
          <span>{subTotal} جنيه</span>
        </div>
        {deliveryType === "HOME" && (
          <div className="flex justify-between text-gray-600">
            <span>رسوم التوصيل</span>
            <span>{delivery} جنيه</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>الإجمالي</span>
          <span>{finalAmount} جنيه</span>
        </div>
      </div>

      {/* زر الدفع */}
      {paymentMethod === "CARD" ? (
        <PaymentButton
          amount={finalAmount}
          billingData={billingData}
          userId={user.id}
          subTotal={subTotal}
          deliveryFee={finalDeliveryFee}
          cartItems={cart}
          deliveryType={deliveryType}
          selectedBranchId={selectedBranchId}
        />
      ) : (
        <button
          onClick={handleCashOrder}
          disabled={cashLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-5 px-8 rounded-2xl text-lg transition-all disabled:opacity-70 shadow-lg"
        >
          {cashLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري تسجيل الطلب...
            </span>
          ) : (
            `✅ تأكيد الطلب - ${finalAmount} جنيه`
          )}
        </button>
      )}
    </div>
  );
}

export default CheckoutForm;
