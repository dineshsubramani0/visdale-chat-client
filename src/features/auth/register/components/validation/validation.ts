import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    otp: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // OTP validation
    if (data.otp !== undefined) {
      if (!/^\d{6}$/.test(data.otp)) {
        ctx.addIssue({
          path: ['otp'],
          code: 'custom', // use string literal instead of ZodIssueCode.custom
          message: 'OTP must be a 6-digit number',
        });
      }
    }

    // Password validation
    if (data.password !== undefined || data.confirmPassword !== undefined) {
      const pwd = data.password || '';
      if (!pwd) {
        ctx.addIssue({
          path: ['password'],
          code: 'custom',
          message: 'Password is required',
        });
      } else {
        if (pwd.length < 8) {
          ctx.addIssue({
            path: ['password'],
            code: 'too_small', // string literal
            minimum: 8,
            type: 'string',
            origin: 'string', // required
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
      }

      // Confirm password
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          path: ['confirmPassword'],
          code: 'custom',
          message: 'Passwords do not match',
        });
      }
    }
  });
