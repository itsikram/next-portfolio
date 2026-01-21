const express = require('express');
const ProcessContent = require('../models/ProcessContent');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get process content (public)
router.get('/', async (req, res) => {
  try {
    let processContent = await ProcessContent.findOne().sort({ createdAt: -1 });
    
    // If no process content exists, create default content
    if (!processContent) {
      processContent = new ProcessContent({
        title: 'Process',
        subtitle: 'How we work together',
        steps: [
          {
            step: '01',
            title: 'Discovery & Planning',
            description: 'Understanding your requirements and creating a detailed project plan.',
            order: 0
          },
          {
            step: '02',
            title: 'Design & Development',
            description: 'Creating designs and developing the solution with regular updates.',
            order: 1
          },
          {
            step: '03',
            title: 'Testing & Quality Assurance',
            description: 'Thorough testing to ensure everything works perfectly.',
            order: 2
          },
          {
            step: '04',
            title: 'Deployment & Support',
            description: 'Launching the project and providing ongoing support.',
            order: 3
          }
        ]
      });
      await processContent.save();
    }
    
    res.json(processContent);
  } catch (error) {
    console.error('Get process content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update process content (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, steps } = req.body;
    
    // Validate required fields
    if (!title || !steps || !Array.isArray(steps)) {
      return res.status(400).json({ message: 'Title and steps array are required' });
    }
    
    // Validate each step
    for (const step of steps) {
      if (!step.step || !step.title || !step.description) {
        return res.status(400).json({ message: 'Each step must have step, title, and description' });
      }
    }
    
    // Remove any existing process content (we only want one)
    await ProcessContent.deleteMany({});
    
    // Create new process content
    const processContent = new ProcessContent({
      title,
      subtitle,
      steps: steps.map((step, index) => ({
        ...step,
        order: step.order !== undefined ? step.order : index
      }))
    });
    
    await processContent.save();
    
    res.status(201).json({
      message: 'Process content created successfully',
      processContent
    });
  } catch (error) {
    console.error('Create process content error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update process content (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, steps } = req.body;
    
    // Validate required fields
    if (!title || !steps || !Array.isArray(steps)) {
      return res.status(400).json({ message: 'Title and steps array are required' });
    }
    
    // Validate each step
    for (const step of steps) {
      if (!step.step || !step.title || !step.description) {
        return res.status(400).json({ message: 'Each step must have step, title, and description' });
      }
    }
    
    const processContent = await ProcessContent.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        steps: steps.map((step, index) => ({
          ...step,
          order: step.order !== undefined ? step.order : index
        }))
      },
      { new: true, runValidators: true }
    );

    if (!processContent) {
      return res.status(404).json({ message: 'Process content not found' });
    }

    res.json({
      message: 'Process content updated successfully',
      processContent
    });
  } catch (error) {
    console.error('Update process content error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete process content (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const processContent = await ProcessContent.findByIdAndDelete(req.params.id);

    if (!processContent) {
      return res.status(404).json({ message: 'Process content not found' });
    }

    res.json({
      message: 'Process content deleted successfully',
      processContent
    });
  } catch (error) {
    console.error('Delete process content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
