import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { database } from '../firebaseConfig';
import { ref, get, set, update } from 'firebase/database';

export default function AgentProfileSettings() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only allow admins to access this page
    if (userRole !== 'Admin') {
      navigate('/dashboard');
      return;
    }
    loadAgents();
  }, [user, userRole]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all users from the database
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        // Filter for agents and other team members
        const agentsList = Object.entries(usersData)
          .filter(([_, user]) => user.role && user.role !== 'Admin')
          .map(([uid, user]) => ({
            uid,
            email: user.email,
            displayName: user.displayName || user.email,
            role: user.role,
            ...user.commissionSettings
          }))
          .sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));

        setAgents(agentsList);
      }
    } catch (err) {
      console.error('Error loading agents:', err);
      setError('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
    setEditingAgent({
      ...agent,
      capAnniversaryDate: agent.capAnniversaryDate || '',
      teamSplitPercent: agent.teamSplitPercent || '50',
      brokerSplitPercent: agent.brokerSplitPercent || '50',
      capAmount: agent.capAmount || '',
      phone: agent.phone || '',
      email: agent.email || '',
      profilePhotoUrl: agent.profilePhotoUrl || '',
      celebrationPhotoUrl: agent.celebrationPhotoUrl || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingAgent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAgent = async () => {
    try {
      setSaveLoading(true);
      setError(null);

      if (!editingAgent || !editingAgent.uid) {
        throw new Error('Invalid agent data');
      }

      // Validate percentages
      const teamSplit = parseFloat(editingAgent.teamSplitPercent) || 0;
      const brokerSplit = parseFloat(editingAgent.brokerSplitPercent) || 0;

      if (teamSplit < 0 || teamSplit > 100 || brokerSplit < 0 || brokerSplit > 100) {
        throw new Error('Percentages must be between 0 and 100');
      }

      // Update user's commission settings
      const userCommissionSettingsRef = ref(database, `users/${editingAgent.uid}/commissionSettings`);

      await set(userCommissionSettingsRef, {
        capAnniversaryDate: editingAgent.capAnniversaryDate,
        teamSplitPercent: parseFloat(editingAgent.teamSplitPercent),
        brokerSplitPercent: parseFloat(editingAgent.brokerSplitPercent),
        capAmount: parseFloat(editingAgent.capAmount) || 0,
        phone: editingAgent.phone,
        profilePhotoUrl: editingAgent.profilePhotoUrl,
        celebrationPhotoUrl: editingAgent.celebrationPhotoUrl
      });

      // Update local state
      setAgents(prev => prev.map(agent =>
        agent.uid === editingAgent.uid ? editingAgent : agent
      ));

      setSelectedAgent(editingAgent);
      alert('Agent profile settings saved successfully!');
    } catch (err) {
      console.error('Error saving agent settings:', err);
      setError(err.message || 'Failed to save agent settings');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingAgent(null);
  };

  if (!userRole || userRole !== 'Admin') {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Access Denied: Admin only</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <button onClick={() => navigate('/admin')} style={styles.backButton}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 style={styles.title}>Agent Commission Settings</h1>
        <p style={styles.loadingText}>Loading agents...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/admin')} style={styles.backButton}>
          <ArrowLeft size={18} /> Back to Admin
        </button>
        <h1 style={styles.title}>Agent Commission Settings</h1>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      <div style={styles.mainContent}>
        {!selectedAgent ? (
          // Agent List View
          <div style={styles.agentsList}>
            <h2 style={styles.sectionTitle}>Select an Agent to Edit Settings</h2>
            {agents.length === 0 ? (
              <p style={styles.emptyText}>No agents found</p>
            ) : (
              <div style={styles.agentsGrid}>
                {agents.map((agent) => (
                  <div
                    key={agent.uid}
                    style={styles.agentCard}
                    onClick={() => handleSelectAgent(agent)}
                  >
                    <div style={styles.agentCardHeader}>
                      <div>
                        <h3 style={styles.agentName}>{agent.displayName || agent.email}</h3>
                        <p style={styles.agentRole}>{agent.role}</p>
                      </div>
                      <Edit size={18} style={{ color: '#D4AF37' }} />
                    </div>
                    <p style={styles.agentEmail}>{agent.email}</p>
                    {agent.teamSplitPercent && (
                      <div style={styles.agentQuickInfo}>
                        <span>Team Split: {agent.teamSplitPercent}%</span>
                        <span>Broker Split: {agent.brokerSplitPercent}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : editingAgent ? (
          // Edit View
          <div style={styles.editView}>
            <div style={styles.editHeader}>
              <h2 style={styles.sectionTitle}>{editingAgent.displayName || editingAgent.email}</h2>
              <button
                onClick={handleCancel}
                style={styles.closeButton}
                title="Cancel edit"
              >
                <X size={20} />
              </button>
            </div>

            <form style={styles.editForm} onSubmit={(e) => { e.preventDefault(); handleSaveAgent(); }}>
              {/* Commission Cap Settings */}
              <fieldset style={styles.fieldset}>
                <legend style={styles.legend}>Commission Cap Settings</legend>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Cap Anniversary Date</label>
                  <input
                    type="date"
                    name="capAnniversaryDate"
                    value={editingAgent.capAnniversaryDate}
                    onChange={handleEditChange}
                    style={styles.input}
                  />
                  <p style={styles.helpText}>The date each year when the commission cap resets</p>
                </div>

                <div style={styles.twoColumn}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Team Split Percentage (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      name="teamSplitPercent"
                      value={editingAgent.teamSplitPercent}
                      onChange={handleEditChange}
                      style={styles.input}
                    />
                    <p style={styles.helpText}>% of commission to RESIDENCE | eXp Realty</p>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Broker Split Percentage (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      name="brokerSplitPercent"
                      value={editingAgent.brokerSplitPercent}
                      onChange={handleEditChange}
                      style={styles.input}
                    />
                    <p style={styles.helpText}>% of commission to eXp Realty (broker)</p>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Commission Cap Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    name="capAmount"
                    value={editingAgent.capAmount}
                    onChange={handleEditChange}
                    placeholder="e.g., 50000"
                    style={styles.input}
                  />
                  <p style={styles.helpText}>Maximum commission to be paid (YTD)</p>
                </div>
              </fieldset>

              {/* Contact Information */}
              <fieldset style={styles.fieldset}>
                <legend style={styles.legend}>Contact Information</legend>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editingAgent.email}
                    disabled
                    style={{...styles.input, opacity: 0.6}}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editingAgent.phone}
                    onChange={handleEditChange}
                    placeholder="239-123-4567"
                    style={styles.input}
                  />
                </div>
              </fieldset>

              {/* Photos */}
              <fieldset style={styles.fieldset}>
                <legend style={styles.legend}>Profile Photos</legend>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Profile Photo URL</label>
                  <input
                    type="text"
                    name="profilePhotoUrl"
                    value={editingAgent.profilePhotoUrl}
                    onChange={handleEditChange}
                    placeholder="https://example.com/photo.jpg"
                    style={styles.input}
                  />
                  <p style={styles.helpText}>URL to agent's professional photo</p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Celebration Photo URL</label>
                  <input
                    type="text"
                    name="celebrationPhotoUrl"
                    value={editingAgent.celebrationPhotoUrl}
                    onChange={handleEditChange}
                    placeholder="https://example.com/celebration.jpg"
                    style={styles.input}
                  />
                  <p style={styles.helpText}>Photo shown when agent reaches commission cap</p>
                </div>
              </fieldset>

              {/* Action Buttons */}
              <div style={styles.formActions}>
                <button
                  type="submit"
                  disabled={saveLoading}
                  style={{...styles.saveButton, opacity: saveLoading ? 0.6 : 1}}
                >
                  <Save size={18} /> {saveLoading ? 'Saving...' : 'Save Settings'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={styles.cancelFormButton}
                  disabled={saveLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    backgroundColor: '#F5F5F5',
    borderBottom: '1px solid #E0E0E0',
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
    border: 'none',
    color: '#666',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'all 0.3s ease'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#000',
    margin: '0'
  },
  mainContent: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    border: '1px solid #d32f2f',
    borderRadius: '8px',
    padding: '16px',
    margin: '20px 40px',
    marginBottom: '24px'
  },
  errorText: {
    fontSize: '14px',
    color: '#d32f2f',
    margin: '0'
  },
  loadingText: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center'
  },
  agentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000',
    margin: '0 0 16px 0'
  },
  emptyText: {
    fontSize: '14px',
    color: '#999',
    textAlign: 'center',
    padding: '40px'
  },
  agentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px'
  },
  agentCard: {
    backgroundColor: '#F9F9F9',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  agentCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  agentName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#000',
    margin: '0 0 4px 0'
  },
  agentRole: {
    fontSize: '13px',
    color: '#D4AF37',
    margin: '0',
    fontWeight: '500'
  },
  agentEmail: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 12px 0'
  },
  agentQuickInfo: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#666',
    paddingTop: '12px',
    borderTop: '1px solid #DDD'
  },
  editView: {
    maxWidth: '700px'
  },
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    transition: 'all 0.3s ease'
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  fieldset: {
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#F9F9F9'
  },
  legend: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#D4AF37',
    padding: '0 8px'
  },
  formGroup: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    padding: '12px',
    border: '1px solid #DDD',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease'
  },
  helpText: {
    fontSize: '12px',
    color: '#999',
    margin: '0',
    fontStyle: 'italic'
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #E0E0E0'
  },
  saveButton: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease'
  },
  cancelFormButton: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#999999',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease'
  }
};
