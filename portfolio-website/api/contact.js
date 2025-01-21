import nodemailer from 'nodemailer';
import rateLimit from '../src/utils/rateLimit.js';

export default async function handler(req, res) {
  // Get client IP address
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
             req.socket.remoteAddress;

  // Check rate limit
  if (rateLimit.isRateLimited(ip)) {
    return res.status(429).json({
      message: 'Too many requests. Please try again later.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!email || !message) {
      return res.status(400).json({ message: 'Email and message are required' });
    }

    // Create email transporter for ProtonMail
    const transporter = nodemailer.createTransport({
      host: process.env.PROTON_SMTP_SERVER,
      port: parseInt(process.env.PROTON_SMTP_PORT),
      secure: false,
      requireTLS: true,
      tls: {
        ciphers: 'HIGH',
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      },
      auth: {
        user: process.env.PROTON_SMTP_USER,
        pass: process.env.PROTON_SMTP_TOKEN
      }
    });

    // Configure email content - using plain text and letting ProtonMail handle styling
    const mailOptions = {
      from: `"Caribbean Library" <${process.env.PROTON_SMTP_USER}>`,
      to: `"Me" <${process.env.PROTON_SMTP_USER}>`,
      replyTo: `"${name || 'Website Visitor'}" <${email}>`,
      subject: `${name} wrote to you: "${subject}"`,
      text: [
        `Name: ${name || 'Not provided'}`,
        `Email: ${email}`,
        `Subject: ${subject || 'Not specified'}`,
        "",
        "Message:",
        message.trim(),
        "",
        "--",
        "Sent from the Caribbean Library's contact form"
      ].join('\n')
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', {
      error: error,
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    return res.status(500).json({ 
      message: 'Error sending email',
      details: error.message 
    });
  }
}