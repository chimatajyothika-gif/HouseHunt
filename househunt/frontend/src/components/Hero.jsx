import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Hero = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let minPrice = '';
    let maxPrice = '';

    if (priceRange === 'under-1500') {
      maxPrice = '1500';
    } else if (priceRange === '1500-2500') {
      minPrice = '1500';
      maxPrice = '2500';
    } else if (priceRange === 'above-2500') {
      minPrice = '2500';
    }

    onSearch({ city, type, minPrice, maxPrice });
  };

  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">
          Find Your Perfect <span>Dream Rental</span>
        </h1>
        <p className="hero-subtitle">
          Discover verified listings, schedule direct viewings, and contact landlords instantly on the most transparent rental network.
        </p>

        <form className="search-box" onSubmit={handleSearchSubmit}>
          <div className="search-group">
            <label>Location</label>
            <input 
              type="text" 
              placeholder="e.g. Mumbai, Goa, Bangalore" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="search-group">
            <label>Property Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Any Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
            </select>
          </div>

          <div className="search-group">
            <label>Price Range</label>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
              <option value="">Any Price</option>
              <option value="under-1500">Under $1,500 /mo</option>
              <option value="1500-2500">$1,500 - $2,500 /mo</option>
              <option value="above-2500">Above $2,500 /mo</option>
            </select>
          </div>

          <div className="search-group" style={{ border: 'none' }}>
            <label>Ready</label>
            <div style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>Quick Search</div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ padding: '16px 24px' }}>
            <Search size={18} />
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
