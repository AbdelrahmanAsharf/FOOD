import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  image: z.string().optional(),
  phone: z.string().optional(),
  streetAddress: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(['USER', 'ADMIN']), 
});

export type ProfileFormData = z.infer<typeof profileSchema>;
