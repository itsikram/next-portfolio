const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  deliverables: [{
    type: String,
    trim: true
  }],
  timeline: {
    type: String,
    default: '2-4 weeks'
  },
  maintenance: {
    type: String,
    default: '3 months included support'
  },
  support: {
    type: String,
    default: 'Comprehensive support included with all projects'
  },
  category: {
    type: String,
    enum: ['web-development', 'mobile-development', 'ui-ux-design', 'backend-development', 'full-stack', 'consulting', 'optimization', 'other'],
    default: 'web-development'
  },
  pricing: {
    type: String,
    enum: ['fixed', 'hourly', 'project'],
    default: 'project'
  },
  price: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
