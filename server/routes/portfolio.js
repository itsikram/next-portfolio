const express = require('express');
const Portfolio = require('../models/Portfolio');
const { authMiddleware } = require('../middleware/auth');
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
router.post('/', authMiddleware, async (req, res) => {
  try {
    const portfolio = new Portfolio(req.body);
    await portfolio.save();
    
    res.status(201).json({
      message: 'Portfolio item created successfully',
      portfolio
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update portfolio item (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json({
      message: 'Portfolio item updated successfully',
      portfolio
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
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
