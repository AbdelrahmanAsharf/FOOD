import { ProductSizes } from "@prisma/client";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  image: z.string().min(1, "الصورة مطلوبة"),
  categoryId: z.string().min(1, "اختر الفئة"),
  sizes: z.array(
    z.object({
      name: z.nativeEnum(ProductSizes),
      price: z.number().min(0),
    })
  ).default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
