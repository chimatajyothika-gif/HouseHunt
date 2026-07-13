import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { SlidersHorizontal, MapPin } from 'lucide-react';

const PropertyList = ({ user, savedProperties, onSaveToggle, onSelect, filterParams, clearSearchFilters }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [search, setSearch] = useState('');

  // Handle outside quick-search triggers from Hero banner
  useEffect(() => {
    if (filterParams) {
      if (filterParams.city !== undefined) setCity(filterParams.city);
      if (filterParams.type !== undefined) setType(filterParams.type);
      if (filterParams.minPrice !== undefined) setMinPrice(filterParams.minPrice);
      if (filterParams.maxPrice !== undefined) setMaxPrice(filterParams.maxPrice);
      fetchFilteredProperties(filterParams);
    } else {
      fetchFilteredProperties();
    }
  }, [filterParams]);

  const fetchFilteredProperties = async (params = null) => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();

      if (params) {
        if (params.city) queryParams.append('city', params.city);
        if (params.type) queryParams.append('type', params.type);
        if (params.minPrice) queryParams.append('minPrice', params.minPrice);
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
        if (params.bedrooms) queryParams.append('bedrooms', params.bedrooms);
        if (params.bathrooms) queryParams.append('bathrooms', params.bathrooms);
        if (params.search) queryParams.append('search', params.search);
      } else {
        if (city) queryParams.append('city', city);
        if (type) queryParams.append('type', type);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (bedrooms) queryParams.append('bedrooms', bedrooms);
        if (bathrooms) queryParams.append('bathrooms', bathrooms);
        if (search) queryParams.append('search', search);
      }

      const res = await fetch(`/api/properties?${queryParams.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProperties(data.properties);
      } else {
        setError(data.message || 'Failed to load properties');
      }
    } catch (err) {
      setError('Could not connect to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProperties();
  };

  const handleResetFilters = () => {
    setCity('');
    setType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setBathrooms('');
    setSearch('');
    clearSearchFilters();
    setLoading(true);
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProperties(data.properties);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const checkIsSaved = (propertyId) => {
    if (!savedProperties) return false;
    return savedProperties.some(p => p === propertyId || p._id === propertyId);
  };

  return (
    <section className="listings-section">
      <div className="container">
        <div className="section-header">
          <div className="section-info">
            <h2>Available Listings</h2>
            <p>Browse from our curation of premium rental options</p>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Found <strong style={{ color: '#fff' }}>{properties.length}</strong> properties
          </div>
        </div>

        <div className="layout-grid">
          {/* Filter Sidebar */}
          <aside className="filter-sidebar">
            <h3 className="filter-title">
              <SlidersHorizontal size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
              Filters
            </h3>
            <form onSubmit={handleFilterSubmit}>
              <div className="filter-group">
                <label>Keywords</label>
                <input 
                  type="text" 
                  placeholder="e.g. pool, balcony, luxury" 
                  className="filter-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>City</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mumbai" 
                  className="filter-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Property Type</label>
                <select 
                  className="filter-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <div className="filter-range">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="filter-input"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="range-span">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="filter-input"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Bedrooms</label>
                <select 
                  className="filter-input"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Bathrooms</label>
                <select 
                  className="filter-input"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1 Bath</option>
                  <option value="2">2 Baths</option>
                  <option value="3">3+ Baths</option>
                </select>
              </div>

              <button className="btn btn-primary" type="submit" style={{ width: '100%', marginBottom: '10px' }}>
                Apply Filters
              </button>
              <button 
                className="btn btn-outline" 
                type="button" 
                style={{ width: '100%' }}
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </form>
          </aside>

          {/* Listings Display Grid */}
          <main className="properties-display">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
                Loading listings...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : error ? (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '20px', borderRadius: '8px', color: 'var(--danger)', textAlign: 'center' }}>
                {error}
              </div>
            ) : properties.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
                <MapPin size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h3 style={{ color: '#fff', marginBottom: '8px' }}>No Listings Found</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                  We couldn't find any listings matching your criteria. Try adjusting filters or searching a different city.
                </p>
              </div>
            ) : (
              <div className="properties-grid">
                {properties.map(property => (
                  <PropertyCard 
                    key={property._id}
                    property={property}
                    user={user}
                    onSaveToggle={onSaveToggle}
                    isSaved={checkIsSaved(property._id)}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default PropertyList;
