/* eslint-disable @typescript-eslint/ban-types */
import { CookieOptions, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import APIError from '../../shared/utils/error';
import {
  CreateUserInput,
  LoginUserInput,
  resendMailInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../../shared/schema/user.schema';
import {
  createUser,
  findUserById,
  findAllUsers,
  findUserAndUpdate,
  findUser,
  deleteUserById,
} from '../user/user.service';
import { signTokens } from '../../shared/helpers/signTokens';
import { signJwt, verifyJwt } from '../../shared/utils/jwt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { getEnvVariable, getEnvVariableAsInt } from '../../shared/utils/env';
import { sendVerificationEmail, sendResetPassword } from '../../shared/services/email/sendEmail';


export const signupUser = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  try {
    const existingUser = await findUser({ email: req.body.email.toLowerCase });

    if (existingUser) {
      if (existingUser && existingUser.isVerified) {
        return next(APIError.conflict('Email already exists and is already verified.', 400));
      } else {
        // Check if the verification code has expired
        const currentTime = Date.now();
        if (existingUser.emailVerificationTokenExpiresAt && existingUser.emailVerificationTokenExpiresAt.getTime() < currentTime) {
          // The code has expired, delete the previous user account
          await deleteUserById(existingUser._id);
          return next(APIError.conflict('Email already exists and is already verified.', 400));
        } else {
          return next(
            APIError.conflict(
              'Previous account with this email has been deleted due to expired email verification link. Please proceed with registration.',
              409,
            ),
          );
        }
      }
    }

    // Generate verification code and set expiration time
    const emailVerificationTokenExpiresAt = new Date(
      Date.now() + getEnvVariableAsInt('VERIFICATION_TOKEN_EXPIRES_IN') * 60 * 1000,
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Create a new user
    const user = await createUser({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      isVerified: false,
      emailVerificationTokenExpiresAt,
    });

    // When password is correct, then be given access to sign tokens
    const cookiesOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
    };
    if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

    const accessTokenCookieOptions: CookieOptions = {
      ...cookiesOptions,
      expires: new Date(Date.now() + getEnvVariableAsInt('TOKEN_EXPIRES_IN') * 60 * 1000),
      maxAge: getEnvVariableAsInt('TOKEN_EXPIRES_IN') * 60 * 1000,
    };

    const { access_token } = await signTokens(user);
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    const redirectUrl = `${getEnvVariable('APP_SERVICE_URL')}/api/v1/auth/verifyEmail/${access_token}`;
    await sendVerificationEmail(user.email, redirectUrl);

    return res.status(200).json({
      message: `User account successfully created and verification email has been sent to ${user.email}`,
      verified: user.isVerified,
      success: true,
    });
  } catch (err) {
    console.error('An error occurred during user signup:', err);
    return next(APIError.serverError('An error occurred during user signup.', 500));
  }
};

export const siginUser = async (req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const existingUser = await findUser({ email });
    if (!existingUser) {
      return next(APIError.badRequest('Invalid email or password', 400));
    }

    // Check if user is verified
    if (!existingUser.isVerified) {
      return next(APIError.unauthenticated('You are not verified, please verify your email to login', 401));
    }

    const comparedPassword = await bcrypt.compare(password, existingUser.password);
    if (!comparedPassword) {
      return next(APIError.unauthenticated('Invalid password', 401));
    }
    // When password is correct, then be given access to sign tokens
    const cookiesOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
    };
    if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

    const accessTokenCookieOptions: CookieOptions = {
      ...cookiesOptions,
      expires: new Date(Date.now() + getEnvVariableAsInt('ACCESS_TOKEN_EXPIRES_IN') * 60 * 1000),
      maxAge: getEnvVariableAsInt('ACCESS_TOKEN_EXPIRES_IN') * 60 * 1000,
    };

    const refreshTokenCookieOptions: CookieOptions = {
      ...cookiesOptions,
      expires: new Date(Date.now() + getEnvVariableAsInt('REFRESH_TOKEN_EXPIRES_IN') * 60 * 1000),
      maxAge: getEnvVariableAsInt('REFRESH_TOKEN_EXPIRES_IN') * 60 * 1000,
    };

    const { access_token, refresh_token } = await signTokens(existingUser);

    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return res.status(200).json({
      message: 'Login successfully',
      data: existingUser,
      access_token: access_token,
      success: true,
    });
  } catch (err) {
    return next(APIError.serverError('Internal server error', 500));
  }
};

export const emailVerification = async (
  req: Request<{token: string}, {}, VerifyEmailInput>,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.params;
  try {
    // Validate the token
    const decoded = verifyJwt<{ sub: string }>(token, 'REFRESH_TOKEN_PUBLIC_KEY');
    if (!decoded) {
      return next(APIError.notFound('Could not find token', 404));
    }

   // Check if user still exist
   const existingUser = await findUser({ _id: decoded.sub });

   if (!existingUser) {
     return next(APIError.notFound('Could not find token', 404));
   }
   if (existingUser.isVerified) {
     return next(APIError.badRequest('This user has already been verified.', 400));
   }
    // Update user's verification status
    const updatedUser = await findUserAndUpdate(existingUser._id);
    if (!updatedUser) {
      return next(APIError.serverError('Failed to update user verification status', 500));
    }

    return res.status(200).json({
      isVerified: true,
      message: 'User has been verified',
      success: true,
    });
  } catch (err) {
    return next(APIError.serverError('Internal server error', 500));
  }
};

export const resendMail = async (
  req: Request<{ email: string }, {}, resendMailInput>,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;
  try {
    const existingUser = await findUser({ email: email.toLowerCase()});
    if (!existingUser) {
      return next(APIError.notFound('User not found', 404));
    }

    // Sign new access token
    const token = jwt.sign({ sub: existingUser.id }, 'ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: `${getEnvVariable('TOKEN_EXPIRES_IN')}m`,
    });
   
    const redirectUrl = `${getEnvVariable('APP_SERVICE_URL')}/api/v1/verifyEmail/${token}`;
    await sendVerificationEmail (existingUser.email, redirectUrl);

    return res.status(200).json({
      verified: existingUser.isVerified,
      message: `Resend mail has been triggered and verification email has been sent to ${existingUser.email}`,
      success: true,
    });
  } catch (err) {
    return next(APIError.serverError('Internal server error', 500));
  }
};

export const forgotPassword = async (req: Request<{}, {}, ForgotPasswordInput>, res: Response, next: NextFunction) => {
  try {
    // Get the existing user from the
    const existingUser = await findUser({ email: req.body.email.toLowerCase() });
    if (!existingUser) {
      return next(APIError.notFound('The email address does not exists', 404));
    }

    // Sign new access token
    const token = signJwt({ sub: existingUser.id }, 'ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: `${getEnvVariableAsInt('TOKEN_EXPIRES_IN')}m`,
    });
    const redirectUrl = `${getEnvVariable('APP_SERVICE_URL')}/api/auth/resetPassword/${token}`;

    await sendResetPassword (existingUser.email, redirectUrl);
    return res.status(200).json({
      message: `The reset password has been successfully activated. Please check your account.`,
      success: true,
    });
  } catch (err) {
    return next(APIError.serverError('Internal server error', 500));
  }
};

export const resetPassword = async (
  req: Request<ResetPasswordInput, Record<string, never>, ResetPasswordInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate the token
    const decoded = verifyJwt<{ sub: string }>(req.params.token, 'ACCESS_TOKEN_PUBLIC_KEY');
    if (!decoded) {
      return next(APIError.notFound('Could not find token', 404));
    }

    // Check if user still exist
    const existingUser = await findUserById(decoded.sub);

    if (!existingUser) {
      return next(APIError.notFound('Could not find token', 404));
    }

    // Check if the provided password matches the user's current password
    const isMatch = await bcrypt.compare(req.body.newPassword, existingUser.password);
    if (isMatch) {
      return next(APIError.badRequest('New password must be different from the current password', 400));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);

    // Update the user's password
    await findUserAndUpdate(existingUser._id, {
      password: hashedPassword,
    });

    return res.status(200).json({
      message: 'New password successfully reset',
      success: true,
    });
  } catch (err) {
    return next(APIError.serverError('Internal server error', 500));
  }
};