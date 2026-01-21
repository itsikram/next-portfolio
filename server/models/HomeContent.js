const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: "Hi, I'm Md Ikram"
    },
    subtitle: {
      type: String,
      required: true,
      default: "Full Stack Developer"
    },
    description: {
      type: String,
      required: true,
      default: "Crafting exceptional digital experiences with clean code and pixel-perfect design. Specialized in WordPress, MERN stack, and creating interactive web applications that drive business growth."
    },
    profileImage: {
      type: String,
      required: true,
      default: "/images/profile.jpg"
    }
  },
  stats: [{
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }],
  ctaButtons: [{
    text: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['primary', 'secondary'],
      default: 'primary'
    },
    isDownload: {
      type: Boolean,
      default: false
    }
  }],
  seo: {
    title: {
      type: String,
      default: "Home - Portfolio of Md Ikram"
    },
    description: {
      type: String,
      default: "Full Stack WordPress & MERN Developer with 5+ years of experience"
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

homeContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HomeContent', homeContentSchema);
