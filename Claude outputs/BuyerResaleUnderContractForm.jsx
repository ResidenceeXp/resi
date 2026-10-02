import React, { useState } from 'react';
import '../styles/forms.css';

function BuyerResaleUnderContractForm() {
  const [formData, setFormData] = useState({
    propertyAddress: '',
    contractDate: '',
    closingDate: '',
    purchasePrice: '',
    earnestMoneyAmount: '',
    earnestMoneyDueDate: '',
    secondEarnestMoneyDueDate: '',
    inspectionDeadline: '',
    financingDeadline: '',
    appraisalDate: '',
    homeInspectionDate: '',
    finalWalkthrough: '',
    lenderName: '',
    lenderPhone: '',
    titleCompanyName: '',
    titleCompanyContact: '',
    closingAttorneyName: '',
    closingAttorneyPhone: '',
    cooperatingAgentName: '',
    cooperatingAgentBrokerage: '',
    cooperatingAgentPhone: '',
    sellerName: '',
    sellerPhone: '',
    contractNotes: '',
    specialConditions: '',
    homeWarrantyIncluded: false,
    homeWarrantyProvider: '',
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
    if (!formData.contractDate) newErrors.contractDate = 'Required';
    if (!formData.closingDate) newErrors.closingDate = 'Required';
    if (!formData.purchasePrice) newErrors.purchasePrice = 'Required';
    if (!formData.earnestMoneyAmount) newErrors.earnestMoneyAmount = 'Required';
    if (!formData.earnestMoneyDueDate) newErrors.earnestMoneyDueDate = 'Required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log('Buyer Resale Under Contract Submitted:', formData);
      alert('Resale transaction details saved successfully!');
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Buyer - Resale Under Contract</h1>
        <p>Track resale transaction details, deadlines, and parties</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Property Information</h2>
          <div className="form-group">
            <label htmlFor="propertyAddress">Property Address *</label>
            <input id="propertyAddress" type="text" name="propertyAddress" value={formData.propertyAddress} onChange={handleInputChange} className={errors.propertyAddress ? 'input-error' : ''} />
            {errors.propertyAddress && <span className="error-text">{errors.propertyAddress}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="purchasePrice">Purchase Price *</label>
              <input id="purchasePrice" type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} className={errors.purchasePrice ? 'input-error' : ''} />
              {errors.purchasePrice && <span className="error-text">{errors.purchasePrice}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="sellerName">Seller Name</label>
              <input id="sellerName" type="text" name="sellerName" value={formData.sellerName} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Contract & Earnest Money</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contractDate">Contract Date *</label>
              <input id="contractDate" type="date" name="contractDate" value={formData.contractDate} onChange={handleInputChange} className={errors.contractDate ? 'input-error' : ''} />
              {errors.contractDate && <span className="error-text">{errors.contractDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="closingDate">Closing Date *</label>
              <input id="closingDate" type="date" name="closingDate" value={formData.closingDate} onChange={handleInputChange} className={errors.closingDate ? 'input-error' : ''} />
              {errors.closingDate && <span className="error-text">{errors.closingDate}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="earnestMoneyAmount">Earnest Money Amount *</label>
              <input id="earnestMoneyAmount" type="number" name="earnestMoneyAmount" value={formData.earnestMoneyAmount} onChange={handleInputChange} className={errors.earnestMoneyAmount ? 'input-error' : ''} />
              {errors.earnestMoneyAmount && <span className="error-text">{errors.earnestMoneyAmount}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="earnestMoneyDueDate">Earnest Money Due Date *</label>
              <input id="earnestMoneyDueDate" type="date" name="earnestMoneyDueDate" value={formData.earnestMoneyDueDate} onChange={handleInputChange} className={errors.earnestMoneyDueDate ? 'input-error' : ''} />
              {errors.earnestMoneyDueDate && <span className="error-text">{errors.earnestMoneyDueDate}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="secondEarnestMoneyDueDate">Second Earnest Money Due Date (if applicable)</label>
            <input id="secondEarnestMoneyDueDate" type="date" name="secondEarnestMoneyDueDate" value={formData.secondEarnestMoneyDueDate} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-section">
          <h2>Key Deadlines</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="inspectionDeadline">Home Inspection Deadline</label>
              <input id="inspectionDeadline" type="date" name="inspectionDeadline" value={formData.inspectionDeadline} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="financingDeadline">Financing Deadline</label>
              <input id="financingDeadline" type="date" name="financingDeadline" value={formData.financingDeadline} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appraisalDate">Appraisal Date</label>
              <input id="appraisalDate" type="date" name="appraisalDate" value={formData.appraisalDate} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="homeInspectionDate">Home Inspection Date</label>
              <input id="homeInspectionDate" type="date" name="homeInspectionDate" value={formData.homeInspectionDate} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="finalWalkthrough">Final Walkthrough Date</label>
            <input id="finalWalkthrough" type="date" name="finalWalkthrough" value={formData.finalWalkthrough} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-section">
          <h2>Financing Information</h2>
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
        </div>

        <div className="form-section">
          <h2>Closing Team</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="titleCompanyName">Title Company Name</label>
              <input id="titleCompanyName" type="text" name="titleCompanyName" value={formData.titleCompanyName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="titleCompanyContact">Title Company Contact</label>
              <input id="titleCompanyContact" type="tel" name="titleCompanyContact" value={formData.titleCompanyContact} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="closingAttorneyName">Closing Attorney Name</label>
              <input id="closingAttorneyName" type="text" name="closingAttorneyName" value={formData.closingAttorneyName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="closingAttorneyPhone">Closing Attorney Phone</label>
              <input id="closingAttorneyPhone" type="tel" name="closingAttorneyPhone" value={formData.closingAttorneyPhone} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Cooperating Agent Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cooperatingAgentName">Cooperating Agent Name</label>
              <input id="cooperatingAgentName" type="text" name="cooperatingAgentName" value={formData.cooperatingAgentName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="cooperatingAgentBrokerage">Brokerage</label>
              <input id="cooperatingAgentBrokerage" type="text" name="cooperatingAgentBrokerage" value={formData.cooperatingAgentBrokerage} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="cooperatingAgentPhone">Phone</label>
              <input id="cooperatingAgentPhone" type="tel" name="cooperatingAgentPhone" value={formData.cooperatingAgentPhone} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label>
              <input type="checkbox" name="homeWarrantyIncluded" checked={formData.homeWarrantyIncluded} onChange={handleInputChange} />
              Home Warranty Included
            </label>
            {formData.homeWarrantyIncluded && (
              <div className="form-group">
                <label htmlFor="homeWarrantyProvider">Warranty Provider</label>
                <input id="homeWarrantyProvider" type="text" name="homeWarrantyProvider" value={formData.homeWarrantyProvider} onChange={handleInputChange} />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="contractNotes">Contract Notes</label>
            <textarea id="contractNotes" name="contractNotes" value={formData.contractNotes} onChange={handleInputChange} rows="3" />
          </div>
          <div className="form-group">
            <label htmlFor="specialConditions">Special Conditions or Contingencies</label>
            <textarea id="specialConditions" name="specialConditions" value={formData.specialConditions} onChange={handleInputChange} rows="3" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Resale Transaction Details</button>
        </div>
      </form>
    </div>
  );
}

export default BuyerResaleUnderContractForm;
