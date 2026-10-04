import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus } from 'lucide-react';

export default function Admin() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    role: 'Agent'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = ['Agent', 'Transaction Coordinator', 'Assistant', 'Marketing Assistant', 'Marketing Manager'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.displayName || !formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      await signup(formData.email, formData.password, formData.displayName, formData.role);

      setSuccess(\`User \${formData.displayName} created successfully!\`);
      setFormData({
        displayName: '',
        email: '',
        password: '',
        role: 'Agent'
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 style={styles.headerTitle}>User Management</h1>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.formSection}>
          <div style={styles.sectionHeader}>
            <Plus size={24} />
            <h2 style={styles.sectionTitle}>Add New User</h2>
          </div>

          <form onSubmit={handleAddUser} style={styles.form}>
            {error && (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            {success && (
              <div style={styles.successBox}>
                <p style={styles.successText}>{success}</p>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                minLength="6"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
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
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </form>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>User Roles</h3>
          <ul style={styles.roleList}>
            {roles.map(role => (
              <li key={role} style={styles.roleItem}>{role}</li>
            ))}
          </ul>
          <p style={styles.infoText}>
            Once a user account is created, that user can log in with their email and password on the login page.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF'
  },
  header: {
    backgroundColor: '#1a1a1a',
    borderBottom: '2px solid #D4AF37',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: '#D4AF37',
    border: '1px solid #D4AF37',
    padding: '10px 16px',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
    letterSpacing: '2px'
  },
  mainContent: {
    padding: '40px',
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '40px'
  },
  formSection: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '32px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
    color: '#D4AF37'
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
  input: {
    padding: '12px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  select: {
    padding: '12px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'inherit'
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
  successBox: {
    backgroundColor: '#1a3a1a',
    border: '1px solid #4CAF50',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '20px'
  },
  successText: {
    color: '#4CAF50',
    fontSize: '14px',
    margin: '0',
    fontWeight: '600'
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '24px',
    height: 'fit-content'
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    color: '#D4AF37'
  },
  roleList: {
    listStyle: 'none',
    padding: '0',
    margin: '0 0 16px 0'
  },
  roleItem: {
    fontSize: '13px',
    color: '#999999',
    padding: '6px 0',
    borderBottom: '1px solid #333333'
  },
  infoText: {
    fontSize: '12px',
    color: '#666666',
    margin: '0'
  }
};
