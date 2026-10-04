import React, { useState } from 'react';
import '../styles/forms.css';

function SellerListingInputForm() {
  const [formData, setFormData] = useState({
    // Agent Info (auto-populated in real app)
    agent: '',

    // Property Details
    propertyStreet: '',
    propertyCity: '',
    propertyState: 'FL',
    propertyZip: '',
    propertyCounty: 'Lee',

    // Listing Details
    coListAgent: '',
    anticipatedListingDate: '',
    photographyDate: '',
    listingVideoScriptDueDate: '',
    showingTimeSetupDate: '',

    // Property Type
    propertyType: 'single-family',
    yearBuilt: '',
    squareFootage: '',
    bedrooms: '',
    bathrooms: '',

    // Additional Info
    listingNotes: '',
    specialInstructions: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.propertyStreet.trim()) newErrors.propertyStreet = 'Street address required';
    if (!formData.propertyCity.trim()) newErrors.propertyCity = 'City required';
    if (!formData.propertyZip.trim()) newErrors.propertyZip = 'Zip code required';
    if (!formData.anticipatedListingDate) newErrors.anticipatedListingDate = 'Anticipated listing date required';
    if (!formData.photographyDate) newErrors.photographyDate = 'Photography date required';
    if (!formData.listingVideoScriptDueDate) newErrors.listingVideoScriptDueDate = 'Video script due date required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log('Seller Listing Input Form Submitted:', formData);
      alert('Seller listing created successfully!');
      setSubmitted(true);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    setFormData({
      agent: '',
      propertyStreet: '',
      propertyCity: '',
      propertyState: 'FL',
      propertyZip: '',
      propertyCounty: 'Lee',
      coListAgent: '',
      anticipatedListingDate: '',
      photographyDate: '',
      listingVideoScriptDueDate: '',
      showingTimeSetupDate: '',
      propertyType: 'single-family',
      yearBuilt: '',
      squareFootage: '',
      bedrooms: '',
      bathrooms: '',
      listingNotes: '',
      specialInstructions: '',
    });
    setErrors({});
    setSubmitted(false);
  };

  // Calculate deadline dates based on photography date
  const calculateDueDate = (baseDate, daysOffset) => {
    if (!baseDate) return '';
    const date = new Date(baseDate);
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  };

  // Auto-calculate video script due date (3 days before photos)
  React.useEffect(() => {
    if (formData.photographyDate) {
      const calculatedDate = calculateDueDate(formData.photographyDate, -3);
      if (calculatedDate && !formData.listingVideoScriptDueDate) {
        setFormData(prev => ({
          ...prev,
          listingVideoScriptDueDate: calculatedDate
        }));
      }
    }
  }, [formData.photographyDate]);

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>New Seller Listing</h1>
        <p>Enter property details and listing timeline information</p>
      </div>

      <form onSubmit={handleSubmit} className="seller-form">
        {/* Property Details */}
        <div className="form-section">
          <h2>Property Information</h2>
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
              <label htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
              >
                <option value="single-family">Single Family</option>
                <option value="condo">Condo</option>
                <option value="townhome">Townhome</option>
                <option value="vacant-land">Vacant Land</option>
                <option value="multi-family">Multi-Family</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="yearBuilt">Year Built</label>
              <input
                id="yearBuilt"
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="form-group">
              <label htmlFor="squareFootage">Square Footage</label>
              <input
                id="squareFootage"
                type="number"
                name="squareFootage"
                value={formData.squareFootage}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                id="bedrooms"
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                id="bathrooms"
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Listing Timeline */}
        <div className="form-section">
          <h2>Listing Timeline</h2>
          <p className="section-info">Photography date: 3-day countdown to script due date is automatic</p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="anticipatedListingDate">Anticipated Listing Date *</label>
              <input
                id="anticipatedListingDate"
                type="date"
                name="anticipatedListingDate"
                value={formData.anticipatedListingDate}
                onChange={handleInputChange}
                className={errors.anticipatedListingDate ? 'input-error' : ''}
              />
              {errors.anticipatedListingDate && <span className="error-text">{errors.anticipatedListingDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="photographyDate">Photography Date *</label>
              <input
                id="photographyDate"
                type="date"
                name="photographyDate"
                value={formData.photographyDate}
                onChange={handleInputChange}
                className={errors.photographyDate ? 'input-error' : ''}
              />
              {errors.photographyDate && <span className="error-text">{errors.photographyDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="listingVideoScriptDueDate">Listing Video Script Due Date (3 days before photos) *</label>
              <input
                id="listingVideoScriptDueDate"
                type="date"
                name="listingVideoScriptDueDate"
                value={formData.listingVideoScriptDueDate}
                onChange={handleInputChange}
                className={errors.listingVideoScriptDueDate ? 'input-error' : ''}
                readOnly
              />
              {errors.listingVideoScriptDueDate && <span className="error-text">{errors.listingVideoScriptDueDate}</span>}
              <small>Auto-calculated from photography date</small>
            </div>
            <div className="form-group">
              <label htmlFor="showingTimeSetupDate">ShowingTime Setup Date</label>
              <input
                id="showingTimeSetupDate"
                type="date"
                name="showingTimeSetupDate"
                value={formData.showingTimeSetupDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Listing Team */}
        <div className="form-section">
          <h2>Listing Team</h2>
          <div className="form-group">
            <label htmlFor="agent">Listing Agent (Your Name)</label>
            <input
              id="agent"
              type="text"
              name="agent"
              value={formData.agent}
              onChange={handleInputChange}
              placeholder="Auto-populated from login"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="coListAgent">Co-List Agent (Optional)</label>
            <input
              id="coListAgent"
              type="text"
              name="coListAgent"
              value={formData.coListAgent}
              onChange={handleInputChange}
              placeholder="Select from agent list"
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="listingNotes">Listing Notes</label>
            <textarea
              id="listingNotes"
              name="listingNotes"
              value={formData.listingNotes}
              onChange={handleInputChange}
              rows="4"
              placeholder="Any special information about the listing..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="specialInstructions">Special Instructions</label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows="4"
              placeholder="Special handling instructions for marketing, access, etc..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Create Seller Listing
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default SellerListingInputForm;
