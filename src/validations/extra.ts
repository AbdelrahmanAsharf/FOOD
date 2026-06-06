import { z } from "zod"

export const extraSchema = z.object({
  name: z.string().min(1, "اسم الإضافة مطلوب"),
  price: z.coerce.number().min(0.01, "السعر مطلوب"),
})

export type ExtraFormValues = z.infer<typeof extraSchema>