import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import getTransactionById - removed
import { generateTasksForTransaction } from '../services/taskService';
// import notificationTriggerService - removed
import { ArrowLeft, Building2, Calendar } from 'lucide-react';

export default function LandlordForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    // Landlord Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Property Information
    propertyAddress: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'Single Family',
    yearBuilt: '',
    squareFeet: '',
    bedrooms: '',
    bathrooms: '',
    lotSize: '',
    
    // Rental Details
    rentalPrice: '',
    securityDeposit: '',
    leaseStartDate: '',
    leaseEndDate: '',
    leaseTermMonths: '',
    
    // Tenant Information
    tenantName: '',
    tenantPhone: '',
    tenantEmail: '',
    tenantOccupants: '',
    tenantEmployer: '',
    
    // Financial Information
    annualRentIncome: '',
    propertyTaxes: '',
    propertyInsurance: '',
    hoa: '',
    utilities: '',
    maintenance: '',
    vacancyRate: '',
    
    // Management
    propertyManager: '',
    propertyManagerPhone: '',
    propertyManagerEmail: '',
    managementCompany: '',
    
    // Lease Information
    leaseType: 'Standard',
    petPolicy: 'No Pets',
    utilities: '',
    furnished: false,
    
    // Compliance & Legal
    tenantScreening: false,
    backgroundCheck: false,
    creditCheck: false,
    referenceCheck: false,
    petDeposit: false,

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
      if (!formData.leaseStartDate) throw new Error('Lease start date is required for task generation');

      const transactionId = await createTransaction(user.uid, formData, 'Landlord');

      // Generate tasks based on lease start date
      if (transactionId) {
        await generateTasksForTransaction(user.uid, transactionId, 'Landlord', formData.leaseStartDate);

        // Get the transaction details and send created notification
        const transaction = await [].filter(user.uid, transactionId);
        if (transaction) {
          await sendTransactionCreatedNotification(user.uid, transaction);
        }
      }

      alert('Landlord transaction saved successfully!\nAssociated tasks have been generated.');
      navigate('/transactions');
    } catch (error) {
      console.error('Error saving landlord transaction:', error);
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

      <h1 style={styles.title}>Landlord Transaction Form</h1>

      {submitError && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>Error: {submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Landlord Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Landlord Information</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} />
            </div>
          </div>
        </fieldset>

        {/* Property Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Property Information</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Property Address</label>
            <input type="text" name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Zip Code</label>
              <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={styles.input}>
                <option>Single Family</option>
                <option>Multi-Family</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Apartment</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Year Built</label>
              <input type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Square Feet</label>
              <input type="number" name="squareFeet" value={formData.squareFeet} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Lot Size</label>
            <input type="text" name="lotSize" value={formData.lotSize} onChange={handleChange} style={styles.input} />
          </div>
        </fieldset>

        {/* Rental Details */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Rental Details</legend>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Monthly Rental Price</label>
              <input type="number" name="rentalPrice" value={formData.rentalPrice} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Security Deposit</label>
              <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lease Start Date</label>
              <input type="date" name="leaseStartDate" value={formData.leaseStartDate} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lease End Date</label>
              <input type="date" name="leaseEndDate" value={formData.leaseEndDate} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Lease Term (Months)</label>
            <input type="number" name="leaseTermMonths" value={formData.leaseTermMonths} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lease Type</label>
              <select name="leaseType" value={formData.leaseType} onChange={handleChange} style={styles.input}>
                <option>Standard</option>
                <option>Month-to-Month</option>
                <option>Fixed Term</option>
                <option>Other</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Pet Policy</label>
              <select name="petPolicy" value={formData.petPolicy} onChange={handleChange} style={styles.input}>
                <option>No Pets</option>
                <option>Cats Only</option>
                <option>Dogs Only</option>
                <option>Both</option>
                <option>With Deposit</option>
              </select>
            </div>
          </div>
          <div style={styles.checkboxLabel}>
            <input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} />
            Furnished Unit
          </div>
        </fieldset>

        {/* Tenant Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Tenant Information</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tenant Name</label>
            <input type="text" name="tenantName" value={formData.tenantName} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tenant Phone</label>
              <input type="tel" name="tenantPhone" value={formData.tenantPhone} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tenant Email</label>
              <input type="email" name="tenantEmail" value={formData.tenantEmail} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Number of Occupants</label>
              <input type="number" name="tenantOccupants" value={formData.tenantOccupants} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Employer</label>
              <input type="text" name="tenantEmployer" value={formData.tenantEmployer} onChange={handleChange} style={styles.input} />
            </div>
          </div>
        </fieldset>

        {/* Financial Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Financial Information</legend>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Annual Rent Income</label>
              <input type="number" name="annualRentIncome" value={formData.annualRentIncome} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Property Taxes (Annual)</label>
              <input type="number" name="propertyTaxes" value={formData.propertyTaxes} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Property Insurance (Annual)</label>
              <input type="number" name="propertyInsurance" value={formData.propertyInsurance} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>HOA Fees (Monthly)</label>
              <input type="number" name="hoa" value={formData.hoa} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Utilities (Monthly)</label>
              <input type="number" name="utilities" value={formData.utilities} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Maintenance Reserve (Monthly)</label>
              <input type="number" name="maintenance" value={formData.maintenance} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Vacancy Rate (%)</label>
            <input type="number" step="0.1" name="vacancyRate" value={formData.vacancyRate} onChange={handleChange} style={styles.input} />
          </div>
        </fieldset>

        {/* Property Management */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Property Management</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Management Company</label>
            <input type="text" name="managementCompany" value={formData.managementCompany} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Property Manager Name</label>
            <input type="text" name="propertyManager" value={formData.propertyManager} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Property Manager Phone</label>
              <input type="tel" name="propertyManagerPhone" value={formData.propertyManagerPhone} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Property Manager Email</label>
              <input type="email" name="propertyManagerEmail" value={formData.propertyManagerEmail} onChange={handleChange} style={styles.input} />
            </div>
          </div>
        </fieldset>

        {/* Compliance & Screening */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Tenant Screening & Compliance</legend>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="tenantScreening" checked={formData.tenantScreening} onChange={handleChange} />
              Tenant Screening Completed
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="backgroundCheck" checked={formData.backgroundCheck} onChange={handleChange} />
              Background Check
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="creditCheck" checked={formData.creditCheck} onChange={handleChange} />
              Credit Check
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="referenceCheck" checked={formData.referenceCheck} onChange={handleChange} />
              Reference Check
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="petDeposit" checked={formData.petDeposit} onChange={handleChange} />
              Pet Deposit Collected
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
                Percentage of Annual Rent
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
                placeholder="e.g., 5"
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
            <textarea name="specialConditions" value={formData.specialConditions} onChange={handleChange} style={styles.textarea} rows="3" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Additional Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} style={styles.textarea} rows="4" />
          </div>
        </fieldset>

        {/* Submit Buttons */}
        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={{...styles.submitButton, opacity: loading ? 0.6 : 1}}>
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
          <button type="button" onClick={handleCancel} style={styles.cancelButton}>
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
