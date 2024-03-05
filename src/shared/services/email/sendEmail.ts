import nodemailer, { Transporter } from 'nodemailer';
import { getEnvVariable, getEnvVariableAsInt } from '../../utils/env';
import logger from '../../utils/logger';



interface SmtpConfig {
    host: string;
    port: number;
    user: string;
    pass: string;
  }


  const smtp: SmtpConfig = {
    host: getEnvVariable('EMAIL_HOST'),
    port: getEnvVariableAsInt('SEND_MAIL_PORT'),
    user: getEnvVariable('EMAIL_USERNAME'),
    pass: getEnvVariable('EMAIL_PASSWORD'),
  };

  interface EmailOptions {
    email: string
    subject: string
    link: string
  }

  function newTransport(): Transporter {
    return nodemailer.createTransport({
      service: 'Gmail',
      host: smtp.host,
      port: smtp.port,
      secure: true,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
      tls: {
        minVersion: 'TLSv1.2',
        maxVersion: 'TLSv1.3',
      },
    });
  }

  export async function sendVerificationEmail(email: string, link: string): Promise<void> {
    const transporter = newTransport();
    const mailOptions = {
      from: `Geolocation tracker <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Verify your email address for successful account activation',
      html: `
      <p>Please click the following link to verify your email and to complete your <strong>Geolocation Tracker</strong> registration account</p>
      
      <p>This link will expire in <strong> 24 hours</strong>.</p>
      
      <p style="margin-bottom:20px;">Click this link for active your account</p>

      <a href="${link}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Email</a>
      <p style="margin-top: 35px;">If you did not initiate this request, please try to register again </p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Pls verify the account on time</strong>
    `,
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info('Verification email sent:', info.response);
      } catch (error) {
        logger.error('Error sending verification email:', error);
      }
  }

  
  export async function sendResetPassword(email: string, link: string): Promise<void> {
    const transporter = newTransport();
    const mailOptions = {
      from: `Geolocation tracker <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Reset password activation',
      html: `
      <p>Please click the following link to reset your password in other to <strong>Reset your Geolocation Tracker </strong> account</p>
      
      <p>This link will expire in <strong> 5 minutes</strong>.</p>
      
       <p style="margin-bottom:20px;">Click this link to reset your password</p>
      
      <a href="${link}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Login</a>
       <p style="margin-top: 35px;">If you did not initiate this request, please try to activate reset password again</p>
        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Pls activate the reset password within the stipulated time</strong>
    `,

  }

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Forgot password email sent:', info.response);
  } catch (error) {
    logger.error('Error sending verification email:', error);
  }
}


  