/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymobOrderId = searchParams.get('paymobOrderId');
    const orderId = searchParams.get('orderId');

    let order = null;

    if (paymobOrderId) {
      order = await db.order.findUnique({
        where: { 
          paymobOrderId: parseInt(paymobOrderId) 
        },
        include: {
          products: {
            include: { product: true }
          }
        }
      });
    } else if (orderId) {
      order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          products: {
            include: { product: true }
          }
        }
      });
    }

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      order 
    });

  } catch (error: any) {
    console.error("Verify Order Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}