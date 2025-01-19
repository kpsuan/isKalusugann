
import nodemailer from 'nodemailer';

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iskalusugan2025@gmail.com',
      pass: 'diketyrwipxmxuwa', // Use the app-specific password
    },
  });
  

const sendEmail = async (recipientEmail, subject, text) => {
    const mailOptions = {
      from: 'iskalusugan2025@gmail.com', // Sender email
      to: recipientEmail, // Recipient email (from MongoDB)
      subject: subject,
      text: text, // The body of the email
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

export const emailUser = async (req, res, next) => {
    const { email, subject, text } = req.body;
  
    try {
      await sendEmail(email, subject, text);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
  };
