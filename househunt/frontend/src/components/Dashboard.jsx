import React, { useState, useEffect } from 'react';
import { Home, Mail, Heart, Trash2, Edit, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import PropertyCard from './PropertyCard';

const Dashboard = ({ user, savedProperties, onSaveToggle, onSelect, showNotification }) => {
  const [activeTab, setActiveTab] = useState(user.role === 'landlord' ? 'listings' : 'saved');
  
  // Data States
  const [myListings, setMyListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Edit states for Landlord listings
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab, refreshTrigger]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      if (activeTab === 'listings' && user.role === 'landlord') {
        const res = await fetch('/api/properties/my-listings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setMyListings(data.properties);
      } else if (activeTab === 'inquiries') {
        const res = await fetch('/api/inquiries/my-inquiries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        showNotification('Listing removed successfully', 'success');
        setRefreshTrigger(prev => prev + 1);
      } else {
        showNotification(data.message || 'Failed to delete listing', 'error');
      }
    } catch (err) {
      showNotification('Error deleting listing', 'error');
    }
  };

  const handleUpdatePriceSubmit = async (e, id) => {
    e.preventDefault();
    if (!editPrice || isNaN(editPrice)) {
      showNotification('Please enter a valid price', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ price: Number(editPrice) })
      });
      const data = await res.json();

      if (data.success) {
        showNotification('Price updated successfully!', 'success');
        setEditingPropertyId(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        showNotification(data.message || 'Failed to update price', 'error');
      }
    } catch (err) {
      showNotification('Error updating price', 'error');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Rented' : 'Available';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();

      if (data.success) {
        showNotification(`Listing status updated to ${nextStatus}`, 'success');
        setRefreshTrigger(prev => prev + 1);
      } else {
        showNotification(data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      showNotification('Error updating status', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="container dashboard">
      <div className="dashboard-header">
        <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '8px' }}>User Portal</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your listings, view inquiries, and shortlists as a <strong>{user.role}</strong>
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar Nav */}
        <nav className="dashboard-tabs">
          {user.role === 'landlord' ? (
            <>
              <button 
                className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
                onClick={() => setActiveTab('listings')}
              >
                <Home size={18} />
                My Listings
              </button>
              <button 
                className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
                onClick={() => setActiveTab('inquiries')}
              >
                <Mail size={18} />
                Received Inquiries
              </button>
            </>
          ) : (
            <>
              <button 
                className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <Heart size={18} />
                Saved Shortlists
              </button>
              <button 
                className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
                onClick={() => setActiveTab('inquiries')}
              >
                <Mail size={18} />
                Sent Inquiries
              </button>
            </>
          )}
        </nav>

        {/* Content Pane */}
        <main className="dashboard-pane">
          {activeTab === 'listings' && user.role === 'landlord' && (
            <div>
              <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '20px' }}>Your Property Portals</h2>
              {loading ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading listings...</div>
              ) : myListings.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                  You have not published any listings yet.
                </div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>City</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myListings.map(listing => (
                        <tr key={listing._id}>
                          <td>
                            <span 
                              onClick={() => onSelect(listing._id)} 
                              style={{ color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              {listing.title}
                              <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {listing.bedrooms} BHK | {listing.type}
                            </span>
                          </td>
                          <td>{listing.location.city}</td>
                          <td>
                            {editingPropertyId === listing._id ? (
                              <form 
                                onSubmit={(e) => handleUpdatePriceSubmit(e, listing._id)}
                                style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
                              >
                                <input 
                                  type="number" 
                                  className="form-input" 
                                  style={{ width: '80px', padding: '4px 8px', fontSize: '13px' }}
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  autoFocus
                                />
                                <button className="btn btn-secondary btn-sm" type="submit" style={{ padding: '4px 8px' }}>Save</button>
                                <button 
                                  className="btn btn-outline btn-sm" 
                                  type="button" 
                                  style={{ padding: '4px 8px' }}
                                  onClick={() => setEditingPropertyId(null)}
                                >
                                  Cancel
                                </button>
                              </form>
                            ) : (
                              <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                                ${listing.price.toLocaleString()}/mo
                              </span>
                            )}
                          </td>
                          <td>
                            <button 
                              className={`status-pill ${listing.status === 'Available' ? 'available' : 'rented'}`}
                              onClick={() => handleStatusToggle(listing._id, listing.status)}
                              title="Click to toggle status"
                              style={{ border: 'none', cursor: 'pointer' }}
                            >
                              {listing.status}
                            </button>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button 
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                  setEditingPropertyId(listing._id);
                                  setEditPrice(listing.price.toString());
                                }}
                                title="Edit Price"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                className="btn btn-outline btn-sm"
                                style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                                onClick={() => handleDeleteListing(listing._id)}
                                title="Delete Listing"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && user.role === 'renter' && (
            <div>
              <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '20px' }}>Your Saved Shortlists</h2>
              {savedProperties.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                  No saved listings yet. Explore the home page to save homes!
                </div>
              ) : (
                <div className="properties-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                  {savedProperties.map(property => (
                    <PropertyCard 
                      key={property._id}
                      property={property}
                      user={user}
                      onSaveToggle={onSaveToggle}
                      isSaved={true}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div>
              <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '20px' }}>
                {user.role === 'landlord' ? 'Received Renter Inquiries' : 'Your Sent Inquiries'}
              </h2>
              {loading ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading inquiries...</div>
              ) : inquiries.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                  No inquiry logs found.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {inquiries.map(inquiry => (
                    <div 
                      key={inquiry._id} 
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <strong style={{ color: '#fff' }}>
                            {user.role === 'landlord' ? `From: ${inquiry.name}` : `For Landlord: ${inquiry.landlord?.email || 'N/A'}`}
                          </strong>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {inquiry.email} {inquiry.phone && `| Phone: ${inquiry.phone}`}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span 
                            onClick={() => inquiry.property && onSelect(inquiry.property._id)}
                            style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', display: 'block' }}
                          >
                            {inquiry.property ? inquiry.property.title : 'Deleted Property'}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {formatDate(inquiry.createdAt || new Date())}
                          </span>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-main)', fontSize: '13px', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
                        "{inquiry.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
