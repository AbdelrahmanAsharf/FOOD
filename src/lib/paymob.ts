/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { db } from "./prisma"; // أو prisma من @prisma/client
import { BillingData } from "@/types/paymob";

const BASE_URL = "https://accept.paymob.com/api";

const config = {
  apiKey: process.env.PAYMOB_API_KEY!,
  integrationId: process.env.PAYMOB_INTEGRATION_ID!,
  hmacSecret: process.env.PAYMOB_HMAC_SECRET!,
};

export class PaymobService {
  private static async authenticate(): Promise<string> {
    const { data } = await axios.post(`${BASE_URL}/auth/tokens`, {
      api_key: config.apiKey,
    });
    return data.token;
  }

  private static async createOrder(authToken: string, amountCents: number) {
    const { data } = await axios.post(`${BASE_URL}/ecommerce/orders`, {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      items: [],
    });
    return data;
  }

  private static async getPaymentKey(
    authToken: string,
    orderId: number,
    amountCents: number,
    billingData: BillingData,
  ) {
    const { data } = await axios.post(`${BASE_URL}/acceptance/payment_keys`, {
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      currency: "EGP",
      integration_id: Number(config.integrationId),

      billing_data: billingData,

      lock_order_when_paid: true,
    });

    return data.token;
  }

  // ======================= الدالة المصححة =======================
  static async initiatePayment(
    amount: number,
    billingData: BillingData,
    userId: string,
    subTotal: number,
    deliveryFee: number,
  ) {
    try {
      const authToken = await this.authenticate();
      const paymobOrder = await this.createOrder(authToken, amount * 100);

      const paymentKey = await this.getPaymentKey(
        authToken,
        paymobOrder.id,
        amount * 100,
        billingData,
      );

      // حفظ الطلب في قاعدة البيانات
      const dbOrder = await db.order.create({
        data: {
          userId,
          userEmail: billingData.email,
          name: `${billingData.first_name} ${billingData.last_name}`,
          phone: billingData.phone_number,
          streetAddress: billingData.street || billingData.building,
          city: billingData.city,
          country: billingData.country || "EG",

          // Paymob Fields
          paymobOrderId: paymobOrder.id,
          paymentKey: paymentKey,
          paymobStatus: "PENDING",

          // الأسعار
          subTotal,
          deliveryFee,
          totalPrice: amount, // إجمالي المبلغ المدفوع
          paid: false,
        },
      });



      const iframeUrl =
        `https://accept.paymob.com/api/acceptance/iframes/` +
        `${process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID}` +
        `?payment_token=${paymentKey}`;

      return {
        success: true,
        payment_key: paymentKey,
        iframe_url: iframeUrl,
        order_id: paymobOrder.id,
        dbOrderId: dbOrder.id, // مهم للـ Success/Failure Page
      };
    } catch (error: any) {
      console.error("Paymob Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Payment initiation failed",
      );
    }
  }
}
