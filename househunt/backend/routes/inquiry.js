const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

// @desc    Send an inquiry for a property
// @route   POST /api/inquiries
// @access  Private (Renter)
router.post('/', protect, async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      property: propertyId,
      sender: req.user._id,
      landlord: property.landlord,
      name,
      email,
      phone,
      message
    });

    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user's inquiries (sent or received depending on role)
// @route   GET /api/inquiries/my-inquiries
// @access  Private
router.get('/my-inquiries', protect, async (req, res) => {
  try {
    let inquiries;

    if (req.user.role === 'landlord') {
      // Landlord sees inquiries received for their properties
      inquiries = await Inquiry.find({ landlord: req.user._id })
        .populate('property', 'title price location')
        .populate('sender', 'username email')
        .sort({ createdAt: -1 });
    } else {
      // Renter sees inquiries they have sent
      inquiries = await Inquiry.find({ sender: req.user._id })
        .populate('property', 'title price location')
        .populate('landlord', 'username email')
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
