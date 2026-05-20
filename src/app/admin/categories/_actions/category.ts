"use server";

import { db } from "@/lib/prisma";
import { addCategorySchema, updateCategorySchema } from "@/validations/category";
import { revalidatePath } from "next/cache";

 
export const addCategory = async (_: unknown, formData: FormData) => {
  const result = addCategorySchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
      status: 400,
    };
  }

  try {
    await db.category.create({
      data: result.data,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/menu");

    return {
      status: 201,
      message: "تمت إضافة القسم بنجاح",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "حدث خطأ غير متوقع",
    };
  }
};


export const updateCategory = async (
  id: string,
  _: unknown,
  formData: FormData
) => {
  const result = updateCategorySchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
      status: 400,
    };
  }

  try {
    await db.category.update({
      where: { id },
      data: {
        name: result.data.categoryName,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/menu");

    return {
      status: 200,
      message: "تم التعديل بنجاح",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "حدث خطأ غير متوقع",
    };
  }
};


export const deleteCategory = async (id: string) => {
    try {
    const relatedProducts = await db.product.findMany({
        where: { categoryId: id },
    });

    if (relatedProducts.length > 0) {
      return {
        status: 400,
        message: "لا يمكن حذف القسم لوجود منتجات مرتبطة به",
      };
    }

    await db.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/menu");

    return {
      status: 200,
      message: "تم الحذف بنجاح",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "حدث خطأ غير متوقع",
    };
  }
};
