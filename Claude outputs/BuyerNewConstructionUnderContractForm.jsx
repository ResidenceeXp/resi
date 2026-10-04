import React, { useState } from 'react';
import '../styles/forms.css';

function BuyerNewConstructionUnderContractForm() {
  const [formData, setFormData] = useState({
    propertyAddress: '',
    builderName: '',
    communityName: '',
    lotNumber: '',
    floorPlan: '',
    contractDate: '',
    closingDate: '',
    purchasePrice: '',
    selectionCompleted: false,
    builderMeetingDate: '',
    builderMeetingNotes: '',
    blueTapeWalkthrough: '',
    blueTapeNotes: '',
    builderOrientation: '',
    keyPickupTiming: '',
    closingWeekInstructions: '',
    buyerNotificationRequired: false,
    warrantyExpiration: '',
    warrantyCoverage: '',
    insuranceRecommendations: '',
    wireFraudNotification: false,
    lenderName: '',
    lenderPhone: '',
    titleCompanyName: '',
    titleCompanyContact: '',
    closingAttorneyName: '',
    closingAttorneyPhone: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Required';
    if (!formData.builderName.trim()) newErrors.builderName = 'Required';
    if (!formData.contractDate) newErrors.contractDate = 'Required';
    if (!formData.closingDate) newErrors.closingDate = 'Required';
    if (!formData.purchasePrice) newErrors.purchasePrice = 'Required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log('Buyer New Construction Under Contract Submitted:', formData);
      alert('New construction transaction details saved successfully!');
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  // Calculate 11-month warranty expiration from closing
  React.useEffect(() => {
    if (formData.closingDate) {
      const date = new Date(formData.closingDate);
      date.setMonth(date.getMonth() + 11);
      setFormData(prev => ({
        ...prev,
        warrantyExpiration: date.toISOString().split('T')[0]
      }));
    }
  }, [formData.closingDate]);

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Buyer - New Construction Under Contract</h1>
        <p>Track new construction transaction details, builder coordination, and warranty</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Property & Builder Information</h2>
          <div className="form-group">
            <label htmlFor="propertyAddress">Property Address *</label>
            <input id="propertyAddress" type="text" name="propertyAddress" value={formData.propertyAddress} onChange={handleInputChange} className={errors.propertyAddress ? 'input-error' : ''} />
            {errors.propertyAddress && <span className="error-text">{errors.propertyAddress}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="builderName">Builder Name *</label>
              <input id="builderName" type="text" name="builderName" value={formData.builderName} onChange={handleInputChange} className={errors.builderName ? 'input-error' : ''} />
              {errors.builderName && <span className="error-text">{errors.builderName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="communityName">Community Name</label>
              <input id="communityName" type="text" name="communityName" value={formData.communityName} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lotNumber">Lot Number</label>
              <input id="lotNumber" type="text" name="lotNumber" value={formData.lotNumber} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="floorPlan">Floor Plan</label>
              <input id="floorPlan" type="text" name="floorPlan" value={formData.floorPlan} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Contract Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contractDate">Contract Date *</label>
              <input id="contractDate" type="date" name="contractDate" value={formData.contractDate} onChange={handleInputChange} className={errors.contractDate ? 'input-error' : ''} />
              {errors.contractDate && <span className="error-text">{errors.contractDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="closingDate">Expected Closing Date *</label>
              <input id="closingDate" type="date" name="closingDate" value={formData.closingDate} onChange={handleInputChange} className={errors.closingDate ? 'input-error' : ''} />
              {errors.closingDate && <span className="error-text">{errors.closingDate}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="purchasePrice">Purchase Price *</label>
              <input id="purchasePrice" type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} className={errors.purchasePrice ? 'input-error' : ''} />
              {errors.purchasePrice && <span className="error-text">{errors.purchasePrice}</span>}
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" name="selectionCompleted" checked={formData.selectionCompleted} onChange={handleInputChange} />
                Buyer Selections Completed
              </label>
            </div>
          </div>
        </div>

        <div className="form-section builder-section">
          <h2>Builder Coordination</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="builderMeetingDate">Builder Meeting/Walkthrough Date</label>
              <input id="builderMeetingDate" type="date" name="builderMeetingDate" value={formData.builderMeetingDate} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="blueTapeWalkthrough">Blue Tape Walkthrough Date</label>
              <input id="blueTapeWalkthrough" type="date" name="blueTapeWalkthrough" value={formData.blueTapeWalkthrough} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="builderMeetingNotes">Builder Meeting Notes</label>
            <textarea id="builderMeetingNotes" name="builderMeetingNotes" value={formData.builderMeetingNotes} onChange={handleInputChange} rows="3" />
          </div>
          <div className="form-group">
            <label htmlFor="blueTapeNotes">Blue Tape Items & Notes</label>
            <textarea id="blueTapeNotes" name="blueTapeNotes" value={formData.blueTapeNotes} onChange={handleInputChange} rows="3" placeholder="Items flagged by builder for buyer attention" />
          </div>
          <div className="form-group">
            <label htmlFor="builderOrientation">Builder Orientation Information</label>
            <textarea id="builderOrientation" name="builderOrientation" value={formData.builderOrientation} onChange={handleInputChange} rows="2" placeholder="Details about home orientation, systems, warranties provided by builder" />
          </div>
          <div className="form-group">
            <label htmlFor="keyPickupTiming">Key Pickup Timing & Location</label>
            <input id="keyPickupTiming" type="text" name="keyPickupTiming" value={formData.keyPickupTiming} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-section">
          <h2>Closing Week Coordination</h2>
          <div className="form-group">
            <label htmlFor="closingWeekInstructions">Closing Week Instructions</label>
            <textarea id="closingWeekInstructions" name="closingWeekInstructions" value={formData.closingWeekInstructions} onChange={handleInputChange} rows="3" placeholder="Builder walkthrough schedule, final inspections, other closing week coordination" />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" name="buyerNotificationRequired" checked={formData.buyerNotificationRequired} onChange={handleInputChange} />
              Buyer Notification Required for Closing Timeline
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Warranty Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="warrantyExpiration">11-Month Warranty Expiration Date</label>
              <input id="warrantyExpiration" type="date" name="warrantyExpiration" value={formData.warrantyExpiration} onChange={handleInputChange} readOnly />
              <small>Auto-calculated: 11 months from closing date</small>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="warrantyCoverage">Warranty Coverage Details</label>
            <textarea id="warrantyCoverage" name="warrantyCoverage" value={formData.warrantyCoverage} onChange={handleInputChange} rows="2" placeholder="What's covered by builder warranty, contact for warranty issues" />
          </div>
        </div>

        <div className="form-section">
          <h2>Buyer Notifications & Insurance</h2>
          <div className="form-group">
            <label htmlFor="insuranceRecommendations">Insurance Recommendations</label>
            <textarea id="insuranceRecommendations" name="insuranceRecommendations" value={formData.insuranceRecommendations} onChange={handleInputChange} rows="2" placeholder="Special insurance considerations for new construction (builder incentives, etc)" />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" name="wireFraudNotification" checked={formData.wireFraudNotification} onChange={handleInputChange} />
              Wire Fraud Notification Sent
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Closing Team</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lenderName">Lender Name</label>
              <input id="lenderName" type="text" name="lenderName" value={formData.lenderName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="lenderPhone">Lender Contact</label>
              <input id="lenderPhone" type="tel" name="lenderPhone" value={formData.lenderPhone} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="titleCompanyName">Title Company</label>
              <input id="titleCompanyName" type="text" name="titleCompanyName" value={formData.titleCompanyName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="titleCompanyContact">Title Company Contact</label>
              <input id="titleCompanyContact" type="tel" name="titleCompanyContact" value={formData.titleCompanyContact} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save New Construction Details</button>
        </div>
      </form>
    </div>
  );
}

export default BuyerNewConstructionUnderContractForm;
