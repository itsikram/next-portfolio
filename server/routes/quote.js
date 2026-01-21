const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
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

// Send quote request
router.post('/send', async (req, res) => {
  try {
    const { name, email, project, budget, timeline, message, serviceTitle } = req.body;
    
    // Validate required fields
    if (!name || !email || !project) {
      return res.status(400).json({ message: 'Name, email, and project description are required' });
    }
    
    // Get contact configuration
    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(500).json({ message: 'Contact configuration not found' });
    }
    
    // Create email transporter
    const transporter = createTransporter();
    
    // Prepare email content
    const emailContent = `
      <h2>New Quote Request - ${serviceTitle || 'Web Development Service'}</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${serviceTitle || 'Not specified'}</p>
      <p><strong>Project Description:</strong></p>
      <p>${project.replace(/\n/g, '<br>')}</p>
      ${budget ? `<p><strong>Budget Range:</strong> ${budget}</p>` : ''}
      ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
      ${message ? `<p><strong>Additional Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>Sent from portfolio quote form</small></p>
    `;
    
    // Send email to recipient
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mdikram295@gmail.com',
      to: contact.contactForm.recipientEmail,
      subject: `Quote Request - ${serviceTitle || 'Web Development'} - From ${name}`,
      html: emailContent,
      replyTo: email
    };
    
    await transporter.sendMail(mailOptions);
    
    // Log the submission for tracking
    console.log('Quote form submission:', {
      name,
      email,
      serviceTitle,
      budget,
      timeline,
      project: project.substring(0, 100) + '...',
      recipient: contact.contactForm.recipientEmail,
      timestamp: new Date().toISOString()
    });
    
    res.json({ message: 'Quote request sent successfully' });
  } catch (error) {
    console.error('Error sending quote request email:', error);
    res.status(500).json({ message: 'Failed to send quote request. Please try again later.' });
  }
});

module.exports = router;
