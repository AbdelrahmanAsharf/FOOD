// app/api/paymob/webhook/route.ts

import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('🔥 PAYMOB WEBHOOK:', body);

    const obj = body.obj;

    const success = obj?.success;
    const paymobOrderId = obj?.order?.id;

    if (!paymobOrderId) {
      return NextResponse.json(
        { success: false },
        { status: 400 }
      );
    }

    const order = await db.order.findFirst({
      where: {
        paymobOrderId: paymobOrderId,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false },
        { status: 404 }
      );
    }

    await db.order.update({
      where: {
        id: order.id,
      },
      data: {
        paid: success === true,
        paymobStatus: success ? 'PAID' : 'FAILED',
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}