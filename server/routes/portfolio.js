const express = require('express');
const Portfolio = require('../models/Portfolio');
const { authMiddleware } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// Get all portfolio items
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const portfolios = await Portfolio.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Portfolio.countDocuments(filter);

    res.json({
      portfolios,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single portfolio item
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create portfolio item (protected)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const portfolioData = { ...req.body };
    
    // Parse technologies if it's a JSON string
    if (portfolioData.technologies && typeof portfolioData.technologies === 'string') {
      try {
        portfolioData.technologies = JSON.parse(portfolioData.technologies);
      } catch (parseError) {
        return res.status(400).json({ message: 'Invalid technologies format' });
      }
    }
    
    // Parse featured if it's a string
    if (portfolioData.featured && typeof portfolioData.featured === 'string') {
      portfolioData.featured = portfolioData.featured === 'true';
    }
    
    // If an image was uploaded, add its URL to the portfolio data
    if (req.file) {
      portfolioData.image = req.file.path;
    }

    const portfolio = new Portfolio(portfolioData);
    await portfolio.save();
    
    res.status(201).json({
      message: 'Portfolio item created successfully',
      portfolio
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    // If there was an error and a file was uploaded, try to delete it from Cloudinary
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded image:', cleanupError);
      }
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update portfolio item (protected)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const portfolioData = { ...req.body };
    
    // Parse technologies if it's a JSON string
    if (portfolioData.technologies && typeof portfolioData.technologies === 'string') {
      try {
        portfolioData.technologies = JSON.parse(portfolioData.technologies);
      } catch (parseError) {
        return res.status(400).json({ message: 'Invalid technologies format' });
      }
    }
    
    // Parse featured if it's a string
    if (portfolioData.featured && typeof portfolioData.featured === 'string') {
      portfolioData.featured = portfolioData.featured === 'true';
    }
    
    // If an image was uploaded, add its URL to the portfolio data
    if (req.file) {
      portfolioData.image = req.file.path;
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      portfolioData,
      { new: true, runValidators: true }
    );

    if (!portfolio) {
      // If portfolio not found and a file was uploaded, delete it from Cloudinary
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded image:', cleanupError);
        }
      }
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // If a new image was uploaded and there was an old image, delete the old one
    if (req.file && portfolio.image) {
      try {
        // Extract public_id from the old Cloudinary URL
        const urlParts = portfolio.image.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `portfolio/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cleanupError) {
        console.error('Failed to delete old image from Cloudinary:', cleanupError);
      }
    }

    res.json({
      message: 'Portfolio item updated successfully',
      portfolio
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    // If there was an error and a file was uploaded, try to delete it from Cloudinary
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded image:', cleanupError);
      }
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete portfolio item (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Delete the image from Cloudinary if it exists
    if (portfolio.image) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = portfolio.image.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `portfolio/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cleanupError) {
        console.error('Failed to delete image from Cloudinary:', cleanupError);
      }
    }

    res.json({
      message: 'Portfolio item deleted successfully',
      portfolio
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
