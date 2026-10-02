import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      {/* Top gold bar */}
      <div style={styles.topBar}></div>

      {/* Main content */}
      <div style={styles.content}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>R</div>
          <h1 style={styles.title}>RESIDENCE</h1>
        </div>

        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Transaction Management</h2>
          <p style={styles.formSubtitle}>Sign in to your account</p>

          <form onSubmit={handleLogin} style={styles.form}>
            {(localError || error) && (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>{localError || error}</p>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.icon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.icon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom gold bar */}
      <div style={styles.bottomBar}></div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column'
  },
  topBar: {
    height: '4px',
    backgroundColor: '#D4AF37'
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px'
  },
  logo: {
    width: '80px',
    height: '80px',
    backgroundColor: '#1a1a1a',
    border: '2px solid #D4AF37',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0',
    letterSpacing: '3px',
    color: '#D4AF37'
  },
  formCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#FFFFFF'
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#999999',
    margin: '0 0 24px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#D4AF37',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '4px',
    padding: '12px'
  },
  icon: {
    color: '#D4AF37',
    flexShrink: 0
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none'
  },
  submitButton: {
    padding: '14px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '10px'
  },
  errorBox: {
    backgroundColor: '#3d2a1a',
    border: '1px solid #D4AF37',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '20px'
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: '14px',
    margin: '0'
  },
  bottomBar: {
    height: '4px',
    backgroundColor: '#D4AF37'
  }
};
