import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, BedDouble, Bath, Heart, Mail, Phone, Calendar, Info, ShieldCheck, Video } from 'lucide-react';

const PropertyDetail = ({ propertyId, user, savedProperties, onSaveToggle, onBack, setAuthView, showNotification }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inquiry Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('Hello, I am interested in this rental and would like to schedule a viewing.');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Virtual Tour State
  const [showTour, setShowTour] = useState(false);
  const [tourPanned, setTourPanned] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  useEffect(() => {
    if (user) {
      setName(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const fetchPropertyDetails = async () => {
    try {
      const res = await fetch(`/api/properties/${propertyId}`);
      const data = await res.json();
      if (data.success) {
        setProperty(data.property);
      } else {
        setError(data.message || 'Failed to load details');
      }
    } catch (err) {
      setError('Connection failure');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthView('login');
      return;
    }

    setSubmittingInquiry(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          name,
          email,
          phone,
          message
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification('Inquiry sent successfully! The landlord will contact you soon.', 'success');
        setMessage('Hello, I am interested in this rental and would like to schedule a viewing.');
      } else {
        showNotification(data.message || 'Failed to send inquiry', 'error');
      }
    } catch (err) {
      showNotification('Could not send inquiry. Please try again.', 'error');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const isSaved = () => {
    if (!savedProperties || !property) return false;
    return savedProperties.some(p => p === property._id || p._id === property._id);
  };

  const handleSaveClick = () => {
    if (!user) {
      setAuthView('login');
      return;
    }
    onSaveToggle(property._id);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
        Loading property details...
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <button onClick={onBack} className="detail-back-btn">
          <ArrowLeft size={16} /> Back to Search
        </button>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '20px', borderRadius: '8px', color: 'var(--danger)' }}>
          {error || 'Property not found.'}
        </div>
      </div>
    );
  }

  const { title, description, price, location, bedrooms, bathrooms, type, amenities, images, landlord } = property;
  const mainImage = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';
  const sideImage1 = images && images.length > 1 ? images[1] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
  const sideImage2 = images && images.length > 2 ? images[2] : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="detail-layout">
      <div className="container">
        <button onClick={onBack} className="detail-back-btn">
          <ArrowLeft size={16} /> Back to Listings
        </button>

        <div className="detail-header">
          <div className="detail-header-main">
            <div>
              <h1 className="detail-title">{title}</h1>
              <div className="card-location" style={{ fontSize: '15px' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                <span>{location.address}, {location.city} {location.zip}</span>
              </div>
            </div>
            <div className="detail-price">
              ${price.toLocaleString()}<span>/month</span>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '4px' }}>
                Deposit: 1 Month Rent
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="detail-gallery">
          <img src={mainImage} alt={title} className="gallery-main" />
          <div className="gallery-side">
            <img src={sideImage1} alt="Thumbnail 1" className="gallery-thumb" />
            <img src={sideImage2} alt="Thumbnail 2" className="gallery-thumb" />
          </div>
        </div>

        <div className="detail-content-wrapper">
          {/* Main Info */}
          <div>
            {/* Core Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Type</div>
                <strong style={{ color: '#fff', fontSize: '16px' }}>{type}</strong>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Bedrooms</div>
                <strong style={{ color: '#fff', fontSize: '16px' }}>{bedrooms} BHK</strong>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Bathrooms</div>
                <strong style={{ color: '#fff', fontSize: '16px' }}>{bathrooms} Bath</strong>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
                <strong style={{ color: 'var(--secondary)', fontSize: '16px' }}>{property.status}</strong>
              </div>
            </div>

            {/* Description */}
            <div className="detail-info-block">
              <h3 className="block-title">
                <Info size={18} /> Description
              </h3>
              <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{description}</p>
            </div>

            {/* Amenities */}
            <div className="detail-info-block">
              <h3 className="block-title">
                <ShieldCheck size={18} /> Key Amenities
              </h3>
              <div className="amenities-list">
                {amenities && amenities.length > 0 ? (
                  amenities.map((amenity, idx) => (
                    <div key={idx} className="amenity-tag">
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-muted)' }}>Standard household amenities included.</div>
                )}
              </div>
            </div>

            {/* Simulated Virtual Tour (Wow Factor!) */}
            <div className="detail-info-block">
              <h3 className="block-title">
                <Video size={18} /> Interactive Virtual Tour (Simulated)
              </h3>
              <div className="tour-sim">
                <img 
                  src={mainImage} 
                  alt="Tour Frame" 
                  className="tour-bg" 
                  style={{
                    transform: tourPanned ? 'scale(1.2) translateX(-40px)' : 'scale(1.0) translateX(0)',
                    transition: 'transform 8s ease-in-out'
                  }}
                />
                {!showTour ? (
                  <div className="tour-overlay">
                    <h3>Explore this property in 3D</h3>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowTour(true);
                        setTourPanned(true);
                        // Loop movement
                        setTimeout(() => setTourPanned(false), 8000);
                      }}
                    >
                      <Video size={16} /> Start 3D Tour
                    </button>
                  </div>
                ) : (
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(0,0,0,0.7)', padding: '10px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                      Currently viewing: Living Room / Suite 360° Panning
                    </span>
                    <button 
                      className="btn btn-outline btn-sm" 
                      onClick={() => {
                        setShowTour(false);
                        setTourPanned(false);
                      }}
                      style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 10px', fontSize: '11px' }}
                    >
                      Exit Tour
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Inquiry Form */}
          <aside className="inquiry-sidebar">
            {user && user.role === 'landlord' && user._id === landlord._id ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <h3 style={{ color: '#fff', marginBottom: '12px' }}>Manage Listing</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                  This is your listing. Prospective renters will send inquiries here.
                </p>
                <div style={{ padding: '16px', border: '1px dashed var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Check the <strong>Dashboard</strong> to read received renter inquiries.
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>Request Details</h3>
                <form className="inquiry-form" onSubmit={handleInquirySubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      className="form-input"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      className="form-input"
                      placeholder="Your Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Message</label>
                    <textarea 
                      rows="4" 
                      required
                      className="form-input"
                      style={{ resize: 'none' }}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>

                  <button 
                    className="btn btn-secondary" 
                    type="submit" 
                    style={{ width: '100%' }}
                    disabled={submittingInquiry}
                  >
                    <Mail size={16} />
                    {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                  </button>

                  {user && user.role === 'renter' && (
                    <button 
                      className={`btn btn-outline ${isSaved() ? 'btn-danger' : ''}`}
                      type="button" 
                      style={{ width: '100%', gap: '8px' }}
                      onClick={handleSaveClick}
                    >
                      <Heart size={16} fill={isSaved() ? 'currentColor' : 'none'} />
                      {isSaved() ? 'Saved in shortlists' : 'Save listing to shortlist'}
                    </button>
                  )}

                  {!user && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
                      Please <strong style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setAuthView('login')}>Sign In</strong> to toggle saved listings.
                    </div>
                  )}
                </form>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PropertyDetail;
