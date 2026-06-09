"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { productSchema } from "@/validations/products";

export async function createProduct(data: unknown) {
  const validated = productSchema.parse(data);

  const product = await db.product.create({
    data: {
      name: validated.name,
      description: validated.description,
      image: validated.image,
      categoryId: validated.categoryId,

      sizes: {
        createMany: {
          data: validated.sizes || [],
        },
      },

     
    },
  });

  revalidatePath("/admin/menu-items");
  return product;
}

export async function updateProduct(productId: string, data: unknown) {
  const validated = productSchema.parse(data);

  const product = await db.product.update({
    where: { id: productId },
    data: {
      name: validated.name,
      description: validated.description,
      image: validated.image,
      categoryId: validated.categoryId,

      sizes: {
        deleteMany: {},
        createMany: {
          data: validated.sizes || [],
        },
      },

      
    },
  });

  revalidatePath("/admin/menu-items");
  return product;
}

export async function deleteProduct(productId: string) {
  await db.product.delete({ where: { id: productId } });
  revalidatePath("/admin/menu-items");
}