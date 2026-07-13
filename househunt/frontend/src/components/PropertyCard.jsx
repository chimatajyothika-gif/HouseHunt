import React from 'react';
import { Heart, MapPin, BedDouble, Bath, ArrowRight } from 'lucide-react';

const PropertyCard = ({ property, user, onSaveToggle, isSaved, onSelect }) => {
  const { _id, title, price, location, bedrooms, bathrooms, type, images } = property;
  const mainImage = images && images.length > 0 
    ? images[0] 
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSaveToggle) {
      onSaveToggle(_id);
    }
  };

  return (
    <div className="property-card" onClick={() => onSelect(_id)} style={{ cursor: 'pointer' }}>
      <div className="card-image-wrapper">
        <img src={mainImage} alt={title} className="card-image" />
        <span className="card-badge">{type}</span>
        {user && user.role === 'renter' && (
          <button 
            className={`card-save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveClick}
            title={isSaved ? 'Remove from saved' : 'Save Property'}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="card-content">
        <div className="card-price">
          ${price.toLocaleString()}<span>/month</span>
        </div>
        <h3 className="card-title" title={title}>{title}</h3>
        <div className="card-location">
          <MapPin size={14} />
          <span>{location.address}, {location.city}</span>
        </div>

        <div className="card-stats">
          <div className="stat-item">
            <BedDouble size={16} />
            <span>{bedrooms} Bed{bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="stat-item">
            <Bath size={16} />
            <span>{bathrooms} Bath{bathrooms !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="card-footer">
          <span className="card-tag">Verified Listing</span>
          <span className="nav-link" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Details
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
