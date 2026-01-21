const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    default: "Present"
  },
  description: {
    type: String,
    required: true
  },
  isCurrentJob: {
    type: Boolean,
    default: false
  }
});

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const resumeContentSchema = new mongoose.Schema({
  skills: [skillSchema],
  experience: [experienceSchema],
  education: [educationSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

resumeContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ResumeContent', resumeContentSchema);
