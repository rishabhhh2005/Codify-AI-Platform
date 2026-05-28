import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

let resend;

const getResend = () => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not defined in environment variables');
      return null;
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

export const sendOTPEmail = async (email, name, otp) => {
  const resendInstance = getResend();
  if (!resendInstance) {
    console.error('Email not sent: Resend API key missing');
    return;
  }
  try {
    const { data, error } = await resendInstance.emails.send({
      from: process.env.FROM_EMAIL || 'Codify AI <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your Codify AI account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #8B5CF6;">Welcome to Codify AI!</h1>
          <p>Hi ${name},</p>
          <p>To complete your registration, please use the following One-Time Password (OTP):</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #8B5CF6;">${otp}</span>
          </div>
          <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Codify AI - Master your technical interviews.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending OTP email:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Failed to send email:', err);
    throw err;
  }
};
