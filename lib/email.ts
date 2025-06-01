// lib/email.ts
import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_SERVER_USER;
const emailPass = process.env.EMAIL_SERVER_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;
const appName = process.env.APP_NAME || "FinTrack"; 

if (!emailUser || !emailPass || !emailFrom) {
  console.error("Email environment variables (EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_FROM) are not fully set.");
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendOtpEmail = async (to: string, name: string, otp: string): Promise<void> => {
  if (!emailUser || !emailPass || !emailFrom) {
    console.error("Cannot send email: Email environment variables are not properly configured.");
    throw new Error("Email service is not configured.");
  }

  const mailOptions: MailOptions = {
    from: `"${appName}" <${emailFrom}>`, 
    to,
    subject: `Your ${appName} One-Time Password (OTP)`,
    text: `Hi ${name},\n\nWe received a request for an OTP for your ${appName} account associated with ${to}. If you did not request this, please ignore this email.\n\nYour OTP is: ${otp}\n\nThis code will expire in 10 minutes.\n\nPlease enter this OTP on the verification page. Do not share this code with anyone, including anyone claiming to be from ${appName}.\n\nRegards,\nThe ${appName} Team`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0D9488; /* Warna tema FinTrack (Teal-600) */ color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">${appName}</h1>
        </div>
        <div style="padding: 25px 30px;">
          <h2 style="font-size: 20px; color: #0F766E; /* Warna tema FinTrack (Teal-700) */ margin-top: 0;">One-Time Password (OTP) Verification</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>We received a request for a One-Time Password (OTP) for your ${appName} account associated with the email: <strong>${to}</strong>.</p>
          <p>If you did not request this, you can safely ignore this email. No changes will be made to your account.</p>
          <p>Your OTP is:</p>
          <div style="background-color: #f0fdfa; border: 1px dashed #5EEAD4; border-radius: 6px; padding: 15px 20px; text-align: center; margin: 20px 0;">
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #134E4A; /* Warna tema FinTrack (Teal-900) */ margin: 0;">${otp}</p>
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>Please enter this OTP on the verification page to complete your action. For your security, do not share this code with anyone, including individuals claiming to be representatives of ${appName}.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
          <p style="font-size: 0.9em; color: #6b7280;">
            If you have any questions or did not initiate this request, please contact our support team immediately (if applicable).<br>
            Thank you for using ${appName}!
          </p>
        </div>
        <div style="background-color: #f3f4f6; color: #4b5563; padding: 20px; text-align: center; font-size: 0.8em; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
          {/* <p style="margin: 5px 0;"><a href="YOUR_WEBSITE_URL/privacy" style="color: #0D9488; text-decoration: none;">Privacy Policy</a> | <a href="YOUR_WEBSITE_URL/terms" style="color: #0D9488; text-decoration: none;">Terms of Service</a></p> */}
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email.');
  }
};