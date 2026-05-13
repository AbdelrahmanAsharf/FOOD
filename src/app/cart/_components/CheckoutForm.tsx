'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { deliveryFee, getSubTotal, getTotalAmount } from '@/lib/cart';
import { useCartStore } from '@/store/cart-store';
import PaymentButton from '@/components/PaymentButton';

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
};

function CheckoutForm({ user }: UserProps) {
  const cart = useCartStore((s) => s.items);
  const subTotal = getSubTotal(cart);
  const delivery = deliveryFee;
  const totalAmount = getTotalAmount(cart);

  const billingData = {
    first_name: (user.username?.split(" ")[0] || "عميل").trim(),
    last_name: (user.username?.split(" ").slice(1).join(" ") || "العميل").trim() || "NA",
    email: user.email,
    phone_number: user.phone?.trim() || "+201000000000",
    country: "EG",
    city: user.city?.trim() || "Cairo",
    street: user.streetAddress?.trim() || "NA",
    building: user.streetAddress?.trim() || "NA",
    floor: "1",
    apartment: "1",
    postal_code: user.postalCode?.trim() || "00000",
  };

  if (!user?.id) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        يرجى تسجيل الدخول أولاً لإتمام عملية الدفع.
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return null;
  }

  return (
    <div className='grid gap-6 bg-gray-100 rounded-md p-6'>
      <h2 className='text-2xl text-black font-semibold'>إتمام الطلب (Checkout)</h2>
      <div className='grid gap-4'>
        <div className='grid gap-4'>
          <Input value={user.username} readOnly />
          <Input value={user.email} readOnly />
          <Input value={user.phone} readOnly />
        </div>
        <div className='grid gap-1'>
          <Label>العنوان</Label>
          <Textarea value={user.streetAddress} readOnly className='resize-none' />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label>المدينة</Label>
            <Input value={user.city} readOnly />
          </div>
          <div>
            <Label>الدولة</Label>
            <Input value={user.country} readOnly />
          </div>
        </div>
        <PaymentButton
          amount={totalAmount}
          billingData={billingData}
          userId={user.id}
          subTotal={subTotal}
          deliveryFee={delivery}
        />
      </div>
    </div>
  );
}

export default CheckoutForm;