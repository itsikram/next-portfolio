const express = require('express');
const router = express.Router();
const { uploadImage, uploadDocument } = require('../config/cloudinary');
const { authMiddleware } = require('../middleware/auth');

// Upload image
router.post('/image', authMiddleware, uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload document (PDF)
router.post('/document', authMiddleware, uploadDocument.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document file provided' });
    }
    
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload favicon (specifically for .ico files)
router.post('/favicon', authMiddleware, uploadImage.single('favicon'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No favicon file provided' });
    }
    
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete image from Cloudinary
router.delete('/image/:publicId', authMiddleware, async (req, res) => {
  try {
    const { cloudinary } = require('../config/cloudinary');
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete document from Cloudinary
router.delete('/document/:publicId', authMiddleware, async (req, res) => {
  try {
    const { cloudinary } = require('../config/cloudinary');
    await cloudinary.uploader.destroy(req.params.publicId, { resource_type: 'raw' });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
