const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a contact name']
  },
  email: {
    type: String,
    required: [true, 'Please add a contact email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String
  },
  message: {
    type: String,
    required: [true, 'Please add your message']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RealModel = mongoose.model('Inquiry', InquirySchema);
module.exports = new Proxy(RealModel, {
  get: (target, prop) => {
    if (process.env.USE_MOCK_DB === 'true') {
      return require('../mock/InquiryModel')[prop];
    }
    return target[prop];
  }
});
