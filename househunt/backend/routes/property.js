const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

// @desc    Get all properties with filtering
// @route   GET /api/properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms, bathrooms, search } = req.query;
    let query = {};

    // Apply filters
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    if (bathrooms) {
      query.bathrooms = Number(bathrooms);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(query).populate('landlord', 'username email');
    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get listings created by the logged-in user
// @route   GET /api/properties/my-listings
// @access  Private (Landlord/Agent)
router.get('/my-listings', protect, async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ success: false, message: 'Access denied. Landlords only.' });
    }

    const properties = await Property.find({ landlord: req.user._id });
    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get a single property details
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('landlord', 'username email');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Landlord/Agent)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ success: false, message: 'Access denied. Landlords only.' });
    }

    const { title, description, price, city, address, zip, bedrooms, bathrooms, type, amenities, images } = req.body;

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      location: { city, address, zip },
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      type,
      amenities: amenities || [],
      images: images || [],
      landlord: req.user._id
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a property listing
// @route   PUT /api/properties/:id
// @access  Private (Landlord/Agent owner)
router.put('/:id', protect, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership
    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. Not the listing owner.' });
    }

    // Convert fields to numeric if updated
    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.bedrooms) req.body.bedrooms = Number(req.body.bedrooms);
    if (req.body.bathrooms) req.body.bathrooms = Number(req.body.bathrooms);

    // Update location fields separately if passed as top-level params (handle standard form edits)
    if (req.body.city || req.body.address || req.body.zip) {
      req.body.location = {
        city: req.body.city || property.location.city,
        address: req.body.address || property.location.address,
        zip: req.body.zip || property.location.zip
      };
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a property listing
// @route   DELETE /api/properties/:id
// @access  Private (Landlord/Agent owner)
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership
    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. Not the listing owner.' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property listing removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
