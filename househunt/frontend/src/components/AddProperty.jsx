import React, { useState } from 'react';
import { Home, DollarSign, MapPin, AlignLeft, Info, Plus } from 'lucide-react';

const AMENITY_OPTIONS = [
  'Wifi', 'Air Conditioning', 'Gym', 'Swimming Pool', 
  'Parking', '24/7 Security', 'Elevator', 'Terrace', 
  'Garden', 'Beach Access', 'Kitchen', 'Pet Friendly', 
  'Garage', 'Laundry Room'
];

const AddProperty = ({ setActiveTab, showNotification }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [type, setType] = useState('Apartment');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Set default image if user hasn't added one
      const finalImage = imageUrl.trim() !== '' 
        ? [imageUrl.trim()] 
        : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'];

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          price,
          city,
          address,
          zip,
          bedrooms,
          bathrooms,
          type,
          amenities: selectedAmenities,
          images: finalImage
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification('Property listed successfully!', 'success');
        // Clear Form
        setTitle('');
        setDescription('');
        setPrice('');
        setCity('');
        setAddress('');
        setZip('');
        setSelectedAmenities([]);
        setImageUrl('');
        // Navigate
        setActiveTab('home');
      } else {
        showNotification(data.message || 'Failed to submit property', 'error');
      }
    } catch (err) {
      showNotification('Server communication failure. Please check server console.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setTitle('Spacious Penthouse with Ocean View');
    setDescription('Indulge in coastal elegance. This stunning luxury penthouse features state-of-the-art marble bathrooms, custom walnut cabinetry, private hot tub on the terrace, and unobstructed sunrise views over the shoreline.');
    setPrice('4200');
    setCity('Goa');
    setAddress('90 Beachside Crescent, Candolim');
    setZip('403515');
    setBedrooms('3');
    setBathrooms('3');
    setType('Villa');
    setSelectedAmenities(['Wifi', 'Air Conditioning', 'Swimming Pool', 'Parking', 'Terrace', 'Beach Access', 'Kitchen', 'Pet Friendly']);
    setImageUrl('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80');
  };

  return (
    <section className="container" style={{ padding: '60px 24px' }}>
      <div className="dashboard-pane" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '24px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={24} style={{ color: 'var(--primary)' }} />
            List Your Property
          </h2>
          <button 
            type="button" 
            className="btn btn-outline btn-sm"
            onClick={handleFillDemo}
            style={{ fontSize: '11px' }}
          >
            Auto-Fill Sample Data
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-property-form">
          <div className="form-group form-full-width">
            <label>Listing Title</label>
            <input 
              type="text" 
              required 
              className="form-input" 
              placeholder="e.g. Modern Cozy Apartment near Downtown"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group form-full-width">
            <label>Description</label>
            <textarea 
              rows="4" 
              required 
              className="form-input" 
              placeholder="Provide a comprehensive description of the property, local attractions, rules, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'none' }}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Property Type</label>
            <select 
              className="form-input" 
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monthly Rental Price ($)</label>
            <input 
              type="number" 
              required 
              className="form-input" 
              placeholder="e.g. 1800"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Bedrooms</label>
            <select 
              className="form-input"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>

          <div className="form-group">
            <label>Bathrooms</label>
            <select 
              className="form-input"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            >
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              <option value="3">3+ Bathrooms</option>
            </select>
          </div>

          <div className="form-group form-full-width">
            <label>Street Address</label>
            <input 
              type="text" 
              required 
              className="form-input" 
              placeholder="e.g. 104 Park Avenue"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input 
              type="text" 
              required 
              className="form-input" 
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>ZIP / Postal Code</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 400001"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>

          <div className="form-group form-full-width">
            <label>Image URL (Optional)</label>
            <input 
              type="url" 
              className="form-input" 
              placeholder="Paste a direct image URL (Unsplash, Imgur, etc.)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="form-group form-full-width" style={{ marginTop: '10px' }}>
            <label style={{ marginBottom: '12px', display: 'block' }}>Key Amenities & Specifications</label>
            <div className="checkbox-group">
              {AMENITY_OPTIONS.map((amenity, index) => (
                <label key={index} className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => setActiveTab('home')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProperty;
