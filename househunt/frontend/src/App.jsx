import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyList from './components/PropertyList';
import PropertyDetail from './components/PropertyDetail';
import AddProperty from './components/AddProperty';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';

const App = () => {
  const [user, setUser] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('home'); // home, add-property, dashboard, detail
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [authView, setAuthView] = useState(null); // null, login, register
  const [filterParams, setFilterParams] = useState(null);

  // Notification Banner
  const [notification, setNotification] = useState(null);

  // Load User Profile on Startup
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setSavedProperties(data.user.savedProperties || []);
      } else {
        // Token invalid, clear it
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setSavedProperties(userData.savedProperties || []);
    setAuthView(null);
    setActiveTab('home');
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setSavedProperties(userData.savedProperties || []);
    setAuthView(null);
    setActiveTab('home');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSavedProperties([]);
    setActiveTab('home');
    showNotification('Logged out successfully', 'success');
  };

  const handleSaveToggle = async (propertyId) => {
    if (!user) {
      setAuthView('login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/auth/save/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        if (data.isSaved) {
          showNotification('Property added to saved shortlists', 'success');
        } else {
          showNotification('Property removed from saved shortlists', 'success');
        }
        
        // Reload user profile to fetch complete populated saved properties
        loadUserProfile();
      } else {
        showNotification(data.message || 'Failed to update shortlists', 'error');
      }
    } catch (err) {
      showNotification('Error contacting server', 'error');
    }
  };

  const handleSelectProperty = (id) => {
    setSelectedPropertyId(id);
    setActiveTab('detail');
  };

  const handleQuickSearch = (params) => {
    setFilterParams(params);
    setActiveTab('home');
  };

  const clearSearchFilters = () => {
    setFilterParams(null);
  };

  // Nav views rendering orchestrator
  const renderMainContent = () => {
    if (authView === 'login') {
      return (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          setAuthView={setAuthView}
          showNotification={showNotification}
        />
      );
    }

    if (authView === 'register') {
      return (
        <Register 
          onRegisterSuccess={handleRegisterSuccess}
          setAuthView={setAuthView}
          showNotification={showNotification}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <>
            <Hero onSearch={handleQuickSearch} />
            <PropertyList 
              user={user}
              savedProperties={savedProperties}
              onSaveToggle={handleSaveToggle}
              onSelect={handleSelectProperty}
              filterParams={filterParams}
              clearSearchFilters={clearSearchFilters}
            />
          </>
        );
      case 'detail':
        return (
          <PropertyDetail 
            propertyId={selectedPropertyId}
            user={user}
            savedProperties={savedProperties}
            onSaveToggle={handleSaveToggle}
            onBack={() => setActiveTab('home')}
            setAuthView={setAuthView}
            showNotification={showNotification}
          />
        );
      case 'add-property':
        return (
          <AddProperty 
            setActiveTab={setActiveTab}
            showNotification={showNotification}
          />
        );
      case 'dashboard':
        return user ? (
          <Dashboard 
            user={user}
            savedProperties={savedProperties}
            onSaveToggle={handleSaveToggle}
            onSelect={handleSelectProperty}
            showNotification={showNotification}
          />
        ) : (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            setAuthView={setAuthView}
            showNotification={showNotification}
          />
        );
      default:
        return <Hero onSearch={handleQuickSearch} />;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <Navbar 
        user={user}
        logout={logout}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setAuthView(null);
          setActiveTab(tab);
        }}
        setAuthView={setAuthView}
      />

      <main className="main-content">
        {renderMainContent()}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
