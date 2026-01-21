const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  personalInfo: {
    emails: [{
      type: String,
      required: true
    }],
    phones: [{
      type: String,
      required: true
    }],
    addresses: [{
      type: String,
      required: true
    }]
  },
  socialLinks: [{
    platform: {
      type: String,
      required: true,
      enum: ['github', 'linkedin', 'twitter', 'facebook', 'instagram', 'other']
    },
    url: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    }
  }],
  contactForm: {
    recipientEmail: {
      type: String,
      required: true,
      default: "mdikram295@gmail.com"
    },
    notificationEmail: {
      type: String,
      required: true,
      default: "mdikram295@gmail.com"
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

contactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Contact', contactSchema);
