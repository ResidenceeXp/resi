import React, { useState } from 'react';
import '../styles/forms.css';

function LandlordInputForm() {
  const [formData, setFormData] = useState({
    propertyStreet: '',
    propertyCity: '',
    propertyState: 'FL',
    propertyZip: '',
    propertyCounty: 'Lee',
    propertyType: 'single-family',
    landlordFirstName: '',
    landlordLastName: '',
    landlordPhone: '',
    landlordEmail: '',
    businessName: '',
    managementCompany: '',
    managementContact: '',
    annualRent: '',
    tenantCount: '',
    propertyNotes: '',
    specialInstructions: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.propertyStreet.trim()) newErrors.propertyStreet = 'Required';
    if (!formData.propertyCity.trim()) newErrors.propertyCity = 'Required';
    if (!formData.propertyZip.trim()) newErrors.propertyZip = 'Required';
    if (!formData.landlordFirstName.trim()) newErrors.landlordFirstName = 'Required';
    if (!formData.landlordLastName.trim()) newErrors.landlordLastName = 'Required';
    if (!formData.landlordPhone.trim()) newErrors.landlordPhone = 'Required';
    if (!formData.landlordEmail.trim()) newErrors.landlordEmail = 'Required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log('Landlord Input Form Submitted:', formData);
      alert('Landlord property record created successfully!');
      setFormData({
        propertyStreet: '', propertyCity: '', propertyState: 'FL', propertyZip: '',
        propertyCounty: 'Lee', propertyType: 'single-family', landlordFirstName: '',
        landlordLastName: '', landlordPhone: '', landlordEmail: '', businessName: '',
        managementCompany: '', managementContact: '', annualRent: '', tenantCount: '',
        propertyNotes: '', specialInstructions: '',
      });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>New Landlord Property</h1>
        <p>Rental property can have multiple lease periods with separate tenant records</p>
      </div>

      <form onSubmit={handleSubmit} className="landlord-form">
        <div className="form-section">
          <h2>Property Information</h2>
          <div className="form-group">
            <label htmlFor="propertyStreet">Street Address *</label>
            <input id="propertyStreet" type="text" name="propertyStreet" value={formData.propertyStreet} onChange={handleInputChange} className={errors.propertyStreet ? 'input-error' : ''} />
            {errors.propertyStreet && <span className="error-text">{errors.propertyStreet}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyCity">City *</label>
              <input id="propertyCity" type="text" name="propertyCity" value={formData.propertyCity} onChange={handleInputChange} className={errors.propertyCity ? 'input-error' : ''} />
              {errors.propertyCity && <span className="error-text">{errors.propertyCity}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="propertyZip">Zip Code *</label>
              <input id="propertyZip" type="text" name="propertyZip" value={formData.propertyZip} onChange={handleInputChange} className={errors.propertyZip ? 'input-error' : ''} />
              {errors.propertyZip && <span className="error-text">{errors.propertyZip}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyCounty">County</label>
              <select id="propertyCounty" name="propertyCounty" value={formData.propertyCounty} onChange={handleInputChange}>
                <option value="Lee">Lee</option>
                <option value="Collier">Collier</option>
                <option value="Charlotte">Charlotte</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="propertyType">Property Type</label>
              <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleInputChange}>
                <option value="single-family">Single Family</option>
                <option value="condo">Condo</option>
                <option value="multi-unit">Multi-Unit</option>
                <option value="vacant-land">Vacant Land</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Landlord Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="landlordFirstName">First Name *</label>
              <input id="landlordFirstName" type="text" name="landlordFirstName" value={formData.landlordFirstName} onChange={handleInputChange} className={errors.landlordFirstName ? 'input-error' : ''} />
              {errors.landlordFirstName && <span className="error-text">{errors.landlordFirstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="landlordLastName">Last Name *</label>
              <input id="landlordLastName" type="text" name="landlordLastName" value={formData.landlordLastName} onChange={handleInputChange} className={errors.landlordLastName ? 'input-error' : ''} />
              {errors.landlordLastName && <span className="error-text">{errors.landlordLastName}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="landlordPhone">Phone *</label>
              <input id="landlordPhone" type="tel" name="landlordPhone" value={formData.landlordPhone} onChange={handleInputChange} className={errors.landlordPhone ? 'input-error' : ''} />
              {errors.landlordPhone && <span className="error-text">{errors.landlordPhone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="landlordEmail">Email *</label>
              <input id="landlordEmail" type="email" name="landlordEmail" value={formData.landlordEmail} onChange={handleInputChange} className={errors.landlordEmail ? 'input-error' : ''} />
              {errors.landlordEmail && <span className="error-text">{errors.landlordEmail}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="businessName">Business Name</label>
              <input id="businessName" type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="managementCompany">Management Company</label>
              <input id="managementCompany" type="text" name="managementCompany" value={formData.managementCompany} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="managementContact">Management Contact Information</label>
            <input id="managementContact" type="text" name="managementContact" value={formData.managementContact} onChange={handleInputChange} placeholder="Phone/Email for property management" />
          </div>
        </div>

        <div className="form-section">
          <h2>Property Management Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="annualRent">Annual Rent Income</label>
              <input id="annualRent" type="number" name="annualRent" value={formData.annualRent} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="tenantCount">Expected Tenant Count</label>
              <input id="tenantCount" type="number" name="tenantCount" value={formData.tenantCount} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="propertyNotes">Property Notes</label>
            <textarea id="propertyNotes" name="propertyNotes" value={formData.propertyNotes} onChange={handleInputChange} rows="3" />
          </div>
          <div className="form-group">
            <label htmlFor="specialInstructions">Special Instructions</label>
            <textarea id="specialInstructions" name="specialInstructions" value={formData.specialInstructions} onChange={handleInputChange} rows="3" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Landlord Property</button>
          <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>Reset</button>
        </div>
      </form>
    </div>
  );
}

export default LandlordInputForm;
