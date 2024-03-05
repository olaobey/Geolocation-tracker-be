import { cleanEnv, num, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export default cleanEnv(process.env, {
  PORT: num({
    desc: 'Port number for the application',
  }),
  APP_LOG_LEVEL: str({
    desc: 'Log level message',
    default: 'info',
  }),
  ACCESS_TOKEN_PRIVATE_KEY: str({
    desc: 'Access token private key for authentication',
  }),
  ACCESS_TOKEN_PUBLIC_KEY: str({
    desc: 'Access token public key for authentication',
  }),
  REFRESH_TOKEN_PRIVATE_KEY: str({
    desc: 'Refresh token private key for authentication',
  }),
  REFRESH_TOKEN_PUBLIC_KEY: str({
    desc: 'Refresh token public key for authentication',
  }),
  NODE_ENV: str({
    desc: 'Node environment',
  }),
  EMAIL_USERNAME: str({
    desc: 'Email username'
  }),
  EMAIL_PASSWORD: str({
    desc: 'Email password'
  }),
  EMAIL_HOST: str({
    desc: 'Email contact'
  }),
  SEND_MAIL_PORT: str({
    desc: 'Email port'
  }),
  CLOUD_NAME: str({
    desc: 'Cloudinary name'
  }),
  API_KEY: str({
    desc: 'Api key for cloudinary'
  }),
  API_SECRET: str({
    desc: 'Cloudinary api secret key'
  }),
  GOOGLE_CALLBACK_URL: str({
    desc: 'Google redirect link'
  }),
  GOOGLE_CLIENT_ID: str({
    desc: 'Google client ID'
  }),
  GOOGLE_CLIENT_SECRET: str({
    desc: 'Google client secret key'
  }),
  COOKIE_KEY: str({
    desc: 'Cookie secret key'
  })
});
export const CORS_WHITELISTS = [];