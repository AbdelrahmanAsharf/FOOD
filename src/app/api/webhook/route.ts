/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/prisma';

const HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET!;

function validateHmac(body: any, receivedHmac: string): boolean {
  if (!receivedHmac) return false;

  const data = { ...body };
  delete data.hmac;

  const sortedKeys = Object.keys(data).sort();
  const stringToHash = sortedKeys.map(key => String(data[key])).join('');

  const calculatedHmac = crypto
    .createHmac('sha512', HMAC_SECRET)
    .update(stringToHash)
    .digest('hex');

  return calculatedHmac === receivedHmac;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hmac = body.hmac;

    // HMAC Validation - أمان مهم جداً
    if (!hmac || !validateHmac(body, hmac)) {
      console.warn('❌ Invalid HMAC received');
      return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 });
    }

    const { obj } = body;
    const isSuccess = obj?.success === true;
    const paymobOrderId = obj?.order?.id;

    if (!paymobOrderId) {
      console.warn('⚠️ Webhook received without order id');
      return NextResponse.json({ error: 'No order id' }, { status: 400 });
    }

    // تحديث الطلب في قاعدة البيانات
    const updated = await db.order.updateMany({
      where: { 
        paymobOrderId: Number(paymobOrderId) 
      },
      data: {
        paid: isSuccess,
        paymobStatus: isSuccess ? "PAID" : "FAILED",
        transactionId: obj?.id?.toString(),
        hmacValidated: true,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Webhook: Order ${paymobOrderId} → ${isSuccess ? 'PAID' : 'FAILED'} | Updated: ${updated.count} rows`);

    return NextResponse.json({ 
      success: true,
      message: `Order ${paymobOrderId} updated successfully`
    });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}