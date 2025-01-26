
import nodemailer from 'nodemailer';

import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "../utils/emailTemplate.js";

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iskalusugan2025@gmail.com',
      pass: 'diketyrwipxmxuwa', // Use the app-specific password
    },
  });
  

const sendEmail = async (recipientEmail, subject, htmlContent) => {
    const mailOptions = {
      from: 'iskalusugan2025@gmail.com', // Sender email
      to: recipientEmail, // Recipient email (from MongoDB)
      subject: subject,
      html: htmlContent, // Use 'html' for sending HTML emails
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  export const emailUser = async (req, res, next) => {
    const { email, subject, html, resetURL } = req.body;
  
    let emailContent = html;
  
    // Handle other email templates
    if (subject === 'Password Reset Request') {
      emailContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
    } else if (subject === 'Password Reset Successful') {
      emailContent = PASSWORD_RESET_SUCCESS_TEMPLATE;
    }
  
    try {
      // Assuming sendEmail function can handle HTML content
      await sendEmail(email, subject, emailContent, true); // Add boolean flag for HTML content
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Email sending error:', error);
      res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
  };
  
