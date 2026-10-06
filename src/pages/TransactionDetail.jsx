import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTransaction, deleteTransaction } from '../services/transactionService';
import { ArrowLeft, Edit, Trash2, X } from 'lucide-react';
import TransactionTasksList from '../components/TransactionTasksList';

export default function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadTransaction = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getTransaction(user.uid, id);
        if (data) {
          setTransaction(data);
        } else {
          setError('Transaction not found');
        }
      } catch (err) {
        console.error('Error loading transaction:', err);
        setError('Failed to load transaction');
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [id, user]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        setDeleting(true);
        await deleteTransaction(user.uid, id);
        navigate('/transactions');
      } catch (err) {
        console.error('Error deleting transaction:', err);
        setError('Failed to delete transaction');
      } finally {
        setDeleting(false);
      }
    }
  };

  const renderField = (label, value) => {
    if (!value) return null;
    return (
      <div style={styles.fieldRow}>
        <label style={styles.fieldLabel}>{label}</label>
        <span style={styles.fieldValue}>{value}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate('/transactions')} style={styles.backButton}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 style={styles.title}>Transaction Details</h1>
          <div style={{ width: '80px' }}></div>
        </div>
        <div style={styles.mainContent}>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate('/transactions')} style={styles.backButton}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 style={styles.title}>Transaction Details</h1>
          <div style={{ width: '80px' }}></div>
        </div>
        <div style={styles.mainContent}>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate('/transactions')} style={styles.backButton}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 style={styles.title}>Transaction Details</h1>
          <div style={{ width: '80px' }}></div>
        </div>
        <div style={styles.mainContent}>
          <p style={styles.errorText}>Transaction not found</p>
        </div>
      </div>
    );
  }

  const clientName = `${transaction.firstName} ${transaction.lastName}`;
  const createdDate = new Date(transaction.createdAt).toLocaleDateString();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/transactions')} style={styles.backButton}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 style={styles.title}>Transaction Details</h1>
        <div style={styles.headerActions}>
          <button
            onClick={handleDelete}
            style={{...styles.deleteButton, opacity: deleting ? 0.5 : 1}}
            title="Delete"
            disabled={deleting}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header Info Card */}
        <div style={styles.headerCard}>
          <div>
            <h2 style={styles.clientName}>{clientName}</h2>
            <p style={styles.transactionType}>{transaction.type} Transaction</p>
            {transaction.buyerCategory && (
              <p style={styles.subType}>{transaction.buyerCategory}</p>
            )}
          </div>
          <div style={styles.dateBox}>
            <span style={styles.dateLabel}>Created</span>
            <span style={styles.dateValue}>{createdDate}</span>
          </div>
        </div>

        {/* Contact Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Contact Information</h3>
          {renderField('Email', transaction.email)}
          {renderField('Phone', transaction.phone)}
          {renderField('Current Address', transaction.currentAddress)}
        </div>

        {/* Property Information (varies by type) */}
        {(transaction.type === 'Seller' || transaction.propertyAddress) && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Property Information</h3>
            {renderField('Property Address', transaction.propertyAddress)}
            {renderField('Property Type', transaction.propertyType)}
            {renderField('Bedrooms', transaction.bedroomCount)}
            {renderField('Bathrooms', transaction.bathroomCount)}
            {renderField('Square Footage', transaction.squareFootage)}
            {renderField('Year Built', transaction.yearBuilt)}
          </div>
        )}

        {/* Seller-Specific Information */}
        {transaction.type === 'Seller' && (
          <>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Listing Information</h3>
              {renderField('Listing Price', transaction.listingPrice)}
              {renderField('Anticipated Listing Date', transaction.anticipatedListingDate)}
              {renderField('Desired Closing Date', transaction.desiredClosingDate)}
              {renderField('Reason for Selling', transaction.reasonForSelling)}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Staging & Photography</h3>
              {renderField('Staging Needed', transaction.stagingNeeded)}
              {renderField('Photography Date', transaction.photographyDate)}
              {renderField('Staging Notes', transaction.stagingNotes)}
              {renderField('Video Script Notes', transaction.videoScriptNotes)}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Marketing Materials</h3>
              {renderField('Create Brochure', transaction.createBrochure ? 'Yes' : 'No')}
              {renderField('Create Mailer', transaction.createMailer ? 'Yes' : 'No')}
              {renderField('Create Feature Cards', transaction.createFeatureCards ? 'Yes' : 'No')}
              {renderField('Marketing Theme', transaction.marketingTheme)}
              {renderField('Key Features', transaction.keyFeatures)}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Showing Instructions</h3>
              {renderField('Showing Instructions', transaction.showingInstructions)}
              {renderField('Access Instructions', transaction.accessInstructions)}
              {renderField('Lockbox Code', transaction.lockboxCode)}
            </div>
          </>
        )}

        {/* Buyer-Specific Information */}
        {transaction.type === 'Buyer' && (
          <>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Buyer Profile</h3>
              {renderField('Buyer Type', transaction.buyerType)}
              {renderField('Relocating From', transaction.relocatingFrom)}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Financing</h3>
              {renderField('Pre-Approval Amount', transaction.preApprovalAmount)}
              {renderField('Down Payment %', transaction.downPayment)}
              {renderField('Loan Amount', transaction.loanAmount)}
              {renderField('Closing Timeline', transaction.closingTimeline)}
            </div>

            {transaction.purchaseCategory === 'resale' ? (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Resale Preferences</h3>
                {renderField('Property Type', transaction.propertyType)}
                {renderField('Desired Price', transaction.desiredPrice)}
                {renderField('Desired Locations', transaction.desiredLocation)}
                {renderField('Bedroom Preference', transaction.bedroomPreference)}
                {renderField('Bathroom Preference', transaction.bathroomPreference)}
                {renderField('Home Inspection Required', transaction.homeInspectionRequired)}
                {renderField('Appraisal Contingency', transaction.appraisalContingency)}
                {renderField('Current Home Sale Status', transaction.currentHomeSaleStatus)}
                {renderField('Offer Strategy', transaction.offerStrategy)}
              </div>
            ) : (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>New Construction Preferences</h3>
                {renderField('Builder Preference', transaction.builderPreference)}
                {renderField('Community Preference', transaction.communityPreference)}
                {renderField('Desired Price', transaction.desiredPrice)}
                {renderField('Desired Locations', transaction.desiredLocation)}
                {renderField('Move-In Timeline', transaction.moveInTimeline)}
                {renderField('Model/Floor Plan', transaction.modelFloorplanPreference)}
                {renderField('Lot Preferences', transaction.lotPreferences)}
                {renderField('Builder Incentives Interest', transaction.builderIncentivesInterest)}
                {renderField('HOA Concerns', transaction.hoaConcerns)}
                {renderField('Warranty Questions', transaction.warrantyQuestions)}
              </div>
            )}
          </>
        )}

        {/* Landlord-Specific Information */}
        {transaction.type === 'Landlord' && (
          <>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Rental Information</h3>
              {renderField('Monthly Rent', transaction.rentAmount)}
              {renderField('Desired Lease Type', transaction.desiredLeaseType)}
              {renderField('Available Date', transaction.availableDate)}
              {renderField('Furniture Included', transaction.furnitureIncluded)}
              {renderField('Utilities Included', transaction.utilitiesIncluded)}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Tenant Preferences</h3>
              {renderField('Allow Pets', transaction.allowPets)}
              {renderField('Minimum Income Requirement', transaction.minIncomeRequirement)}
              {renderField('Minimum Credit Score', transaction.creditScoreRequirement)}
              {renderField('Lease Terms', transaction.leaseTerms)}
            </div>
          </>
        )}

        {/* Tenant-Specific Information */}
        {transaction.type === 'Tenant' && (
          <>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Move Information</h3>
              {renderField('Desired Location', transaction.desiredLocation)}
              {renderField('Desired Move-In Date', transaction.moveInDate)}
              {renderField('Lease Length Preference', transaction.leaseLength)}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Financial Information</h3>
              {renderField('Monthly Income', transaction.income)}
              {renderField('Income Source', transaction.incomeSource)}
              {renderField('Employer Name', transaction.employerName)}
              {renderField('Employment Status', transaction.employmentStatus)}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Housing Preferences</h3>
              {renderField('Property Type', transaction.propertyType)}
              {renderField('Bedroom Preference', transaction.bedroomPreference)}
              {renderField('Bathroom Preference', transaction.bathroomPreference)}
              {renderField('Budget Range', transaction.budgetRange)}
              {renderField('Pets', transaction.petInfo)}
              {transaction.petInfo !== 'no' && renderField('Pet Details', transaction.petDetails)}
            </div>
          </>
        )}

        {/* Additional Notes */}
        {(transaction.notes || transaction.specialRequirements || transaction.agentNotes) && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Additional Information</h3>
            {renderField('Notes', transaction.notes)}
            {renderField('Special Requirements', transaction.specialRequirements)}
            {renderField('Agent Notes', transaction.agentNotes)}
          </div>
        )}

        {/* Transaction Tasks */}
        <TransactionTasksList transactionId={id} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    backgroundColor: '#F5F5F5',
    borderBottom: '1px solid #E0E0E0',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'all 0.3s ease'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#000',
    margin: '0'
  },
  headerActions: {
    display: 'flex',
    gap: '8px'
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.3s ease'
  },
  mainContent: {
    padding: '40px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  loadingText: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center'
  },
  errorText: {
    fontSize: '16px',
    color: '#d32f2f',
    textAlign: 'center'
  },
  headerCard: {
    backgroundColor: '#F5F5F5',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  clientName: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#000'
  },
  transactionType: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#D4AF37',
    margin: '0'
  },
  subType: {
    fontSize: '14px',
    color: '#666',
    margin: '4px 0 0 0'
  },
  dateBox: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DDD',
    borderRadius: '4px'
  },
  dateLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  dateValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '600',
    color: '#000',
    marginTop: '4px'
  },
  section: {
    backgroundColor: '#F9F9F9',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000',
    margin: '0 0 16px 0',
    paddingBottom: '12px',
    borderBottom: '2px solid #D4AF37'
  },
  fieldRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '12px',
    marginBottom: '12px',
    borderBottom: '1px solid #E0E0E0'
  },
  fieldLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    minWidth: '200px'
  },
  fieldValue: {
    fontSize: '14px',
    color: '#333',
    textAlign: 'right',
    flex: 1,
    paddingLeft: '16px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  }
};
