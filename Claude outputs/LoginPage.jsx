import React, { useState } from 'react';
import { login } from './utils/authUtils';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('kelly.olin@eXpRealty.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = login(email, password);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: '0 0 1rem 0',
          }}>
            RESIDENCE
          </h1>
          <p style={{
            fontSize: '1.3rem',
            margin: '0 0 2rem 0',
            opacity: 0.9,
          }}>
            eXp Realty Transaction Management
          </p>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.6',
            opacity: 0.8,
          }}>
            Streamline your real estate transactions with comprehensive tools for agents, coordinators, marketers, and more.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            margin: '0 0 2rem 0',
            color: '#2c3e50',
            textAlign: 'center',
            fontSize: '1.5rem',
          }}>
            Sign In
          </h2>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: '#ffe6e6',
                border: '1px solid #e74c3c',
                color: '#c0392b',
                padding: '0.75rem',
                borderRadius: '4px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#2c3e50',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#667eea'; }}
                onBlur={(e) => { e.target.style.borderColor = '#ddd'; }}
                required
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#2c3e50',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#667eea'; }}
                onBlur={(e) => { e.target.style.borderColor = '#ddd'; }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.target.style.backgroundColor = '#764ba2';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.target.style.backgroundColor = '#667eea';
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: '#7f8c8d',
          }}>
            <strong>Demo Credentials:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              <div>Agent: amanda@residence.local / password123</div>
              <div>TC: patricia@residence.local / password123</div>
              <div>Admin: kelly.olin@eXpRealty.com / password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
