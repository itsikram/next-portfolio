const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const GeneralDetails = require('../models/GeneralDetails');
const HomeContent = require('../models/HomeContent');
const Portfolio = require('../models/Portfolio');
const ProcessContent = require('../models/ProcessContent');
const ResumeContent = require('../models/ResumeContent');
const Service = require('../models/Service');

// Export all data
router.get('/export', async (req, res) => {
  try {
    const exportData = {
      aboutContent: await AboutContent.find({}),
      blogs: await Blog.find({}),
      contact: await Contact.find({}),
      generalDetails: await GeneralDetails.find({}),
      homeContent: await HomeContent.find({}),
      portfolios: await Portfolio.find({}),
      processContent: await ProcessContent.find({}),
      resumeContent: await ResumeContent.find({}),
      services: await Service.find({}),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio-export.json');
    res.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Export frontend static data
router.get('/export-frontend', async (req, res) => {
  try {
    const frontendData = {
      projectInfo: {
        name: "portfolio",
        version: "0.1.0",
        description: "Portfolio website for Programmer Ikram",
        author: "Programmer Ikram",
        framework: "Next.js 15.3.2",
        buildTool: "Next.js",
        styling: ["SCSS", "CSS Modules", "Tailwind CSS"],
        language: "TypeScript"
      },
      navigation: {
        mainMenu: [
          { label: "Home", href: "/", active: true },
          { label: "About", href: "/about", active: false },
          { label: "Resume", href: "/resume", active: false },
          { label: "Portfolio", href: "/portfolio", active: false },
          { label: "Services", href: "/services", active: false },
          { label: "Blogs", href: "/blogs", active: false },
          { label: "Contact", href: "/contact", active: false }
        ],
        adminMenu: [
          { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
          { label: "General Details", href: "/admin/general-details", icon: "⚙️" },
          { label: "Home Content", href: "/admin/home", icon: "📝" },
          { label: "About Content", href: "/admin/about", icon: "👤" },
          { label: "Resume Content", href: "/admin/resume", icon: "📄" },
          { label: "Portfolio", href: "/admin/portfolio", icon: "💼" },
          { label: "Services", href: "/admin/services", icon: "🛠️" },
          { label: "Process Content", href: "/admin/process-content", icon: "🔄" },
          { label: "Blogs", href: "/admin/blogs", icon: "📝" },
          { label: "Contact", href: "/admin/contact", icon: "📧" },
          { label: "Import/Export", href: "/admin/import-export", icon: "💾" }
        ]
      },
      branding: {
        siteName: "WP Developer",
        fullName: "Programmer Ikram",
        defaultProfileImage: "/images/profile.jpg",
        favicon: "/favicon.ico",
        websiteLink: "https://programmerikram.com"
      },
      exportedAt: new Date().toISOString(),
      version: "1.0.0"
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=frontend-static-data.json');
    res.json(frontendData);
  } catch (error) {
    console.error('Frontend export error:', error);
    res.status(500).json({ error: 'Failed to export frontend data' });
  }
});

// Import all data
router.post('/import', async (req, res) => {
  try {
    const importData = req.body;
    
    // Validate import data structure
    if (!importData || typeof importData !== 'object') {
      return res.status(400).json({ error: 'Invalid import data format' });
    }

    const results = {
      success: [],
      failed: []
    };

    // Check if this is frontend static data
    if (importData.projectInfo && importData.navigation) {
      // Handle frontend static data import
      try {
        results.success.push('Frontend static data detected and validated');
        results.success.push('Project configuration: ' + importData.projectInfo.name);
        results.success.push('Navigation items: ' + importData.navigation.mainMenu.length + ' main, ' + importData.navigation.adminMenu.length + ' admin');
        results.success.push('Available icons: ' + importData.icons.available.length);
        results.success.push('Styling files: ' + importData.styling.moduleStyles.length);
        results.success.push('Dependencies: ' + Object.keys(importData.dependencies).length + ' categories');
        
        // You can optionally save this data to a config file or database
        // For example, save to a FrontendConfig model if you create one
        console.log('Frontend static data imported:', {
          projectName: importData.projectInfo.name,
          version: importData.projectInfo.version,
          navigationCount: importData.navigation.mainMenu.length,
          iconCount: importData.icons.available.length
        });
        
      } catch (error) {
        results.failed.push(`Frontend static data import failed: ${error.message}`);
      }
    } else {
      // Handle regular database data import
      // Clear existing data (optional - you might want to merge instead)
      if (req.body.clearExisting) {
        try {
          await AboutContent.deleteMany({});
          await Blog.deleteMany({});
          await Contact.deleteMany({});
          await GeneralDetails.deleteMany({});
          await HomeContent.deleteMany({});
          await Portfolio.deleteMany({});
          await ProcessContent.deleteMany({});
          await ResumeContent.deleteMany({});
          await Service.deleteMany({});
        } catch (clearError) {
          console.error('Clear existing data error:', clearError);
        }
      }

      // Import AboutContent
      if (importData.aboutContent && Array.isArray(importData.aboutContent)) {
        try {
          // Remove _id fields to avoid duplicate key errors
          const cleanAboutContent = importData.aboutContent.map(item => {
            const { _id, __v, ...cleanItem } = item;
            return cleanItem;
          });
          await AboutContent.insertMany(cleanAboutContent);
          results.success.push('AboutContent imported successfully');
        } catch (error) {
          results.failed.push(`AboutContent import failed: ${error.message}`);
        }
      }

    // Import Blogs
      if (importData.blogs && Array.isArray(importData.blogs)) {
        try {
          // Remove _id fields to avoid duplicate key errors
          const cleanBlogs = importData.blogs.map(item => {
            const { _id, __v, ...cleanItem } = item;
            return cleanItem;
          });
          
          // Handle unique slug constraint by using upsert operations
          for (const blog of cleanBlogs) {
            try {
              await Blog.findOneAndUpdate(
                { slug: blog.slug },
                blog,
                { upsert: true, new: true, runValidators: true }
              );
            } catch (error) {
              if (error.code === 11000) {
                results.failed.push(`Blog with slug "${blog.slug}" already exists`);
              } else {
                results.failed.push(`Blog "${blog.title}" import failed: ${error.message}`);
              }
            }
          }
          results.success.push('Blogs processed successfully');
        } catch (error) {
          results.failed.push(`Blogs import failed: ${error.message}`);
        }
      }

      // Import Contact
      if (importData.contact && Array.isArray(importData.contact)) {
        try {
          // Remove _id fields to avoid duplicate key errors
          const cleanContact = importData.contact.map(item => {
            const { _id, __v, ...cleanItem } = item;
            return cleanItem;
          });
          await Contact.insertMany(cleanContact);
          results.success.push('Contact imported successfully');
        } catch (error) {
          results.failed.push(`Contact import failed: ${error.message}`);
        }
      }

      // Import GeneralDetails
      if (importData.generalDetails && Array.isArray(importData.generalDetails)) {
        try {
          // Remove _id fields to avoid duplicate key errors
          const cleanGeneralDetails = importData.generalDetails.map(item => {
            const { _id, __v, ...cleanItem } = item;
            return cleanItem;
          });
          await GeneralDetails.insertMany(cleanGeneralDetails);
          results.success.push('GeneralDetails imported successfully');
        } catch (error) {
          results.failed.push(`GeneralDetails import failed: ${error.message}`);
        }
      }

      // Import HomeContent
      if (importData.homeContent && Array.isArray(importData.homeContent)) {
        try {
          // Remove _id fields to avoid duplicate key errors
          const cleanHomeContent = importData.homeContent.map(item => {
            const { _id, __v, ...cleanItem } = item;
            return cleanItem;
          });
          await HomeContent.insertMany(cleanHomeContent);
          results.success.push('HomeContent imported successfully');
        } catch (error) {
          results.failed.push(`HomeContent import failed: ${error.message}`);
        }
      }

      // Import Portfolios
      if (importData.portfolios && Array.isArray(importData.portfolios)) {
        try {
          // Remove _id fields to avoid duplicate key errors
          const cleanPortfolios = importData.portfolios.map(item => {
            const { _id, __v, ...cleanItem } = item;
            return cleanItem;
          });
          await Portfolio.insertMany(cleanPortfolios);
          results.success.push('Portfolios imported successfully');
        } catch (error) {
          results.failed.push(`Portfolios import failed: ${error.message}`);
        }
      }

      // Import ProcessContent
      if (importData.processContent && Array.isArray(importData.processContent)) {
        try {
          // Remove _id fields to avoid duplicate key errors
          const cleanProcessContent = importData.processContent.map(item => {
            const { _id, __v, ...cleanItem } = item;
            return cleanItem;
          });
          await ProcessContent.insertMany(cleanProcessContent);
          results.success.push('ProcessContent imported successfully');
        } catch (error) {
          results.failed.push(`ProcessContent import failed: ${error.message}`);
        }
      }

      // Import ResumeContent
      if (importData.resumeContent && Array.isArray(importData.resumeContent)) {
        try {
          // Remove _id fields to avoid duplicate key errors
          const cleanResumeContent = importData.resumeContent.map(item => {
            const { _id, __v, ...cleanItem } = item;
            return cleanItem;
          });
          await ResumeContent.insertMany(cleanResumeContent);
          results.success.push('ResumeContent imported successfully');
        } catch (error) {
          results.failed.push(`ResumeContent import failed: ${error.message}`);
        }
      }

      // Import Services
      if (importData.services && Array.isArray(importData.services)) {
        try {
          // Remove _id fields to avoid duplicate key errors
          const cleanServices = importData.services.map(item => {
            const { _id, __v, ...cleanItem } = item;
            return cleanItem;
          });
          await Service.insertMany(cleanServices);
          results.success.push('Services imported successfully');
        } catch (error) {
          results.failed.push(`Services import failed: ${error.message}`);
        }
      }

    }

    res.json({
      message: 'Import process completed',
      results
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import data' });
  }
});

// Get data summary
router.get('/summary', async (req, res) => {
  try {
    const summary = {
      aboutContent: await AboutContent.countDocuments(),
      blogs: await Blog.countDocuments(),
      contact: await Contact.countDocuments(),
      generalDetails: await GeneralDetails.countDocuments(),
      homeContent: await HomeContent.countDocuments(),
      portfolios: await Portfolio.countDocuments(),
      processContent: await ProcessContent.countDocuments(),
      resumeContent: await ResumeContent.countDocuments(),
      services: await Service.countDocuments()
    };

    res.json(summary);
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Failed to get data summary' });
  }
});

module.exports = router;
