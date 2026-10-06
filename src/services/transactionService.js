import { ref, push, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebaseConfig';

/**
 * Create a new transaction and save to Firebase
 * @param {string} userId - The user ID from Firebase Auth
 * @param {object} transactionData - The form data
 * @param {string} transactionType - Type: 'Seller', 'Buyer', 'Landlord', 'Tenant'
 * @returns {Promise<string>} - The transaction ID
 */
export const createTransaction = async (userId, transactionData, transactionType) => {
  try {
    const transactionsRef = ref(database, `users/${userId}/transactions`);

    const newTransaction = {
      ...transactionData,
      type: transactionType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // push() generates a unique ID and creates the new record
    const newTransactionRef = await push(transactionsRef, newTransaction);

    console.log(`${transactionType} transaction created with ID:`, newTransactionRef.key);
    return newTransactionRef.key;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

/**
 * Get all transactions for a user
 * @param {string} userId - The user ID from Firebase Auth
 * @returns {Promise<array>} - Array of transactions with IDs
 */
export const getTransactions = async (userId) => {
  try {
    const transactionsRef = ref(database, `users/${userId}/transactions`);
    const snapshot = await get(transactionsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert Firebase object to array with IDs
      return Object.keys(data).map(id => ({
        id,
        ...data[id]
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Get a single transaction by ID
 * @param {string} userId - The user ID from Firebase Auth
 * @param {string} transactionId - The transaction ID
 * @returns {Promise<object>} - The transaction object
 */
export const getTransaction = async (userId, transactionId) => {
  try {
    const transactionRef = ref(database, `users/${userId}/transactions/${transactionId}`);
    const snapshot = await get(transactionRef);

    if (snapshot.exists()) {
      return {
        id: transactionId,
        ...snapshot.val()
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

/**
 * Update an existing transaction
 * @param {string} userId - The user ID from Firebase Auth
 * @param {string} transactionId - The transaction ID
 * @param {object} updates - The fields to update
 * @returns {Promise<void>}
 */
export const updateTransaction = async (userId, transactionId, updates) => {
  try {
    const transactionRef = ref(database, `users/${userId}/transactions/${transactionId}`);

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await update(transactionRef, updatedData);
    console.log('Transaction updated:', transactionId);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

/**
 * Delete a transaction
 * @param {string} userId - The user ID from Firebase Auth
 * @param {string} transactionId - The transaction ID
 * @returns {Promise<void>}
 */
export const deleteTransaction = async (userId, transactionId) => {
  try {
    const transactionRef = ref(database, `users/${userId}/transactions/${transactionId}`);

    await remove(transactionRef);
    console.log('Transaction deleted:', transactionId);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

/**
 * Get transactions by type
 * @param {string} userId - The user ID from Firebase Auth
 * @param {string} transactionType - Type: 'Seller', 'Buyer', 'Landlord', 'Tenant'
 * @returns {Promise<array>} - Array of transactions of the specified type
 */
export const getTransactionsByType = async (userId, transactionType) => {
  try {
    const allTransactions = await getTransactions(userId);
    return allTransactions.filter(t => t.type === transactionType);
  } catch (error) {
    console.error('Error fetching transactions by type:', error);
    throw error;
  }
};
