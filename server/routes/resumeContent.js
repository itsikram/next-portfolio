const express = require('express');
const router = express.Router();
const ResumeContent = require('../models/ResumeContent');
const { authMiddleware } = require('../middleware/auth');

// Get resume content
router.get('/', async (req, res) => {
  try {
    let content = await ResumeContent.findOne();
    if (!content) {
      // Create default content if none exists
      content = new ResumeContent({
        skills: [
          { name: "HTML", percentage: 98 },
          { name: "CSS", percentage: 95 },
          { name: "javaScript", percentage: 80 },
          { name: "jQuery", percentage: 90 },
          { name: "PHP", percentage: 85 },
          { name: "Node.js", percentage: 70 },
          { name: "React", percentage: 85 },
          { name: "Bootsrap", percentage: 85 },
          { name: "WordPress", percentage: 95 },
          { name: "Laravel", percentage: 40 }
        ],
        experience: [
          {
            title: "Full Stack Developer",
            company: "Tech Company",
            location: "Remote",
            startDate: "2022",
            endDate: "Present",
            description: "Developing and maintaining web applications using modern technologies.",
            isCurrentJob: true
          }
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "University Name",
            location: "City, Country",
            startDate: "2020",
            endDate: "2024",
            description: "Graduated with honors, specialized in software development."
          }
        ]
      });
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update resume content (admin only)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let content = await ResumeContent.findOne();
    
    if (!content) {
      content = new ResumeContent(req.body);
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
