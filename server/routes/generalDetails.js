const express = require('express');
const router = express.Router();
const GeneralDetails = require('../models/GeneralDetails');
const { authMiddleware } = require('../middleware/auth');

// Get general details (public)
router.get('/', async (req, res) => {
  try {
    let details = await GeneralDetails.findOne();
    if (!details) {
      // Create default details if none exists
      details = new GeneralDetails({
        socialLinks: {
          github: "https://github.com/yourusername",
          linkedin: "https://linkedin.com/in/yourusername",
          twitter: "https://twitter.com/yourusername",
          facebook: "https://facebook.com/yourusername",
          instagram: "https://instagram.com/yourusername",
          website: "https://yourwebsite.com"
        },
        cvDownloadUrl: "/Senior Software Developer.pdf",
        sidebarImage: "/images/profile.jpg",
        siteDetails: {
          siteName: "Portfolio of Md Ikram",
          siteUrl: "https://yourportfolio.com",
          logo: "/favicon.ico",
          contactEmail: "contact@yourportfolio.com",
          phoneNumber: "+1234567890",
          location: "Your City, Country"
        },
        seoDetails: {
          metaTitle: "Portfolio of Md Ikram - Full Stack Developer",
          metaDescription: "Full Stack WordPress & MERN Developer with 5+ years of experience crafting exceptional digital experiences",
          metaKeywords: ["Full Stack Developer", "WordPress", "MERN", "React", "Node.js", "MongoDB"],
          ogImage: "/images/og-image.jpg",
          twitterHandle: "@yourusername",
          googleAnalytics: ""
        }
      });
      await details.save();
    }
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update general details (admin only)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let details = await GeneralDetails.findOne();
    
    if (!details) {
      details = new GeneralDetails(req.body);
    } else {
      Object.assign(details, req.body);
    }
    
    await details.save();
    res.json(details);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
