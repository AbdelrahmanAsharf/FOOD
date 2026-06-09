/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      customerName,
      customerPhone,
      streetAddress,
      city,
      subTotal,
      deliveryFee,
      totalPrice,
      cartItems,
      deliveryType,
      selectedBranchId,
    } = await req.json();

    const order = await db.order.create({
      data: {
        userId,
        customerName,
        customerPhone,
        streetAddress: streetAddress || "NA",
        city: city || "Cairo",
        country: "EG",
        subTotal,
        deliveryFee,
        totalPrice,
        deliveryType,
        paymentMethod: "CASH_ON_DELIVERY",
        branchId: selectedBranchId || null,
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

    await db.user.update({
      where: { id: userId },
      data: {
        name: customerName || undefined, // ✅ أضف
        phone: customerPhone || undefined,
        streetAddress: streetAddress || undefined,
        city: city || undefined,
      },
    });
    revalidatePath("/cart");

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Cash Order Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
