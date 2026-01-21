const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      default: "Md Ikram"
    },
    dateOfBirth: {
      type: String,
      required: true,
      default: "16/07/2003"
    },
    age: {
      type: String,
      required: true,
      default: "22 Years"
    },
    nationality: {
      type: String,
      required: true,
      default: "Bangladeshi"
    },
    experience: {
      type: String,
      required: true,
      default: "5+ Years"
    },
    languages: {
      type: String,
      required: true,
      default: "English, Bengali"
    },
    address: {
      type: String,
      required: true,
      default: "Biler Kani, Munshiganj, Bangladesh"
    },
    mobile: {
      type: String,
      required: true,
      default: "+8801581400711"
    },
    email: {
      type: String,
      required: true,
      default: "mdikram295@gmail.com"
    },
    freelance: {
      type: String,
      required: true,
      default: "Available"
    },
    profileImage: {
      type: String,
      required: true,
      default: "/images/profile.jpg"
    },
    description: {
      type: String,
      required: true,
      default: "Full Stack WordPress & MERN Developer with 5+ years of experience delivering high-performance websites and scalable applications for global clients. Specialized in custom WordPress architecture, React-based interfaces, and performance optimization with a strong focus on user experience and business growth."
    }
  },
  services: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }],
  reviews: [{
    text: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    }
  }],
  technicalSkills: {
    frontend: [String],
    backend: [String],
    database: [String],
    tools: [String]
  },
  keyStrengths: [String],
  cvDownloadUrl: {
    type: String,
    required: true,
    default: "/Senior Software Developer.pdf"
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

aboutContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);
