import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Register = ({ onRegisterSuccess, setAuthView, showNotification }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('renter'); // Default role: renter
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, role })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        showNotification(`Welcome to HouseHunt, ${data.user.username}!`, 'success');
        onRegisterSuccess(data.user);
      } else {
        showNotification(data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      showNotification('Could not connect to authentication server.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join HouseHunt to find or list premium rentals</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Select User Role</label>
            <div className="role-selector">
              <div 
                className={`role-option ${role === 'renter' ? 'active' : ''}`}
                onClick={() => setRole('renter')}
              >
                I want to Rent
              </div>
              <div 
                className={`role-option ${role === 'landlord' ? 'active' : ''}`}
                onClick={() => setRole('landlord')}
              >
                I am a Landlord
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="e.g. Sarah Connor"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                required 
                className="form-input" 
                placeholder="e.g. sarah@househunt.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                className="form-input" 
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <span onClick={() => setAuthView('login')}>Sign In Here</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
