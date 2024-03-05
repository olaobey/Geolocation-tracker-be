import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyJwt } from '../utils/jwt';
import APIError from '../utils/error';
import { findUserById } from '../../api/user/user.service';

// Extend the Request interface
export interface AuthenticatedRequest extends Request {
  userId: { id: string };
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
    let access_token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(APIError.unauthorized('ACCESS FORBIDDEN! Authorization headers is required.', 403));
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(access_token, 'ACCESS_TOKEN_PUBLIC_KEY');

    if (!decoded) {
      return next(
        APIError.notFound('JWT TOKEN INVALID! JWT token is expired/ not invalid. Please logout and login again', 404),
      );
    }
      // Check if the user still exist
    const user = await findUserById(decoded.sub );

    if (!user) {
      return next(APIError.notFound('UNKNOWN ACCESS! Authorization headers is missing/invalid', 404));
    }

    // Add user to req
    authenticatedReq.userId = { id: user.id };
    next();
    } catch (err) {
      return next(APIError.serverError('Internal server error', 500));
    }
  }

export { authenticate };