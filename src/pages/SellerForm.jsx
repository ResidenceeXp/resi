import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// import getTransactionById - removed
import { generateTasksForTransaction } from '../services/taskService';
// import notificationTriggerService - removed

export default function SellerForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    // Seller Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Property Information
    propertyAddress: '',
    propertyType: 'single-family',
    bedroomCount: '',
    bathroomCount: '',
    squareFootage: '',
    yearBuilt: '',
    homeCondition: 'good',
    needsRepairs: 'no',

    // Listing Preferences
    listingPrice: '',
    anticipatedListingDate: '',
    desiredClosingDate: '',
    reasonForSelling: '',

    // Staging & Photography
    stagingNeeded: 'no',
    stagingNotes: '',
    photographyDate: '',
    videoScriptNotes: '',

    // Marketing Materials
    createBrochure: true,
    createMailer: true,
    createFeatureCards: true,
    marketingTheme: '',
    keyFeatures: '',

    // Showing Instructions
    showingInstructions: '',
    accessInstructions: '',
    lockboxCode: '',

    // Commission Information
    commissionType: 'percentage', // 'percentage' or 'dollar'
    commissionPercentage: '',
    commissionDollarAmount: '',
    leadSource: 'agent-generated', // 'agent-generated' or 'team-generated'

    // Additional Information
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Property address is required';
    if (!formData.listingPrice.trim()) newErrors.listingPrice = 'Listing price is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setSubmitError('');
      setSubmitted(false);

      try {
        // Save to Firebase using the transactionService
        const transactionId = await createTransaction(user.uid, formData, 'Seller');

        // Generate tasks based on closing date (desiredClosingDate for Seller)
        if (transactionId && formData.desiredClosingDate) {
          await generateTasksForTransaction(user.uid, transactionId, 'Seller', formData.desiredClosingDate);

          // Get the transaction details and send created notification
          const transaction = await [].filter(user.uid, transactionId);
          if (transaction) {
            await sendTransactionCreatedNotification(user.uid, transaction);
          }
        }

        console.log('Seller transaction saved to Firebase:', formData);
        setSubmitted(true);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/transactions');
        }, 2000);
      } catch (error) {
        console.error('Error saving seller transaction:', error);
        setSubmitError('Failed to save seller information. Please try again.');
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/transactions/new')} style={styles.backButton}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 style={styles.title}>Seller Transaction</h1>
        <div style={{width: '80px'}}></div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {submitted && (
          <div style={styles.successBox}>
            <CheckCircle size={24} style={{color: '#4CAF50'}} />
            <div>
              <p style={styles.successTitle}>Seller information saved!</p>
              <p style={styles.successSubtitle}>Your transaction has been created. Redirecting...</p>
            </div>
          </div>
        )}

        {submitError && (
          <div style={styles.errorBox}>
            <AlertCircle size={24} style={{color: '#d32f2f'}} />
            <div>
              <p style={styles.errorTitle}>Error saving transaction</p>
              <p style={styles.errorSubtitle}>{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Seller Information Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Seller Information</h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  style={{...styles.input, borderColor: errors.firstName ? '#d32f2f' : '#DDD'}}
                />
                {errors.firstName && <p style={styles.errorText}>{errors.firstName}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                  style={{...styles.input, borderColor: errors.lastName ? '#d32f2f' : '#DDD'}}
                />
                {errors.lastName && <p style={styles.errorText}>{errors.lastName}</p>}
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  style={{...styles.input, borderColor: errors.email ? '#d32f2f' : '#DDD'}}
                />
                {errors.email && <p style={styles.errorText}>{errors.email}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="239-555-0123"
                  style={{...styles.input, borderColor: errors.phone ? '#d32f2f' : '#DDD'}}
                />
                {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Property Information Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Property Information</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Property Address *</label>
              <input
                type="text"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                placeholder="123 Main St, Estero, FL 33928"
                style={{...styles.input, borderColor: errors.propertyAddress ? '#d32f2f' : '#DDD'}}
              />
              {errors.propertyAddress && <p style={styles.errorText}>{errors.propertyAddress}</p>}
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Property Type</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={styles.input}>
                  <option value="single-family">Single Family Home</option>
                  <option value="condo">Condo</option>
                  <option value="townhome">Townhome</option>
                  <option value="multi-family">Multi-Family</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Year Built</label>
                <input
                  type="text"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  placeholder="2018"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bedrooms</label>
                <input
                  type="number"
                  name="bedroomCount"
                  value={formData.bedroomCount}
                  onChange={handleChange}
                  placeholder="4"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bathrooms</label>
                <input
                  type="number"
                  name="bathroomCount"
                  value={formData.bathroomCount}
                  onChange={handleChange}
                  placeholder="2.5"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Square Footage</label>
                <input
                  type="text"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleChange}
                  placeholder="2,500"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Home Condition</label>
                <select name="homeCondition" value={formData.homeCondition} onChange={handleChange} style={styles.input}>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs-work">Needs Work</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Needs Repairs?</label>
                <select name="needsRepairs" value={formData.needsRepairs} onChange={handleChange} style={styles.input}>
                  <option value="no">No</option>
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listing Information Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Listing Information</h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Listing Price *</label>
                <input
                  type="text"
                  name="listingPrice"
                  value={formData.listingPrice}
                  onChange={handleChange}
                  placeholder="$750,000"
                  style={{...styles.input, borderColor: errors.listingPrice ? '#d32f2f' : '#DDD'}}
                />
                {errors.listingPrice && <p style={styles.errorText}>{errors.listingPrice}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Anticipated Listing Date</label>
                <input
                  type="date"
                  name="anticipatedListingDate"
                  value={formData.anticipatedListingDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Desired Closing Date</label>
                <input
                  type="date"
                  name="desiredClosingDate"
                  value={formData.desiredClosingDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Reason for Selling</label>
              <textarea
                name="reasonForSelling"
                value={formData.reasonForSelling}
                onChange={handleChange}
                placeholder="Relocating, upgrading, downsizing, etc."
                rows="2"
                style={styles.textarea}
              />
            </div>
          </div>

          {/* Staging & Photography Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Staging & Photography</h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Staging Needed?</label>
                <select name="stagingNeeded" value={formData.stagingNeeded} onChange={handleChange} style={styles.input}>
                  <option value="no">No</option>
                  <option value="minor">Minor Staging</option>
                  <option value="professional">Professional Staging</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Photography Date</label>
                <input
                  type="date"
                  name="photographyDate"
                  value={formData.photographyDate}
                  onChange={handleChange}
                  placeholder="Preferred shoot date"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Staging Notes</label>
              <textarea
                name="stagingNotes"
                value={formData.stagingNotes}
                onChange={handleChange}
                placeholder="Any specific staging requests or notes..."
                rows="2"
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Video Script Notes</label>
              <textarea
                name="videoScriptNotes"
                value={formData.videoScriptNotes}
                onChange={handleChange}
                placeholder="Key points to highlight in listing video, special features, tone, etc."
                rows="2"
                style={styles.textarea}
              />
            </div>
          </div>

          {/* Marketing Materials Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Marketing Materials</h2>

            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="createBrochure"
                  checked={formData.createBrochure}
                  onChange={handleChange}
                  style={{marginRight: '8px'}}
                />
                Create Brochure
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="createMailer"
                  checked={formData.createMailer}
                  onChange={handleChange}
                  style={{marginRight: '8px'}}
                />
                Create Mailer
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="createFeatureCards"
                  checked={formData.createFeatureCards}
                  onChange={handleChange}
                  style={{marginRight: '8px'}}
                />
                Create Feature Cards
              </label>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Marketing Theme/Angle</label>
                <input
                  type="text"
                  name="marketingTheme"
                  value={formData.marketingTheme}
                  onChange={handleChange}
                  placeholder="e.g., 'Resort-style living', 'Golf community gem', 'Builder showcase'"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Key Features to Highlight</label>
                <input
                  type="text"
                  name="keyFeatures"
                  value={formData.keyFeatures}
                  onChange={handleChange}
                  placeholder="Pool, gated community, lake view, etc."
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Showing Instructions Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Showing Instructions</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Showing Instructions</label>
              <textarea
                name="showingInstructions"
                value={formData.showingInstructions}
                onChange={handleChange}
                placeholder="e.g., Ring doorbell, use lockbox, check with homeowner, etc."
                rows="2"
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Access Instructions</label>
                <textarea
                  name="accessInstructions"
                  value={formData.accessInstructions}
                  onChange={handleChange}
                  placeholder="Special gate codes, garage openers, alarm codes, etc."
                  rows="2"
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Lockbox Code (if applicable)</label>
                <input
                  type="text"
                  name="lockboxCode"
                  value={formData.lockboxCode}
                  onChange={handleChange}
                  placeholder="Lockbox access code"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Commission Information Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Commission Information</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Commission Type</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="commissionType"
                    value="percentage"
                    checked={formData.commissionType === 'percentage'}
                    onChange={handleChange}
                  />
                  Percentage of Sale Price
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="commissionType"
                    value="dollar"
                    checked={formData.commissionType === 'dollar'}
                    onChange={handleChange}
                  />
                  Fixed Dollar Amount
                </label>
              </div>
            </div>

            {formData.commissionType === 'percentage' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Commission Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="commissionPercentage"
                  value={formData.commissionPercentage}
                  onChange={handleChange}
                  placeholder="e.g., 2.5"
                  style={styles.input}
                />
              </div>
            )}

            {formData.commissionType === 'dollar' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Commission Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="commissionDollarAmount"
                  value={formData.commissionDollarAmount}
                  onChange={handleChange}
                  placeholder="e.g., 12500"
                  style={styles.input}
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Lead Source</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="leadSource"
                    value="agent-generated"
                    checked={formData.leadSource === 'agent-generated'}
                    onChange={handleChange}
                  />
                  Agent-Generated
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="leadSource"
                    value="team-generated"
                    checked={formData.leadSource === 'team-generated'}
                    onChange={handleChange}
                  />
                  Team-Generated
                </label>
              </div>
            </div>
          </div>

          {/* Additional Notes Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Additional Information</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information or special notes..."
                rows="4"
                style={styles.textarea}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button
              type="submit"
              style={{...styles.submitButton, opacity: loading ? 0.6 : 1}}
              disabled={loading}
            >
              <CheckCircle size={18} /> {loading ? 'Saving...' : 'Create Seller Transaction'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
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
    justifyContent: 'space-between',
    alignItems: 'center'
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
    maxWidth: '900px',
    margin: '0 auto'
  },
  successBox: {
    backgroundColor: '#E8F5E9',
    border: '1px solid #4CAF50',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  successTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2E7D32',
    margin: '0 0 4px 0'
  },
  successSubtitle: {
    fontSize: '14px',
    color: '#558B2F',
    margin: '0'
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    border: '1px solid #d32f2f',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  errorTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#C62828',
    margin: '0 0 4px 0'
  },
  errorSubtitle: {
    fontSize: '14px',
    color: '#B71C1C',
    margin: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000',
    margin: '0 0 16px 0',
    paddingBottom: '12px',
    borderBottom: '2px solid #D4AF37'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  checkboxGroup: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '16px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer'
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
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease'
  },
  textarea: {
    padding: '12px',
    border: '1px solid #DDD',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: 'border-box',
    resize: 'vertical',
    transition: 'border-color 0.3s ease'
  },
  errorText: {
    fontSize: '12px',
    color: '#d32f2f',
    margin: '0'
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #E0E0E0'
  },
  submitButton: {
    flex: '1',
    padding: '14px 24px',
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  cancelButton: {
    padding: '14px 24px',
    backgroundColor: '#FFFFFF',
    color: '#666',
    border: '1px solid #DDD',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }
};
