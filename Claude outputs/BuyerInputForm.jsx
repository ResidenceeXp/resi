import React, { useState } from 'react';
import '../styles/forms.css';

function BuyerInputForm() {
  const [transactionType, setTransactionType] = useState('resale');
  const [formData, setFormData] = useState({
    // Primary Contact
    primaryFirstName: '',
    primaryLastName: '',
    primaryPhone: '',
    primaryEmail: '',
    trustLLC: false,
    trustLLCName: '',

    // Secondary Contact (optional)
    secondaryFirstName: '',
    secondaryLastName: '',
    secondaryPhone: '',
    secondaryEmail: '',
    secondaryRelationship: '',
    secondaryNickname: '',
    secondaryBirthDate: '',

    // Tertiary Contact (optional)
    tertiaryFirstName: '',
    tertiaryLastName: '',
    tertiaryPhone: '',
    tertiaryEmail: '',
    tertiaryRelationship: '',
    tertiaryNickname: '',
    tertiaryBirthDate: '',

    // Quaternary Contact (optional)
    quaternaryFirstName: '',
    quaternaryLastName: '',
    quaternaryPhone: '',
    quaternaryEmail: '',
    quaternaryRelationship: '',
    quaternaryNickname: '',
    quaternaryBirthDate: '',

    // Property Details
    propertyStreet: '',
    propertyCity: '',
    propertyState: 'FL',
    propertyZip: '',
    propertyCounty: 'Lee',
    hoaApprovalRequired: false,
    isCondo: false,

    // Transaction Details
    coAgent: '',
    leadGenSource: 'agent-generated',
    leadSourceDetail: '',
    underContractDate: '',
    forecastedClosingDate: '',
    dueDiligenceDeadline: '',

    // New Construction Specific
    builderName: '',
    communityName: '',
    lotNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.primaryFirstName.trim()) newErrors.primaryFirstName = 'First name required';
    if (!formData.primaryLastName.trim()) newErrors.primaryLastName = 'Last name required';
    if (!formData.primaryPhone.trim()) newErrors.primaryPhone = 'Phone required';
    if (!formData.primaryEmail.trim()) newErrors.primaryEmail = 'Email required';
    if (formData.trustLLC && !formData.trustLLCName.trim()) newErrors.trustLLCName = 'Trust/LLC name required';

    if (!formData.propertyStreet.trim()) newErrors.propertyStreet = 'Street address required';
    if (!formData.propertyCity.trim()) newErrors.propertyCity = 'City required';
    if (!formData.propertyZip.trim()) newErrors.propertyZip = 'Zip code required';

    if (!formData.underContractDate) newErrors.underContractDate = 'Under contract date required';
    if (!formData.forecastedClosingDate) newErrors.forecastedClosingDate = 'Closing date required';
    if (!formData.dueDiligenceDeadline) newErrors.dueDiligenceDeadline = 'Due diligence deadline required';

    if (transactionType === 'new-construction') {
      if (!formData.builderName.trim()) newErrors.builderName = 'Builder name required';
      if (!formData.communityName.trim()) newErrors.communityName = 'Community name required';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log('Buyer Input Form Submitted:', { transactionType, ...formData });
      alert(`Buyer transaction created! Type: ${transactionType.toUpperCase()}`);
      setSubmitted(true);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    setFormData({
      primaryFirstName: '',
      primaryLastName: '',
      primaryPhone: '',
      primaryEmail: '',
      trustLLC: false,
      trustLLCName: '',
      secondaryFirstName: '',
      secondaryLastName: '',
      secondaryPhone: '',
      secondaryEmail: '',
      secondaryRelationship: '',
      secondaryNickname: '',
      secondaryBirthDate: '',
      tertiaryFirstName: '',
      tertiaryLastName: '',
      tertiaryPhone: '',
      tertiaryEmail: '',
      tertiaryRelationship: '',
      tertiaryNickname: '',
      tertiaryBirthDate: '',
      quaternaryFirstName: '',
      quaternaryLastName: '',
      quaternaryPhone: '',
      quaternaryEmail: '',
      quaternaryRelationship: '',
      quaternaryNickname: '',
      quaternaryBirthDate: '',
      propertyStreet: '',
      propertyCity: '',
      propertyState: 'FL',
      propertyZip: '',
      propertyCounty: 'Lee',
      hoaApprovalRequired: false,
      isCondo: false,
      coAgent: '',
      leadGenSource: 'agent-generated',
      leadSourceDetail: '',
      underContractDate: '',
      forecastedClosingDate: '',
      dueDiligenceDeadline: '',
      builderName: '',
      communityName: '',
      lotNumber: '',
    });
    setErrors({});
    setTransactionType('resale');
    setSubmitted(false);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>New Buyer Transaction</h1>
        <p>Select transaction type and enter buyer information</p>
      </div>

      <form onSubmit={handleSubmit} className="buyer-form">
        {/* Transaction Type Selection */}
        <div className="form-section">
          <h2>Transaction Type</h2>
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="transactionType"
                value="resale"
                checked={transactionType === 'resale'}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              Resale
            </label>
            <label>
              <input
                type="radio"
                name="transactionType"
                value="new-construction"
                checked={transactionType === 'new-construction'}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              New Construction
            </label>
          </div>
        </div>

        {/* Primary Contact */}
        <div className="form-section">
          <h2>Primary Contact</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="primaryFirstName">First Name *</label>
              <input
                id="primaryFirstName"
                type="text"
                name="primaryFirstName"
                value={formData.primaryFirstName}
                onChange={handleInputChange}
                className={errors.primaryFirstName ? 'input-error' : ''}
              />
              {errors.primaryFirstName && <span className="error-text">{errors.primaryFirstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="primaryLastName">Last Name *</label>
              <input
                id="primaryLastName"
                type="text"
                name="primaryLastName"
                value={formData.primaryLastName}
                onChange={handleInputChange}
                className={errors.primaryLastName ? 'input-error' : ''}
              />
              {errors.primaryLastName && <span className="error-text">{errors.primaryLastName}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="primaryPhone">Phone *</label>
              <input
                id="primaryPhone"
                type="tel"
                name="primaryPhone"
                value={formData.primaryPhone}
                onChange={handleInputChange}
                placeholder="(239) 555-0000"
                className={errors.primaryPhone ? 'input-error' : ''}
              />
              {errors.primaryPhone && <span className="error-text">{errors.primaryPhone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="primaryEmail">Email *</label>
              <input
                id="primaryEmail"
                type="email"
                name="primaryEmail"
                value={formData.primaryEmail}
                onChange={handleInputChange}
                className={errors.primaryEmail ? 'input-error' : ''}
              />
              {errors.primaryEmail && <span className="error-text">{errors.primaryEmail}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="trustLLC"
                checked={formData.trustLLC}
                onChange={handleInputChange}
              />
              Buying as Trust or LLC
            </label>
            {formData.trustLLC && (
              <div className="form-group">
                <label htmlFor="trustLLCName">Trust/LLC Official Name *</label>
                <input
                  id="trustLLCName"
                  type="text"
                  name="trustLLCName"
                  value={formData.trustLLCName}
                  onChange={handleInputChange}
                  className={errors.trustLLCName ? 'input-error' : ''}
                />
                {errors.trustLLCName && <span className="error-text">{errors.trustLLCName}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Additional Contacts */}
        <div className="form-section">
          <h2>Additional Contacts (Optional)</h2>

          {/* Secondary Contact */}
          <div className="contact-group">
            <h3>Secondary Contact</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="secondaryFirstName">First Name</label>
                <input
                  id="secondaryFirstName"
                  type="text"
                  name="secondaryFirstName"
                  value={formData.secondaryFirstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="secondaryLastName">Last Name</label>
                <input
                  id="secondaryLastName"
                  type="text"
                  name="secondaryLastName"
                  value={formData.secondaryLastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="secondaryPhone">Phone</label>
                <input
                  id="secondaryPhone"
                  type="tel"
                  name="secondaryPhone"
                  value={formData.secondaryPhone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="secondaryEmail">Email</label>
                <input
                  id="secondaryEmail"
                  type="email"
                  name="secondaryEmail"
                  value={formData.secondaryEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="secondaryRelationship">Relationship</label>
                <input
                  id="secondaryRelationship"
                  type="text"
                  name="secondaryRelationship"
                  placeholder="Spouse, Partner, etc."
                  value={formData.secondaryRelationship}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="secondaryNickname">Nickname (optional)</label>
                <input
                  id="secondaryNickname"
                  type="text"
                  name="secondaryNickname"
                  value={formData.secondaryNickname}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="secondaryBirthDate">Birth Date (optional)</label>
              <input
                id="secondaryBirthDate"
                type="date"
                name="secondaryBirthDate"
                value={formData.secondaryBirthDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Tertiary Contact */}
          <div className="contact-group">
            <h3>Tertiary Contact</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tertiaryFirstName">First Name</label>
                <input
                  id="tertiaryFirstName"
                  type="text"
                  name="tertiaryFirstName"
                  value={formData.tertiaryFirstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tertiaryLastName">Last Name</label>
                <input
                  id="tertiaryLastName"
                  type="text"
                  name="tertiaryLastName"
                  value={formData.tertiaryLastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tertiaryPhone">Phone</label>
                <input
                  id="tertiaryPhone"
                  type="tel"
                  name="tertiaryPhone"
                  value={formData.tertiaryPhone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tertiaryEmail">Email</label>
                <input
                  id="tertiaryEmail"
                  type="email"
                  name="tertiaryEmail"
                  value={formData.tertiaryEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tertiaryRelationship">Relationship</label>
                <input
                  id="tertiaryRelationship"
                  type="text"
                  name="tertiaryRelationship"
                  placeholder="Spouse, Partner, etc."
                  value={formData.tertiaryRelationship}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tertiaryNickname">Nickname (optional)</label>
                <input
                  id="tertiaryNickname"
                  type="text"
                  name="tertiaryNickname"
                  value={formData.tertiaryNickname}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="tertiaryBirthDate">Birth Date (optional)</label>
              <input
                id="tertiaryBirthDate"
                type="date"
                name="tertiaryBirthDate"
                value={formData.tertiaryBirthDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Quaternary Contact */}
          <div className="contact-group">
            <h3>Quaternary Contact</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quaternaryFirstName">First Name</label>
                <input
                  id="quaternaryFirstName"
                  type="text"
                  name="quaternaryFirstName"
                  value={formData.quaternaryFirstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quaternaryLastName">Last Name</label>
                <input
                  id="quaternaryLastName"
                  type="text"
                  name="quaternaryLastName"
                  value={formData.quaternaryLastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quaternaryPhone">Phone</label>
                <input
                  id="quaternaryPhone"
                  type="tel"
                  name="quaternaryPhone"
                  value={formData.quaternaryPhone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quaternaryEmail">Email</label>
                <input
                  id="quaternaryEmail"
                  type="email"
                  name="quaternaryEmail"
                  value={formData.quaternaryEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quaternaryRelationship">Relationship</label>
                <input
                  id="quaternaryRelationship"
                  type="text"
                  name="quaternaryRelationship"
                  placeholder="Spouse, Partner, etc."
                  value={formData.quaternaryRelationship}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quaternaryNickname">Nickname (optional)</label>
                <input
                  id="quaternaryNickname"
                  type="text"
                  name="quaternaryNickname"
                  value={formData.quaternaryNickname}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="quaternaryBirthDate">Birth Date (optional)</label>
              <input
                id="quaternaryBirthDate"
                type="date"
                name="quaternaryBirthDate"
                value={formData.quaternaryBirthDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="form-section">
          <h2>Property Details</h2>
          <div className="form-group">
            <label htmlFor="propertyStreet">Street Address *</label>
            <input
              id="propertyStreet"
              type="text"
              name="propertyStreet"
              value={formData.propertyStreet}
              onChange={handleInputChange}
              className={errors.propertyStreet ? 'input-error' : ''}
            />
            {errors.propertyStreet && <span className="error-text">{errors.propertyStreet}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyCity">City *</label>
              <input
                id="propertyCity"
                type="text"
                name="propertyCity"
                value={formData.propertyCity}
                onChange={handleInputChange}
                className={errors.propertyCity ? 'input-error' : ''}
              />
              {errors.propertyCity && <span className="error-text">{errors.propertyCity}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="propertyState">State</label>
              <input
                id="propertyState"
                type="text"
                name="propertyState"
                value={formData.propertyState}
                onChange={handleInputChange}
                maxLength="2"
              />
            </div>
            <div className="form-group">
              <label htmlFor="propertyZip">Zip Code *</label>
              <input
                id="propertyZip"
                type="text"
                name="propertyZip"
                value={formData.propertyZip}
                onChange={handleInputChange}
                className={errors.propertyZip ? 'input-error' : ''}
              />
              {errors.propertyZip && <span className="error-text">{errors.propertyZip}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyCounty">County</label>
              <select
                id="propertyCounty"
                name="propertyCounty"
                value={formData.propertyCounty}
                onChange={handleInputChange}
              >
                <option value="Lee">Lee</option>
                <option value="Collier">Collier</option>
                <option value="Charlotte">Charlotte</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="hoaApprovalRequired"
                  checked={formData.hoaApprovalRequired}
                  onChange={handleInputChange}
                />
                HOA Approval Required
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isCondo"
                  checked={formData.isCondo}
                  onChange={handleInputChange}
                />
                Condo
              </label>
            </div>
          </div>
        </div>

        {/* New Construction Details (Conditional) */}
        {transactionType === 'new-construction' && (
          <div className="form-section builder-section">
            <h2>Builder & Community Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="builderName">Builder Name *</label>
                <input
                  id="builderName"
                  type="text"
                  name="builderName"
                  value={formData.builderName}
                  onChange={handleInputChange}
                  className={errors.builderName ? 'input-error' : ''}
                />
                {errors.builderName && <span className="error-text">{errors.builderName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="communityName">Community Name *</label>
                <input
                  id="communityName"
                  type="text"
                  name="communityName"
                  value={formData.communityName}
                  onChange={handleInputChange}
                  className={errors.communityName ? 'input-error' : ''}
                />
                {errors.communityName && <span className="error-text">{errors.communityName}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="lotNumber">Lot Number</label>
              <input
                id="lotNumber"
                type="text"
                name="lotNumber"
                value={formData.lotNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* Transaction Details */}
        <div className="form-section">
          <h2>Transaction Details</h2>
          <div className="form-group">
            <label htmlFor="coAgent">Co-Agent (Optional)</label>
            <input
              id="coAgent"
              type="text"
              name="coAgent"
              value={formData.coAgent}
              onChange={handleInputChange}
              placeholder="Select from agent list"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="leadGenSource">Lead Generation Source</label>
              <select
                id="leadGenSource"
                name="leadGenSource"
                value={formData.leadGenSource}
                onChange={handleInputChange}
              >
                <option value="agent-generated">Agent Generated</option>
                <option value="team-generated">Team Generated</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="leadSourceDetail">Lead Source Detail</label>
            <select
              id="leadSourceDetail"
              name="leadSourceDetail"
              value={formData.leadSourceDetail}
              onChange={handleInputChange}
            >
              {formData.leadGenSource === 'agent-generated' ? (
                <>
                  <option value="">Select...</option>
                  <option value="farming">Farming</option>
                  <option value="sphere">Sphere of Influence</option>
                  <option value="friends-family">Friends and Family</option>
                  <option value="personal-referral">Personal Referral</option>
                  <option value="past-client">Past Client</option>
                  <option value="open-house">Open House</option>
                  <option value="other">Other</option>
                </>
              ) : (
                <>
                  <option value="">Select...</option>
                  <option value="google-ppc">Google PPC</option>
                  <option value="listing-meta">Listing Meta Ad</option>
                  <option value="team-leader">Team Leader Referral</option>
                  <option value="database">Database Pond</option>
                  <option value="team-marketing">Team Marketing</option>
                  <option value="other">Other</option>
                </>
              )}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="underContractDate">Under Contract Date *</label>
              <input
                id="underContractDate"
                type="date"
                name="underContractDate"
                value={formData.underContractDate}
                onChange={handleInputChange}
                className={errors.underContractDate ? 'input-error' : ''}
              />
              {errors.underContractDate && <span className="error-text">{errors.underContractDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="forecastedClosingDate">Forecasted Closing Date *</label>
              <input
                id="forecastedClosingDate"
                type="date"
                name="forecastedClosingDate"
                value={formData.forecastedClosingDate}
                onChange={handleInputChange}
                className={errors.forecastedClosingDate ? 'input-error' : ''}
              />
              {errors.forecastedClosingDate && <span className="error-text">{errors.forecastedClosingDate}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="dueDiligenceDeadline">Due Diligence/Inspection Deadline *</label>
            <input
              id="dueDiligenceDeadline"
              type="date"
              name="dueDiligenceDeadline"
              value={formData.dueDiligenceDeadline}
              onChange={handleInputChange}
              className={errors.dueDiligenceDeadline ? 'input-error' : ''}
            />
            {errors.dueDiligenceDeadline && <span className="error-text">{errors.dueDiligenceDeadline}</span>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Create Buyer Transaction
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default BuyerInputForm;
