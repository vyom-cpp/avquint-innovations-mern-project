import dotenv from "dotenv";

dotenv.config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  const response = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  return response;
};

export const sendOTPEmail = async (email, otp) => {
  return await sendEmail({
    to: email,

    subject: "TaskFlow Email Verification",

    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>TaskFlow Verification</h2>

        <p>Your verification code is:</p>

        <h1>${otp}</h1>

        <p>
          This code will expire in
          10 minutes.
        </p>

        <p>
          If you did not create a
          TaskFlow account, please
          ignore this email.
        </p>
      </div>
    `,
  });
};
