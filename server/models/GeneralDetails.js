const mongoose = require('mongoose');

const generalDetailsSchema = new mongoose.Schema({
  socialLinks: {
    github: {
      type: String,
      default: "https://github.com/yourusername"
    },
    linkedin: {
      type: String,
      default: "https://linkedin.com/in/yourusername"
    },
    twitter: {
      type: String,
      default: "https://twitter.com/yourusername"
    },
    facebook: {
      type: String,
      default: "https://facebook.com/yourusername"
    },
    instagram: {
      type: String,
      default: "https://instagram.com/yourusername"
    },
    website: {
      type: String,
      default: "https://yourwebsite.com"
    }
  },
  cvDownloadUrl: {
    type: String,
    required: true,
    default: "/Senior Software Developer.pdf"
  },
  sidebarImage: {
    type: String,
    required: true,
    default: "/images/profile.jpg"
  },
  siteDetails: {
    siteName: {
      type: String,
      default: "Portfolio of Md Ikram"
    },
    siteUrl: {
      type: String,
      default: "https://yourportfolio.com"
    },
    logo: {
      type: String,
      default: "/favicon.ico"
    },
    contactEmail: {
      type: String,
      default: "contact@yourportfolio.com"
    },
    phoneNumber: {
      type: String,
      default: "+1234567890"
    },
    location: {
      type: String,
      default: "Your City, Country"
    }
  },
  seoDetails: {
    metaTitle: {
      type: String,
      default: "Portfolio of Md Ikram - Full Stack Developer"
    },
    metaDescription: {
      type: String,
      default: "Full Stack WordPress & MERN Developer with 5+ years of experience crafting exceptional digital experiences"
    },
    metaKeywords: {
      type: [String],
      default: ["Full Stack Developer", "WordPress", "MERN", "React", "Node.js", "MongoDB"]
    },
    ogImage: {
      type: String,
      default: "/images/og-image.jpg"
    },
    twitterHandle: {
      type: String,
      default: "@yourusername"
    },
    googleAnalytics: {
      type: String,
      default: ""
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

generalDetailsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('GeneralDetails', generalDetailsSchema);
