/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PaymobService } from '@/lib/paymob';

export async function POST(req: NextRequest) {
  try {
    const { amount, billingData, userId, subTotal, deliveryFee } = await req.json();

    console.log("📥 Received Data:", { amount, userId, billingData });

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
    }
    if (!billingData?.email || !billingData?.phone_number) {
      return NextResponse.json({ success: false, error: "Billing data is incomplete" }, { status: 400 });
    }

    const result = await PaymobService.initiatePayment(
      amount, 
      billingData, 
      userId,
      subTotal || amount,
      deliveryFee || 0
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Paymob Full Error:", error.response?.data || error.message || error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Payment initiation failed",
        details: error.response?.data || null 
      },
      { status: 500 }
    );
  }
}