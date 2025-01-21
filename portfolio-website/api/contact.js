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
      secure: true,
      tls: {
        minVersion: 'TLSv1.2',
        maxVersion: 'TLSv1.3'
      },
      auth: {
        user: process.env.PROTON_SMTP_USER,
        pass: process.env.PROTON_SMTP_TOKEN
      }
    });

    // Configure email content with enhanced formatting
    const mailOptions = {
      from: process.env.PROTON_SMTP_USER,      // Your contact email
      to: process.env.PROTON_SMTP_USER,        // Same email for receiving
      replyTo: email,                          // Visitor's email
      subject: `Contact Form: ${subject || 'New Message'} from ${name} (${email})`,
      text: `
        Name: ${name || 'Not provided'}
        Email: ${email}
        Subject: ${subject || 'Not specified'}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${name || 'Not provided'}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Subject:</strong> ${subject || 'Not specified'}</li>
          </ul>
          <div style="margin-top: 20px;">
            <strong>Message:</strong>
            <div style="white-space: pre-wrap; margin-top: 10px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
