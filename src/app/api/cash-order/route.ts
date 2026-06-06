/* eslint-disable @typescript-eslint/no-explicit-any */
// في أعلى الـ component

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      billingData,
      subTotal,
      deliveryFee,
      totalPrice,
      cartItems,
      deliveryType, 
      selectedBranchId
    } = await req.json();

    const order = await db.order.create({
      data: {
        userId,
        customerName: `${billingData.first_name} ${billingData.last_name}`,
        customerPhone: billingData.phone_number,
        streetAddress: billingData.street || "NA",
        city: billingData.city || "Cairo",
        country: "EG",
        subTotal,
        deliveryFee,
        totalPrice,
        deliveryType: deliveryType || "HOME",
        paymentMethod: "CASH_ON_DELIVERY",
        branchId: selectedBranchId || null, // ← مهم
        paid: false,
        paymobStatus: "PENDING",
      },
    });

    if (cartItems?.length > 0) {
      await db.orderProduct.createMany({
        data: cartItems.map((item: any) => ({
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity || 1,
          userId,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Cash Order Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
