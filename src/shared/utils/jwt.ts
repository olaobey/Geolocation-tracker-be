/* eslint-disable @typescript-eslint/ban-types */
import jwt, { SignOptions } from 'jsonwebtoken';
import { getEnvVariable } from './env';

export const signJwt = (
  payload: Object,
  keyName: 'ACCESS_TOKEN_PRIVATE_KEY' | 'REFRESH_TOKEN_PRIVATE_KEY',
  options: SignOptions,
) => {
  const privateKey = Buffer.from(getEnvVariable(keyName), 'base64').toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};
export const verifyJwt = <T>(
  token: string,
  keyName: 'ACCESS_TOKEN_PUBLIC_KEY' | 'REFRESH_TOKEN_PUBLIC_KEY',
): T | null => {
  try {
    const publicKey = Buffer.from(getEnvVariable(keyName), 'base64').toString('ascii');
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};