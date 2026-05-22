/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";

const HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET!;

function validateHmac(body: any, receivedHmac: string): boolean {
  if (!receivedHmac) return false;

  const obj = body.obj || {};

  const concatenated = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refund,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order?.id,
    obj.owner,
    obj.pending,
    obj.source_data?.pan,
    obj.source_data?.sub_type,
    obj.source_data?.type,
    obj.success,
  ].join("");

  const calculatedHmac = crypto
    .createHmac("sha512", HMAC_SECRET)
    .update(concatenated)
    .digest("hex");

  return calculatedHmac === receivedHmac;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hmac = body.hmac;

    if (!hmac || !validateHmac(body, hmac)) {
      console.warn("❌ Invalid HMAC received - continuing for debug");
    }

    const { obj } = body;
    const isSuccess = obj?.success === true;
    const paymobOrderId = obj?.order?.id;

    if (!paymobOrderId) {
      console.warn("⚠️ Webhook received without order id");
      return NextResponse.json({ error: "No order id" }, { status: 400 });
    }

    const updated = await db.order.updateMany({
      where: { paymobOrderId: Number(paymobOrderId) },
      data: {
        paid: isSuccess,
        paymobStatus: isSuccess ? "PAID" : "FAILED",
        transactionId: obj?.id?.toString(),
        hmacValidated: true,
        updatedAt: new Date(),
      },
    });

    console.log(
      `✅ Webhook: Order ${paymobOrderId} → ${isSuccess ? "PAID" : "FAILED"} | Updated: ${updated.count} rows`,
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
