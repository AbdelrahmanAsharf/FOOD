import * as z from "zod";

export const addBranchSchema = z.object({
  name: z.string().trim().min(1, {
    message: "اسم الفرع مطلوب",
  }),

  city: z.string().trim().min(1, {
    message: "اسم المدينة مطلوب",
  }),

  address: z.string().trim().min(1, {
    message: "العنوان مطلوب",
  }),

  phone: z
  .string()
  .regex(/^01[0125][0-9]{8}$/, {
    message: "رقم الهاتف غير صحيح",
  })
  .optional()
  .or(z.literal("")),
});

export const updateBranchSchema = z.object({
  name: z.string().trim().min(1, {
    message: "اسم الفرع مطلوب",
  }),

  city: z.string().trim().min(1, {
    message: "اسم المدينة مطلوب",
  }),

  address: z.string().trim().min(1, {
    message: "العنوان مطلوب",
  }),

  phone: z
  .string()
  .regex(/^01[0125][0-9]{8}$/, {
    message: "رقم الهاتف غير صحيح",
  })
  .optional()
  .or(z.literal("")),
});