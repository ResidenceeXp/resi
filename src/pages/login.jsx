import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import { getLogoBooleanTheme } from '../utils/themeUtils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  // Light theme for login page
  const logoSrc = '/resi-logo.png';

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src={logoSrc} alt="Resi" style={styles.topLogo} />
      </div>

      <div style={styles.loginBox}>
        {/* Team Logo Section */}
        <div style={styles.logoSection}>
          <img src="/residence-exp-logo.png" alt="RESIDENCE | eXp Realty" style={styles.teamLogoImage} />
        </div>

        {/* Form Header */}
        <div style={styles.formHeader}>
          <h1 style={styles.formTitle}>Let's get to work</h1>
          <p style={styles.formSubtitle}>Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                style={styles.input}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>PASSWORD</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={styles.input}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.loginButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Info */}
        <p style={styles.footer}>
          For access, contact your administrator.
        </p>
      </div>

      {/* Gold accent bars */}
      <div style={styles.accentTop}></div>
      <div style={styles.accentBottom}></div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: 'hidden',
    padding: '20px'
  },
  logoContainer: {
    marginBottom: '40px',
    textAlign: 'center'
  },
  topLogo: {
    maxWidth: '280px',
    height: 'auto'
  },
  loginBox: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #F0F0F0',
    borderRadius: '4px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: 'none',
    position: 'relative',
    zIndex: 1
  },
  formHeader: {
    marginBottom: '32px',
    textAlign: 'center'
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#000000',
    margin: '0 0 8px 0',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    letterSpacing: '-0.5px'
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#999999',
    margin: '0',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: '400'
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logoImage: {
    maxWidth: '80px',
    height: 'auto',
    marginBottom: '0'
  },
  teamLogoImage: {
    maxWidth: '280px',
    height: 'auto',
    marginBottom: '0'
  },
  form: {
    marginBottom: '32px'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: '8px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    position: 'absolute',
    left: '12px',
    color: '#d4af37',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 44px',
    backgroundColor: '#F9F9F9',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    color: '#000000',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  loginButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#d4af37',
    color: '#000000',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    border: '1px solid #EF5350',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '20px'
  },
  errorText: {
    color: '#C62828',
    fontSize: '14px',
    margin: '0',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  footer: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#999999',
    margin: '0',
    letterSpacing: '0.5px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  accentTop: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '2px',
    backgroundColor: '#d4af37'
  },
  accentBottom: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '2px',
    backgroundColor: '#d4af37'
  }
};
