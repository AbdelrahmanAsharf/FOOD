
import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
    password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
    confirmPassword: z.string(),
    username: z.string().min(3, { message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمة المرور غير متطابقة',
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

