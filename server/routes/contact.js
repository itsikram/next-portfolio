const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authMiddleware } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use app password for Gmail
    }
  });
};

// Get contact information
router.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      // Create default contact info if none exists
      contact = new Contact({
        personalInfo: {
          emails: ["mdikram295@gmail.com", "ikramapple123@gmail.com"],
          phones: ["+8801601216268", "+8801581400711"],
          addresses: ["Boikhar, Sadar Munshiganj", "Dhaka, Bangladesh"]
        },
        socialLinks: [
          {
            platform: "github",
            url: "https://github.com/itsikram",
            displayName: "GitHub"
          },
          {
            platform: "linkedin",
            url: "https://www.linkedin.com/in/programmer-ikram/",
            displayName: "LinkedIn"
          }
        ],
        contactForm: {
          recipientEmail: "mdikram295@gmail.com",
          notificationEmail: "mdikram295@gmail.com"
        }
      });
      await contact.save();
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact information (admin only)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let contact = await Contact.findOne();
    
    if (!contact) {
      contact = new Contact(req.body);
    } else {
      Object.assign(contact, req.body);
    }
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Send contact form message
router.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // // Get contact configuration
    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(500).json({ message: 'Contact configuration not found' });
    }
    
    // Create email transporter
    const transporter = createTransporter();
    
    // Prepare email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Sent from portfolio contact form</small></p>
    `;
    
    // Send email to recipient
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mdikram295@gmail.com',
      to: contact.contactForm.recipientEmail,
      subject: `${subject} - From Portfolio Contact Form`,
      html: emailContent,
      replyTo: email
    };
    
    await transporter.sendMail(mailOptions);
    
    // Log the submission for tracking
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message: message.substring(0, 100) + '...',
      recipient: contact.contactForm.recipientEmail,
      timestamp: new Date().toISOString()
    });
    
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
