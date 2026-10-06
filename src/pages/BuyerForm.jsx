import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import getTransactionById - removed
import { generateTasksForTransaction } from '../services/taskService';
import { createTransaction } from '../services/transactionService';
// import notificationTriggerService - removed
import { ArrowLeft, DollarSign, FileText } from 'lucide-react';

export default function BuyerForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Property Information
    propertyAddress: '',
    city: '',
    state: '',
    zipCode: '',
    purchasePrice: '',
    propertyType: 'Single Family',
    yearBuilt: '',
    squareFeet: '',
    bedrooms: '',
    bathrooms: '',
    lotSize: '',
    
    // Buyer Details
    sellerName: '',
    sellerPhone: '',
    sellerEmail: '',
    sellerAgent: '',
    sellerAgentPhone: '',
    sellerAgentEmail: '',
    
    // Offer & Contract
    offerPrice: '',
    offerDate: '',
    offerExpirationDate: '',
    contractDate: '',
    closingDate: '',
    
    // Financial Details
    downPaymentAmount: '',
    downPaymentPercent: '',
    loanAmount: '',
    loanType: 'Conventional',
    interestRate: '',
    loanTerm: '',
    
    // Contingencies
    homeInspection: false,
    appraisal: false,
    financing: false,
    surveyRequired: false,
    titleIssues: false,
    homeownersInsurance: false,
    
    // Commission Information
    commissionType: 'percentage', // 'percentage' or 'dollar'
    commissionPercentage: '',
    commissionDollarAmount: '',
    leadSource: 'agent-generated', // 'agent-generated' or 'team-generated'

    // Additional Notes
    specialConditions: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);

    try {
      if (!user) throw new Error('User not authenticated');
      if (!formData.closingDate) throw new Error('Closing date is required for task generation');

      // Create the transaction and get its ID
      const transactionId = await createTransaction(user.uid, formData, 'Buyer');

      // Generate tasks based on closing date
      if (transactionId) {
        await generateTasksForTransaction(user.uid, transactionId, 'Buyer', formData.closingDate);

        // Get the transaction details and send created notification
        const transaction = await [].filter(user.uid, transactionId);
        if (transaction) {
          // await sendTransactionCreatedNotification(user.uid, transaction);
        }
      }

      // Show success message and redirect
      alert('Buyer transaction saved successfully!\nAssociated tasks have been generated.');
      navigate('/transactions');
    } catch (error) {
      console.error('Error saving buyer transaction:', error);
      setSubmitError(error.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={handleCancel}>
        <ArrowLeft size={20} /> Back
      </button>

      <h1 style={styles.title}>Buyer Transaction Form</h1>

      {submitError && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>Error: {submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Basic Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Buyer Information</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </fieldset>

        {/* Property Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Property Information</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Property Address</label>
            <input
              type="text"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Purchase Price</label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={styles.input}>
                <option>Single Family</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Multi-Family</option>
                <option>Land</option>
                <option>Other</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Year Built</label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Square Feet</label>
              <input
                type="number"
                name="squareFeet"
                value={formData.squareFeet}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lot Size</label>
              <input
                type="text"
                name="lotSize"
                value={formData.lotSize}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </fieldset>

        {/* Seller & Agent Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Seller & Agent Information</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Seller Name</label>
            <input
              type="text"
              name="sellerName"
              value={formData.sellerName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Seller Phone</label>
              <input
                type="tel"
                name="sellerPhone"
                value={formData.sellerPhone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Seller Email</label>
              <input
                type="email"
                name="sellerEmail"
                value={formData.sellerEmail}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Seller's Agent</label>
            <input
              type="text"
              name="sellerAgent"
              value={formData.sellerAgent}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Seller's Agent Phone</label>
              <input
                type="tel"
                name="sellerAgentPhone"
                value={formData.sellerAgentPhone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Seller's Agent Email</label>
              <input
                type="email"
                name="sellerAgentEmail"
                value={formData.sellerAgentEmail}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </fieldset>

        {/* Offer & Contract Timeline */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Offer & Contract Timeline</legend>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Offer Price</label>
              <input
                type="number"
                name="offerPrice"
                value={formData.offerPrice}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Offer Date</label>
              <input
                type="date"
                name="offerDate"
                value={formData.offerDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Offer Expiration Date</label>
              <input
                type="date"
                name="offerExpirationDate"
                value={formData.offerExpirationDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Contract Date</label>
              <input
                type="date"
                name="contractDate"
                value={formData.contractDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Expected Closing Date</label>
            <input
              type="date"
              name="closingDate"
              value={formData.closingDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </fieldset>

        {/* Financial Details */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Financial Details</legend>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Down Payment Amount</label>
              <input
                type="number"
                name="downPaymentAmount"
                value={formData.downPaymentAmount}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Down Payment %</label>
              <input
                type="number"
                name="downPaymentPercent"
                value={formData.downPaymentPercent}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Loan Amount</label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Loan Type</label>
              <select name="loanType" value={formData.loanType} onChange={handleChange} style={styles.input}>
                <option>Conventional</option>
                <option>FHA</option>
                <option>VA</option>
                <option>USDA</option>
                <option>Other</option>
                <option>Cash</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Interest Rate %</label>
              <input
                type="number"
                step="0.01"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Loan Term (Years)</label>
            <input
              type="number"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </fieldset>

        {/* Contingencies */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Contingencies</legend>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="homeInspection"
                checked={formData.homeInspection}
                onChange={handleChange}
              />
              Home Inspection
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="appraisal"
                checked={formData.appraisal}
                onChange={handleChange}
              />
              Appraisal
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="financing"
                checked={formData.financing}
                onChange={handleChange}
              />
              Financing
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="surveyRequired"
                checked={formData.surveyRequired}
                onChange={handleChange}
              />
              Survey Required
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="titleIssues"
                checked={formData.titleIssues}
                onChange={handleChange}
              />
              Title Issues
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="homeownersInsurance"
                checked={formData.homeownersInsurance}
                onChange={handleChange}
              />
              Homeowners Insurance Required
            </label>
          </div>
        </fieldset>

        {/* Commission Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Commission Information</legend>

          {/* Commission Type */}
          <div style={styles.inputGroup}>
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
                Percentage of Purchase Price
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

          {/* Commission Percentage */}
          {formData.commissionType === 'percentage' && (
            <div style={styles.inputGroup}>
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

          {/* Commission Dollar Amount */}
          {formData.commissionType === 'dollar' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Commission Amount ($)</label>
              <input
                type="number"
                step="0.01"
                name="commissionDollarAmount"
                value={formData.commissionDollarAmount}
                onChange={handleChange}
                placeholder="e.g., 5000"
                style={styles.input}
              />
            </div>
          )}

          {/* Lead Source */}
          <div style={styles.inputGroup}>
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
        </fieldset>

        {/* Additional Notes */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Additional Notes</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Special Conditions</label>
            <textarea
              name="specialConditions"
              value={formData.specialConditions}
              onChange={handleChange}
              style={styles.textarea}
              rows="3"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={styles.textarea}
              rows="4"
            />
          </div>
        </fieldset>

        {/* Submit Buttons */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={loading}
            style={{...styles.submitButton, opacity: loading ? 0.6 : 1}}
          >
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#000000',
    minHeight: '100vh',
    color: '#FFFFFF'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#222222',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#D4AF37'
  },
  errorBox: {
    backgroundColor: '#8B0000',
    border: '1px solid #FF6B6B',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '24px'
  },
  errorText: {
    color: '#FFFFFF',
    margin: '0',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  fieldset: {
    border: '1px solid #333333',
    borderRadius: '4px',
    padding: '16px',
    backgroundColor: '#111111'
  },
  legend: {
    color: '#D4AF37',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '0 8px'
  },
  inputGroup: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#CCCCCC'
  },
  input: {
    padding: '10px 12px',
    backgroundColor: '#1A1A1A',
    border: '1px solid #444444',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  textarea: {
    padding: '10px 12px',
    backgroundColor: '#1A1A1A',
    border: '1px solid #444444',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#CCCCCC',
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
    gap: '8px',
    fontSize: '14px',
    color: '#CCCCCC',
    cursor: 'pointer'
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '24px'
  },
  submitButton: {
    padding: '12px 32px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '12px 32px',
    backgroundColor: '#444444',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
