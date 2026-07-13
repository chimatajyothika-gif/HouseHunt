import React from 'react';
import { Home, LogOut, User, PlusCircle, Search, Heart, Briefcase } from 'lucide-react';

const Navbar = ({ user, logout, activeTab, setActiveTab, setAuthView }) => {
  return (
    <div className="navbar-wrapper">
      <div className="container navbar">
        <div className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <Home className="logo-icon" size={28} />
          <span>HouseHunt</span>
        </div>

        <nav className="nav-links">
          <span 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Search size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
            Find Houses
          </span>

          {user && user.role === 'landlord' && (
            <span 
              className={`nav-link ${activeTab === 'add-property' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-property')}
            >
              <PlusCircle size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
              List Property
            </span>
          )}

          {user && (
            <span 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Briefcase size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
              Dashboard
            </span>
          )}

          {user ? (
            <>
              <div className="user-badge">
                <User size={14} />
                <span>{user.username}</span>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                  {user.role}
                </span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={logout}>
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="nav-link" onClick={() => setAuthView('login')}>Sign In</span>
              <button className="btn btn-primary btn-sm" onClick={() => setAuthView('register')}>
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
