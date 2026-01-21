const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');
const { authMiddleware } = require('../middleware/auth');

// Get about content
router.get('/', async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      // Create default content if none exists
      content = new AboutContent({
        personalInfo: {
          fullName: "Md Ikram",
          dateOfBirth: "16/07/2003",
          age: "22 Years",
          nationality: "Bangladeshi",
          experience: "5+ Years",
          languages: "English, Bengali",
          address: "Biler Kani, Munshiganj, Bangladesh",
          mobile: "+8801581400711",
          email: "mdikram295@gmail.com",
          freelance: "Available",
          profileImage: "/images/profile.jpg",
          description: "Full Stack WordPress & MERN Developer with 5+ years of experience delivering high-performance websites and scalable applications for global clients. Specialized in custom WordPress architecture, React-based interfaces, and performance optimization with a strong focus on user experience and business growth."
        },
        services: [
          {
            title: "WordPress Development",
            description: "Custom WordPress themes, plugins, and full-stack solutions with performance optimization and SEO best practices.",
            icon: "Brush"
          },
          {
            title: "MERN Stack Development",
            description: "Full-stack web applications using MongoDB, Express.js, React.js, and Node.js with scalable architecture.",
            icon: "VsCode"
          },
          {
            title: "Performance Optimization",
            description: "Website speed optimization, code optimization, and performance tuning for better user experience and search rankings.",
            icon: "Globe"
          }
        ],
        reviews: [
          {
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod. 1",
            author: "Baish",
            source: "Freelancer.com"
          },
          {
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod. 2",
            author: "Baish",
            source: "Freelancer.com"
          },
          {
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod. 3",
            author: "Baish",
            source: "Freelancer.com"
          }
        ],
        technicalSkills: {
          frontend: [
            'React.js', 'Redux.js', 'React Native', 'HTML5', 'CSS3', 
            'Bootstrap', 'Tailwind', 'Material-UI', 'jQuery.js', 'Sass CSS'
          ],
          backend: [
            'PHP', 'Node.js', 'Express.js', 'Firebase', 'Prisma', 
            'Mongoose', 'SQL', 'Flask (Python)'
          ],
          database: [
            'MySQL', 'MongoDB', 'SQLite', 'MariaDB', 'PostgreSQL'
          ],
          tools: [
            'AWS', 'Shopify', 'Figma', 'Docker', 'Postman', 'VS Code', 
            'Cursor', 'Photoshop', 'Android Studio', 'Git', 'GitHub', 
            'XAMPP', 'Cloudflared', 'ClickUp', 'Workfolio', 'VirtualBox', 
            'WinSCP', 'Vercel'
          ]
        },
        keyStrengths: [
          'Hard Worker, Honest, Punctual and Responsible',
          'Strong problem-solving and debugging skills',
          'Willing to accept responsibility and perform accordingly even under pressure'
        ],
        cvDownloadUrl: "/Senior Software Developer.pdf"
      });
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update about content (admin only)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    
    if (!content) {
      content = new AboutContent(req.body);
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
