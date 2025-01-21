/**
 * submit-form.js
 * =============
 * 
 * API endpoint for handling contact form submissions.
 * Features rate limiting, email validation, and secure email sending.
 */

import nodemailer from 'nodemailer';
import rateLimit from '../src/utils/rateLimit.js';

// Email configuration
const EMAIL_CONFIG = {
  SMTP: {
    host: process.env.PROTON_SMTP_SERVER,
    port: parseInt(process.env.PROTON_SMTP_PORT),
    secure: false,
    requireTLS: true,
    tls: {
      ciphers: 'HIGH',
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
    }
  }
};

/**
 * Validates form submission data
 * @param {Object} data - Form data
 * @returns {Object} Validation result
 */
function validateSubmission({ email, message }) {
  if (!email?.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!message?.trim()) {
    return { isValid: false, error: 'Message is required' };
  }
  return { isValid: true };
}

/**
 * Prepares email content
 * @param {Object} formData - Form submission data
 * @returns {Object} Email options
 */
function createMailOptions(formData) {
  const { name, email, subject, message } = formData;

  return {
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
}

/**
 * Main API handler
 */
export default async function handler(req, res) {
  try {
    // Method validation
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress;
    
    if (rateLimit.isRateLimited(ip)) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.'
      });
    }

    // Form validation
    const validation = validateSubmission(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.error });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      ...EMAIL_CONFIG.SMTP,
      auth: {
        user: process.env.PROTON_SMTP_USER,
        pass: process.env.PROTON_SMTP_TOKEN
      }
    });

    // Send email
    const mailOptions = createMailOptions(req.body);
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Email submission error:', {
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