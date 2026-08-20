const nodemailer = require('nodemailer');

async function sendPasswordResetEmail({ to, resetUrl, name }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.EMAIL_FROM) {
    const error = new Error('Email service is not configured');
    error.statusCode = 503;
    throw error;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your password',
    text: `Hi ${name}, reset your password using this link: ${resetUrl}\nThis link expires in 15 minutes.`,
  });
}

module.exports = { sendPasswordResetEmail };
