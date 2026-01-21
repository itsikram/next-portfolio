const express = require('express');
const Blog = require('../models/Blog');
const { authMiddleware } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, published, featured } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (published !== undefined) filter.published = published === 'true';
    if (featured === 'true') filter.featured = true;

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      console.log('blogs',blogs,filter)

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog (protected)
router.post('/', authMiddleware, upload.single('coverImage'), async (req, res) => {
  try {
    const blogData = { ...req.body };
    
    // Parse published if it's a string
    if (blogData.published && typeof blogData.published === 'string') {
      blogData.published = blogData.published === 'true';
    }
    
    // Parse featured if it's a string
    if (blogData.featured && typeof blogData.featured === 'string') {
      blogData.featured = blogData.featured === 'true';
    }
    
    // If an coverImage was uploaded, add its URL to the blog data
    if (req.file) {
      blogData.coverImage = req.file.path;
    }

    const blog = new Blog(blogData);
    await blog.save();
    
    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    // If there was an error and a file was uploaded, try to delete it from Cloudinary
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded coverImage:', cleanupError);
      }
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog (protected)
router.put('/:id', authMiddleware, upload.single('coverImage'), async (req, res) => {
  try {
    const blogData = { ...req.body };
    
    // Parse published if it's a string
    if (blogData.published && typeof blogData.published === 'string') {
      blogData.published = blogData.published === 'true';
    }
    
    // Parse featured if it's a string
    if (blogData.featured && typeof blogData.featured === 'string') {
      blogData.featured = blogData.featured === 'true';
    }
    
    // If an coverImage was uploaded, add its URL to the blog data
    if (req.file) {
      blogData.coverImage = req.file.path;
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      blogData,
      { new: true, runValidators: true }
    );

    if (!blog) {
      // If blog not found and a file was uploaded, delete it from Cloudinary
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded coverImage:', cleanupError);
        }
      }
      return res.status(404).json({ message: 'Blog not found' });
    }

    // If a new coverImage was uploaded and there was an old coverImage, delete the old one
    if (req.file && blog.coverImage) {
      try {
        // Extract public_id from the old Cloudinary URL
        const urlParts = blog.coverImage.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `blogs/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cleanupError) {
        console.error('Failed to delete old coverImage from Cloudinary:', cleanupError);
      }
    }

    res.json({
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    // If there was an error and a file was uploaded, try to delete it from Cloudinary
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded coverImage:', cleanupError);
      }
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete the coverImage from Cloudinary if it exists
    if (blog.coverImage) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = blog.coverImage.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `blogs/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cleanupError) {
        console.error('Failed to delete coverImage from Cloudinary:', cleanupError);
      }
    }

    res.json({
      message: 'Blog deleted successfully',
      blog
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
