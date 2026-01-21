const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');
const { authMiddleware } = require('../middleware/auth');

// Get home content
router.get('/', async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      // Create default content if none exists
      content = new HomeContent({
        hero: {
          title: "Hi, I'm Md Ikram",
          subtitle: "Full Stack Developer",
          description: "Crafting exceptional digital experiences with clean code and pixel-perfect design. Specialized in WordPress, MERN stack, and creating interactive web applications that drive business growth.",
          profileImage: "/images/profile.jpg"
        },
        stats: [
          { value: "5+", label: "Years Experience" },
          { value: "50+", label: "Projects Completed" },
          { value: "30+", label: "Happy Clients" }
        ],
        ctaButtons: [
          {
            text: "Get In Touch",
            url: "/contact",
            type: "primary",
            isDownload: false
          },
          {
            text: "Download CV",
            url: "/Senior Software Developer.pdf",
            type: "secondary",
            isDownload: true
          }
        ],
        seo: {
          title: "Home - Portfolio of Md Ikram",
          description: "Full Stack WordPress & MERN Developer with 5+ years of experience"
        }
      });
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update home content (admin only)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    
    if (!content) {
      content = new HomeContent(req.body);
    } else {
      Object.assign(content, req.body);
    }
    
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
