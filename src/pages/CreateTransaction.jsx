import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTransaction() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  const transactionTypes = [
    {
      id: 'seller',
      title: 'Seller',
      description: 'Create a new listing or manage seller transaction'
    },
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Manage buyer representation'
    },
    {
      id: 'landlord',
      title: 'Landlord',
      description: 'Create a rental listing or manage landlord transaction'
    },
    {
      id: 'tenant',
      title: 'Tenant',
      description: 'Manage tenant representation'
    }
  ];

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    // Navigate to the appropriate form based on type
    navigate(`/transactions/new/${typeId}`);
  };

  return (
    <div style={styles.container}>
      {/* Modal Overlay */}
      <div style={styles.overlay}></div>

      {/* Modal */}
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <h2 style={styles.title}>What kind of transaction is this?</h2>
          <p style={styles.subtitle}>Select the transaction type to get started</p>

          <div style={styles.optionsGrid}>
            {transactionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                style={{
                  ...styles.optionButton,
                  ...(selectedType === type.id ? styles.optionButtonSelected : {})
                }}
              >
                <div style={styles.optionTitle}>{type.title}</div>
                <div style={styles.optionDescription}>{type.description}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/transactions')}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: -1
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    zIndex: 1001
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    margin: '0',
    color: '#000000',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666666',
    margin: '0',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  optionButton: {
    padding: '20px',
    backgroundColor: '#F5F5F5',
    border: '2px solid #DDDDDD',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  optionButtonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
  },
  optionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#000000',
    marginBottom: '8px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  optionDescription: {
    fontSize: '13px',
    color: '#999999',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#FFFFFF',
    color: '#666666',
    border: '1px solid #DDDDDD',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    alignSelf: 'flex-start'
  }
};
