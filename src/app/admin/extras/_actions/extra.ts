"use server";

import { db } from "@/lib/prisma";
import { extraSchema } from "@/validations/extra";
import { revalidatePath } from "next/cache";

export const addExtra = async (_: unknown, formData: FormData) => {
  const result = extraSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, status: 400 };
  }

  try {
    await db.extra.create({ data: result.data });
    revalidatePath("/admin/extras");
    return { status: 201, message: "تمت إضافة الإضافة بنجاح" };
  } catch {
    return { status: 500, message: "حدث خطأ غير متوقع" };
  }
};

export const updateExtra = async (id: string, _: unknown, formData: FormData) => {
  const result = extraSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, status: 400 };
  }

  try {
    await db.extra.update({ where: { id }, data: result.data });
    revalidatePath("/admin/extras");
    return { status: 200, message: "تم التعديل بنجاح" };
  } catch {
    return { status: 500, message: "حدث خطأ غير متوقع" };
  }
};

export const deleteExtra = async (id: string) => {
  try {
    await db.extra.delete({ where: { id } });
    revalidatePath("/admin/extras");
    return { status: 200, message: "تم الحذف" };
  } catch {
    return { status: 500, message: "فشل الحذف" };
  }
};