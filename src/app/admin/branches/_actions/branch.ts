"use server";

import { db } from "@/lib/prisma";
import {  addBranchSchema, updateBranchSchema } from "@/validations/branche";
import { revalidatePath } from "next/cache";

// ========== CREATE ==========
export const addBranch = async (_: unknown, formData: FormData) => {
  const result =   addBranchSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

 if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
      status: 400,
    };
  }


  try {
    await db.branch.create({
      data: result.data,
    });

    revalidatePath("/admin/branches");
    revalidatePath("/menu");

    return {
      status: 201,
      message: "تمت إضافة الفرع بنجاح",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "حدث خطأ غير متوقع",
    };
  }

};

// ========== UPDATE ==========
export const updateBranch = async (
  id: string,
  _: unknown,
  formData: FormData
) => {
  const result =   updateBranchSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

 if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
      status: 400,
    };
  }

  await db.branch.update({
    where: { id },
      data: {
        name: result.data.name,
        city: result.data.city,
        address: result.data.address,
        phone: result.data.phone || null,
      },
  });

  revalidatePath("/admin/branches");

  return { status: 200, message: "تم التعديل" };
};

// ========== DELETE ==========
export const deleteBranch = async (id: string) => {
  await db.branch.delete({
    where: { id },
  });

  revalidatePath("/admin/branches");

  return { status: 200, message: "تم الحذف" };
};