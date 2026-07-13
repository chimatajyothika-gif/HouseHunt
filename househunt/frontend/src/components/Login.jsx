import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLoginSuccess, setAuthView, showNotification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        showNotification(`Welcome back, ${data.user.username}!`, 'success');
        onLoginSuccess(data.user);
      } else {
        showNotification(data.message || 'Invalid email or password', 'error');
      }
    } catch (err) {
      showNotification('Could not connect to authentication server.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (role) => {
    if (role === 'landlord') {
      setEmail('landlord@househunt.com');
      setPassword('password123');
    } else {
      setEmail('sarah@househunt.com');
      setPassword('password123');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Sign In</h2>
          <p>Access your listings and renter dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="••••••••"
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
            {loading ? 'Signing In...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '10px 0', paddingPoint: '10px' }}>
            <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Quick Demo Accounts:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => handleFillDemo('landlord')}
              >
                Landlord Demo
              </button>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => handleFillDemo('renter')}
              >
                Renter Demo
              </button>
            </div>
          </div>
        </form>

        <div className="auth-footer">
          Don't have an account? <span onClick={() => setAuthView('register')}>Register Here</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
