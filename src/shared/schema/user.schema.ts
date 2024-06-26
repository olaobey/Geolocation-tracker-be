import { number, object, string, TypeOf, z } from 'zod';

export const signupUserSchema = object({
  body: object({
    fullName: string({ required_error: 'Name is required' }),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
  //   passwordConfirm: string({ required_error: 'Please confirm your password' }),
  // }).partial()
  // .refine((data) => data.password === data.passwordConfirm, {
  //   path: ['passwordConfirm'],
  //   message: 'Passwords do not match',
  }),
});

export const signinUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email or password'
    ),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Invalid email or password'
    ),
  }),
});

export const verifyEmailSchema = object({
  params: object({
    token: string(),
  }),
});

export const resendMailSchema = object({
  body: object({
    email: string({
      required_error: 'Email address is required',
    }).email('Invalid email address'),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Email is invalid'),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    token: string(),
  }),
  body: object({
    newPassword: string({
      required_error: 'Password is required',
    }).min(8, 'Password must be more than 8 characters'),
    confirmPassword: string({
      required_error: 'Please confirm your password',
    }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['newPassword'],
  }),
});

export const updateUserSchema = object({
  params: object({
    id: string(),
  }),
  body: object({
    fullName: string().optional(),
    email: string().email('Invalid email address').optional(),
    username: string().optional(),
    bio: string().optional(),
    location: string().optional(),
    city: string().optional(),
    profileImage: z.string().optional(),
    phoneNumber: number().optional(),
  }),
});

export const getProfileByIdSchema = object({
  params: object({
    id: string(),
  }),
});

export const profileLogoSchema = object({
  params: object({
    id: string(),
  }),
  body: object({
    profileImage: z.string(),
  }),
});

export type CreateUserInput = TypeOf<typeof signupUserSchema>['body'];
export type LoginUserInput = TypeOf<typeof signinUserSchema>['body'];
export type VerifyEmailInput = TypeOf<typeof verifyEmailSchema>['params'];
export type GetProfileByIdInput = TypeOf<typeof getProfileByIdSchema>['params'];
export type ProfileLogoInput = TypeOf<typeof profileLogoSchema>['params'] &
TypeOf<typeof profileLogoSchema>['body'];
export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body'];
export type resendMailInput = TypeOf<typeof resendMailSchema>['body'];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['params'] &
  TypeOf<typeof resetPasswordSchema>['body'];