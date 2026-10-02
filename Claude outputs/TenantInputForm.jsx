import React, { useState } from 'react';
import '../styles/forms.css';

function TenantInputForm() {
  const [formData, setFormData] = useState({
    tenantFirstName: '',
    tenantLastName: '',
    tenantPhone: '',
    tenantEmail: '',
    tenantOccupation: '',
    moveInDate: '',
    budgetMin: '',
    budgetMax: '',
    bedroomPreference: '',
    bathroomPreference: '',
    amenityPreferences: '',
    locationPreferences: '',
    petInfo: '',
    leaseDurationPreference: '',
    additionalNotes: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tenantFirstName.trim()) newErrors.tenantFirstName = 'Required';
    if (!formData.tenantLastName.trim()) newErrors.tenantLastName = 'Required';
    if (!formData.tenantPhone.trim()) newErrors.tenantPhone = 'Required';
    if (!formData.tenantEmail.trim()) newErrors.tenantEmail = 'Required';
    if (!formData.budgetMin && !formData.budgetMax) newErrors.budgetMin = 'Budget range required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log('Tenant Input Form Submitted:', formData);
      alert('Tenant profile created successfully!');
      setFormData({
        tenantFirstName: '', tenantLastName: '', tenantPhone: '', tenantEmail: '',
        tenantOccupation: '', moveInDate: '', budgetMin: '', budgetMax: '',
        bedroomPreference: '', bathroomPreference: '', amenityPreferences: '',
        locationPreferences: '', petInfo: '', leaseDurationPreference: '', additionalNotes: '',
      });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>New Tenant Prospect</h1>
        <p>Capture tenant search criteria and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="tenant-form">
        <div className="form-section">
          <h2>Tenant Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tenantFirstName">First Name *</label>
              <input id="tenantFirstName" type="text" name="tenantFirstName" value={formData.tenantFirstName} onChange={handleInputChange} className={errors.tenantFirstName ? 'input-error' : ''} />
              {errors.tenantFirstName && <span className="error-text">{errors.tenantFirstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="tenantLastName">Last Name *</label>
              <input id="tenantLastName" type="text" name="tenantLastName" value={formData.tenantLastName} onChange={handleInputChange} className={errors.tenantLastName ? 'input-error' : ''} />
              {errors.tenantLastName && <span className="error-text">{errors.tenantLastName}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tenantPhone">Phone *</label>
              <input id="tenantPhone" type="tel" name="tenantPhone" value={formData.tenantPhone} onChange={handleInputChange} className={errors.tenantPhone ? 'input-error' : ''} />
              {errors.tenantPhone && <span className="error-text">{errors.tenantPhone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="tenantEmail">Email *</label>
              <input id="tenantEmail" type="email" name="tenantEmail" value={formData.tenantEmail} onChange={handleInputChange} className={errors.tenantEmail ? 'input-error' : ''} />
              {errors.tenantEmail && <span className="error-text">{errors.tenantEmail}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tenantOccupation">Occupation</label>
              <input id="tenantOccupation" type="text" name="tenantOccupation" value={formData.tenantOccupation} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="moveInDate">Desired Move-In Date</label>
              <input id="moveInDate" type="date" name="moveInDate" value={formData.moveInDate} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Search Criteria</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budgetMin">Budget Minimum (Monthly Rent) *</label>
              <input id="budgetMin" type="number" name="budgetMin" value={formData.budgetMin} onChange={handleInputChange} className={errors.budgetMin ? 'input-error' : ''} />
              {errors.budgetMin && <span className="error-text">{errors.budgetMin}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="budgetMax">Budget Maximum (Monthly Rent)</label>
              <input id="budgetMax" type="number" name="budgetMax" value={formData.budgetMax} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bedroomPreference">Bedroom Preference</label>
              <select id="bedroomPreference" name="bedroomPreference" value={formData.bedroomPreference} onChange={handleInputChange}>
                <option value="">Select...</option>
                <option value="studio">Studio</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4+">4+ Bedrooms</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="bathroomPreference">Bathroom Preference</label>
              <select id="bathroomPreference" name="bathroomPreference" value={formData.bathroomPreference} onChange={handleInputChange}>
                <option value="">Select...</option>
                <option value="1">1 Bathroom</option>
                <option value="1.5">1.5 Bathrooms</option>
                <option value="2">2 Bathrooms</option>
                <option value="2.5">2.5+ Bathrooms</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="amenityPreferences">Amenity Preferences</label>
            <input id="amenityPreferences" type="text" name="amenityPreferences" value={formData.amenityPreferences} onChange={handleInputChange} placeholder="Pool, gym, parking, etc." />
          </div>
          <div className="form-group">
            <label htmlFor="locationPreferences">Location Preferences</label>
            <input id="locationPreferences" type="text" name="locationPreferences" value={formData.locationPreferences} onChange={handleInputChange} placeholder="Estero, Bonita Springs, Naples, etc." />
          </div>
        </div>

        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="petInfo">Pet Information</label>
            <textarea id="petInfo" name="petInfo" value={formData.petInfo} onChange={handleInputChange} rows="2" placeholder="Pet type, size, breed..." />
          </div>
          <div className="form-group">
            <label htmlFor="leaseDurationPreference">Lease Duration Preference</label>
            <select id="leaseDurationPreference" name="leaseDurationPreference" value={formData.leaseDurationPreference} onChange={handleInputChange}>
              <option value="">Select...</option>
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="12-months">12 Months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="additionalNotes">Additional Notes</label>
            <textarea id="additionalNotes" name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} rows="3" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Tenant Profile</button>
          <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>Reset</button>
        </div>
      </form>
    </div>
  );
}

export default TenantInputForm;
