const mongoose = require('mongoose');

const processStepSchema = new mongoose.Schema({
  step: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
});

const processContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Process'
  },
  subtitle: {
    type: String,
    trim: true
  },
  steps: [processStepSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

processContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Sort steps by order field
  if (this.steps) {
    this.steps.sort((a, b) => a.order - b.order);
  }
  
  next();
});

module.exports = mongoose.model('ProcessContent', processContentSchema);
