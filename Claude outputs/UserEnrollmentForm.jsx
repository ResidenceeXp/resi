import React, { useState } from 'react';
import '../styles/forms.css';

function UserEnrollmentForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    dateHired: '',
    status: 'active',
    assignedTeams: [],
  });

  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'agent', label: 'Agent (Sales Professional)' },
    { value: 'tc', label: 'Transaction Coordinator' },
    { value: 'marketing', label: 'Marketing Manager' },
    { value: 'assistant', label: 'Local Assistant' },
    { value: 'concierge', label: 'Closing Concierge' },
    { value: 'admin', label: 'Admin (Super User)' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        assignedTeams: checked
          ? [...prev.assignedTeams, value]
          : prev.assignedTeams.filter(team => team !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.role) newErrors.role = 'Role selection required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log('User Enrollment Submitted:', formData);
      alert(`User ${formData.firstName} ${formData.lastName} enrolled as ${formData.role}`);
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        role: '', dateHired: '', status: 'active', assignedTeams: [],
      });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Enroll New User</h1>
        <p>Admin tool: Add new team member and assign role</p>
      </div>

      <form onSubmit={handleSubmit} className="enrollment-form">
        <div className="form-section">
          <h2>User Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={errors.firstName ? 'input-error' : ''} />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={errors.lastName ? 'input-error' : ''} />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'input-error' : ''} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateHired">Date Hired</label>
              <input id="dateHired" type="date" name="dateHired" value={formData.dateHired} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Role Assignment</h2>
          <div className="form-group">
            <label htmlFor="role">Primary Role *</label>
            <select id="role" name="role" value={formData.role} onChange={handleInputChange} className={errors.role ? 'input-error' : ''}>
              <option value="">Select a role...</option>
              {roles.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          {formData.role === 'agent' && (
            <div className="role-info">
              <p><strong>Agent Permissions:</strong></p>
              <ul>
                <li>View own transactions and tasks only</li>
                <li>Create transactions (Buyer, Seller, Landlord, Tenant)</li>
                <li>Approve marketing materials</li>
                <li>Generate own leads</li>
              </ul>
            </div>
          )}
          {formData.role === 'tc' && (
            <div className="role-info">
              <p><strong>Transaction Coordinator Permissions:</strong></p>
              <ul>
                <li>View ALL transactions across brokerage</li>
                <li>Enter data into Skyslope and MLS</li>
                <li>Manage task queue</li>
                <li>Coordinate deadlines and title company communication</li>
              </ul>
            </div>
          )}
          {formData.role === 'marketing' && (
            <div className="role-info">
              <p><strong>Marketing Manager Permissions:</strong></p>
              <ul>
                <li>View ALL transactions</li>
                <li>Create marketing materials</li>
                <li>Manage approval workflow</li>
              </ul>
            </div>
          )}
          {formData.role === 'admin' && (
            <div className="role-info">
              <p><strong>Admin Permissions:</strong></p>
              <ul>
                <li>Super-user access - view ALL transactions</li>
                <li>User management and enrollment</li>
                <li>System configuration</li>
                <li>Commission rate management</li>
                <li>Team analytics and reporting</li>
              </ul>
            </div>
          )}
        </div>

        {formData.role === 'agent' && (
          <div className="form-section">
            <h2>Team Assignment (Optional)</h2>
            <p>Select which teams this agent belongs to:</p>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" name="team" value="residential" checked={formData.assignedTeams.includes('residential')} onChange={handleInputChange} />
                Residential Sales
              </label>
              <label>
                <input type="checkbox" name="team" value="investment" checked={formData.assignedTeams.includes('investment')} onChange={handleInputChange} />
                Investment Properties
              </label>
              <label>
                <input type="checkbox" name="team" value="luxury" checked={formData.assignedTeams.includes('luxury')} onChange={handleInputChange} />
                Luxury Properties
              </label>
            </div>
          </div>
        )}

        <div className="form-section">
          <h2>System Access</h2>
          <p>Once enrolled, user can log in with:</p>
          <div className="info-box">
            <p><strong>Email:</strong> {formData.email || '[Email entered above]'}</p>
            <p><strong>Initial Password:</strong> System will send temporary password to email address</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Enroll User</button>
          <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>Clear Form</button>
        </div>
      </form>
    </div>
  );
}

export default UserEnrollmentForm;
