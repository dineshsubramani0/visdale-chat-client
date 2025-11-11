import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z
      .string()
      .email()
      .refine((val) => !!val, {
        message: 'Invalid email address',
      }),
    password: z.string().refine((val) => !!val, {
      message: 'Password is required',
    }),
  })
  .superRefine((data, ctx) => {
    const pwd = data.password || '';

    if (pwd.length < 8) {
      ctx.addIssue({
        path: ['password'],
        code: 'too_small',
        minimum: 8,
        type: 'string',
        origin: 'string',
        message: 'Password must be at least 8 characters',
      });
    }

    if (!/[A-Z]/.test(pwd)) {
      ctx.addIssue({
        path: ['password'],
        code: 'custom',
        message: 'Password must contain at least 1 uppercase letter',
      });
    }

    if (!/[a-z]/.test(pwd)) {
      ctx.addIssue({
        path: ['password'],
        code: 'custom',
        message: 'Password must contain at least 1 lowercase letter',
      });
    }

    if (!/\d/.test(pwd)) {
      ctx.addIssue({
        path: ['password'],
        code: 'custom',
        message: 'Password must contain at least 1 number',
      });
    }
  });
