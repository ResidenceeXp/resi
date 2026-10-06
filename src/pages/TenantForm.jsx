import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import getTransactionById - removed
import { generateTasksForTransaction } from '../services/taskService';
// import notificationTriggerService - removed
import { ArrowLeft, Home, FileText } from 'lucide-react';

export default function TenantForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    // Tenant Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    occupation: '',
    
    // Property Information
    propertyAddress: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'Single Family',
    bedrooms: '',
    bathrooms: '',
    
    // Landlord Information
    landlordName: '',
    landlordPhone: '',
    landlordEmail: '',
    managementCompany: '',
    
    // Lease Information
    leaseStartDate: '',
    leaseEndDate: '',
    leaseTermMonths: '',
    rentalPrice: '',
    securityDeposit: '',
    petDeposit: '',
    leaseType: 'Fixed Term',
    
    // Pet Information
    petName: '',
    petType: '',
    petBreed: '',
    petWeight: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Co-Tenants
    coTenant1Name: '',
    coTenant1Phone: '',
    coTenant2Name: '',
    coTenant2Phone: '',
    
    // Financial Information
    employmentStatus: 'Employed',
    income: '',
    incomeVerification: false,
    references: false,
    backgroundCheck: false,
    
    // Move-In Details
    moveInDate: '',
    moveInConditionReport: false,
    utilitiesSetup: false,
    keyReceived: false,
    orientationCompleted: false,
    
    // Lease Policies
    smokingAllowed: false,
    petsAllowed: false,
    guestsAllowed: false,
    waterbed: false,

    // Commission Information
    commissionType: 'percentage', // 'percentage' or 'dollar'
    commissionPercentage: '',
    commissionDollarAmount: '',
    leadSource: 'agent-generated', // 'agent-generated' or 'team-generated'

    // Additional Notes
    specialRequests: '',
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

      const transactionId = await createTransaction(user.uid, formData, 'Tenant');

      // Generate tasks based on lease start date
      if (transactionId) {
        await generateTasksForTransaction(user.uid, transactionId, 'Tenant', formData.leaseStartDate);

        // Get the transaction details and send created notification
        const transaction = await [].filter(user.uid, transactionId);
        if (transaction) {
          await sendTransactionCreatedNotification(user.uid, transaction);
        }
      }

      alert('Tenant transaction saved successfully!\nAssociated tasks have been generated.');
      navigate('/transactions');
    } catch (error) {
      console.error('Error saving tenant transaction:', error);
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

      <h1 style={styles.title}>Tenant Transaction Form</h1>

      {submitError && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>Error: {submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Tenant Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Tenant Information</legend>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Occupation</label>
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} style={styles.input} />
            </div>
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
          <legend style={styles.legend}>Rental Property Information</legend>
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
                <option>Apartment</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Multi-Family</option>
                <option>Other</option>
              </select>
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
        </fieldset>

        {/* Landlord Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Landlord & Management</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Landlord Name</label>
            <input type="text" name="landlordName" value={formData.landlordName} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Landlord Phone</label>
              <input type="tel" name="landlordPhone" value={formData.landlordPhone} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Landlord Email</label>
              <input type="email" name="landlordEmail" value={formData.landlordEmail} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Property Management Company</label>
            <input type="text" name="managementCompany" value={formData.managementCompany} onChange={handleChange} style={styles.input} />
          </div>
        </fieldset>

        {/* Lease Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Lease Information</legend>
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
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lease Term (Months)</label>
              <input type="number" name="leaseTermMonths" value={formData.leaseTermMonths} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lease Type</label>
              <select name="leaseType" value={formData.leaseType} onChange={handleChange} style={styles.input}>
                <option>Fixed Term</option>
                <option>Month-to-Month</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Monthly Rent</label>
              <input type="number" name="rentalPrice" value={formData.rentalPrice} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Security Deposit</label>
              <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Pet Deposit</label>
            <input type="number" name="petDeposit" value={formData.petDeposit} onChange={handleChange} style={styles.input} />
          </div>
        </fieldset>

        {/* Pet Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Pet Information</legend>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Pet Name</label>
              <input type="text" name="petName" value={formData.petName} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Pet Type</label>
              <input type="text" name="petType" value={formData.petType} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Pet Breed</label>
              <input type="text" name="petBreed" value={formData.petBreed} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Pet Weight (lbs)</label>
              <input type="number" name="petWeight" value={formData.petWeight} onChange={handleChange} style={styles.input} />
            </div>
          </div>
        </fieldset>

        {/* Emergency Contact */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Emergency Contact</legend>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Contact Name</label>
              <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Relationship</label>
              <input type="text" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} style={styles.input} />
          </div>
        </fieldset>

        {/* Co-Tenants */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Co-Tenants</legend>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Co-Tenant 1 Name</label>
              <input type="text" name="coTenant1Name" value={formData.coTenant1Name} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Co-Tenant 1 Phone</label>
              <input type="tel" name="coTenant1Phone" value={formData.coTenant1Phone} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Co-Tenant 2 Name</label>
              <input type="text" name="coTenant2Name" value={formData.coTenant2Name} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Co-Tenant 2 Phone</label>
              <input type="tel" name="coTenant2Phone" value={formData.coTenant2Phone} onChange={handleChange} style={styles.input} />
            </div>
          </div>
        </fieldset>

        {/* Financial Information */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Financial Information</legend>
          <div style={styles.twoColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Employment Status</label>
              <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} style={styles.input}>
                <option>Employed</option>
                <option>Self-Employed</option>
                <option>Retired</option>
                <option>Student</option>
                <option>Other</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Annual Income</label>
              <input type="number" name="income" value={formData.income} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="incomeVerification" checked={formData.incomeVerification} onChange={handleChange} />
              Income Verified
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="references" checked={formData.references} onChange={handleChange} />
              References Provided
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="backgroundCheck" checked={formData.backgroundCheck} onChange={handleChange} />
              Background Check Completed
            </label>
          </div>
        </fieldset>

        {/* Move-In Details */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Move-In Details</legend>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Move-In Date</label>
            <input type="date" name="moveInDate" value={formData.moveInDate} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="moveInConditionReport" checked={formData.moveInConditionReport} onChange={handleChange} />
              Move-In Condition Report Completed
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="utilitiesSetup" checked={formData.utilitiesSetup} onChange={handleChange} />
              Utilities Setup
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="keyReceived" checked={formData.keyReceived} onChange={handleChange} />
              Keys Received
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="orientationCompleted" checked={formData.orientationCompleted} onChange={handleChange} />
              Orientation Completed
            </label>
          </div>
        </fieldset>

        {/* Lease Policies */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Lease Policies</legend>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="smokingAllowed" checked={formData.smokingAllowed} onChange={handleChange} />
              Smoking Allowed
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="petsAllowed" checked={formData.petsAllowed} onChange={handleChange} />
              Pets Allowed
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="guestsAllowed" checked={formData.guestsAllowed} onChange={handleChange} />
              Guests/Visitors Allowed
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="waterbed" checked={formData.waterbed} onChange={handleChange} />
              Waterbed Allowed
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
            <label style={styles.label}>Special Requests</label>
            <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} style={styles.textarea} rows="3" />
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
