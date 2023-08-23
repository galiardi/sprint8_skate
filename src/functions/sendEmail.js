import nodemailer from 'nodemailer';
import { SMTP_SERVICE, SMTP_USER, SMTP_PASS } from '../config.js';

const transporter = nodemailer.createTransport({
  service: SMTP_SERVICE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function sendEmail({ email, subject, message }) {
  const info = await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject,
    text: message,
  });
  return info;
}

export { sendEmail };
