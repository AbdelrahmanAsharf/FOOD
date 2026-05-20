import { ExtraIngredients, ProductSizes } from "@prisma/client"
import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "مطلوب"),
  description: z.string().min(1, "مطلوب"),
  basePrice: z.coerce.number().min(0.01, "يجب إدخال سعر صحيح"), 
  categoryId: z.string().min(1, "اختر قسم"),
  image: z.string().url().min(1, "الصورة مطلوبة"), 
  sizes: z.array(
    z.object({
      name: z.nativeEnum(ProductSizes),
      price: z.coerce.number().min(0, "السعر مطلوب"), 
    })
  ).optional(),
  extras: z.array(
    z.object({
      name: z.nativeEnum(ExtraIngredients),
      price: z.coerce.number().min(0.01, "السعر مطلوب"), 
    })
  ).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
