const express = require('express');
const Service = require('../models/Service');
const { authMiddleware } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, featured } = req.query;
    const filter = {};
    
    if (featured === 'true') filter.featured = true;

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments(filter);

    res.json({
      services,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service (protected)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const serviceData = { ...req.body };
    
    // Parse featured if it's a string
    if (serviceData.featured && typeof serviceData.featured === 'string') {
      serviceData.featured = serviceData.featured === 'true';
    }
    
    // If an image was uploaded, add its URL to the service data
    if (req.file) {
      serviceData.image = req.file.path;
    }

    const service = new Service(serviceData);
    await service.save();
    
    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
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

// Update service (protected)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const serviceData = { ...req.body };
    
    // Parse featured if it's a string
    if (serviceData.featured && typeof serviceData.featured === 'string') {
      serviceData.featured = serviceData.featured === 'true';
    }
    
    // If an image was uploaded, add its URL to the service data
    if (req.file) {
      serviceData.image = req.file.path;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      serviceData,
      { new: true, runValidators: true }
    );

    if (!service) {
      // If service not found and a file was uploaded, delete it from Cloudinary
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded image:', cleanupError);
        }
      }
      return res.status(404).json({ message: 'Service not found' });
    }

    // If a new image was uploaded and there was an old image, delete the old one
    if (req.file && service.image) {
      try {
        // Extract public_id from the old Cloudinary URL
        const urlParts = service.image.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `services/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cleanupError) {
        console.error('Failed to delete old image from Cloudinary:', cleanupError);
      }
    }

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
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

// Delete service (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Delete the image from Cloudinary if it exists
    if (service.image) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = service.image.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `services/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cleanupError) {
        console.error('Failed to delete image from Cloudinary:', cleanupError);
      }
    }

    res.json({
      message: 'Service deleted successfully',
      service
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
