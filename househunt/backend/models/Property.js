const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a property title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a monthly rental price']
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    zip: {
      type: String
    }
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please add number of bedrooms']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please add number of bathrooms']
  },
  type: {
    type: String,
    required: [true, 'Please add property type'],
    enum: ['Apartment', 'House', 'Villa', 'Condo']
  },
  amenities: [String],
  images: [String],
  status: {
    type: String,
    enum: ['Available', 'Rented'],
    default: 'Available'
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const RealModel = mongoose.model('Property', PropertySchema);
module.exports = new Proxy(RealModel, {
  get: (target, prop) => {
    if (process.env.USE_MOCK_DB === 'true') {
      return require('../mock/PropertyModel')[prop];
    }
    return target[prop];
  }
});
