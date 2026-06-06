import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const branch = await db.branch.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        phone: body.phone || null,
        area: body.area || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, branch });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create branch" },
      { status: 500 }
    );
  }
}