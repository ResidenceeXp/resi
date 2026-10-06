import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, database } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor auth state
  useEffect(() => {
    console.log('[AUTH] Setting up auth state listener');

    let unsubscribe;

    // Set persistence BEFORE setting up the listener
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('[AUTH] Persistence configured successfully');
        unsubscribe = setupAuthListener();
      })
      .catch((err) => {
        console.error('[AUTH] Error setting persistence:', err);
        // Still set up listener even if persistence fails
        unsubscribe = setupAuthListener();
      });

    const setupAuthListener = () => {
      return onAuthStateChanged(auth, async (currentUser) => {
        try {
          console.log('[AUTH] Auth state changed:', currentUser ? currentUser.email : 'null');
          if (currentUser) {
            console.log('[AUTH] User authenticated, UID:', currentUser.uid);
            setUser(currentUser);
            // Fetch user role and displayName from database
            try {
              const userRef = ref(database, `users/${currentUser.uid}`);
              const snapshot = await get(userRef);
              if (snapshot.exists()) {
                console.log('[AUTH] User data found in database');
                setUserRole(snapshot.val().role);
                setDisplayName(snapshot.val().displayName);
              } else {
                console.log('[AUTH] No user data found in database for UID:', currentUser.uid);
              }
            } catch (dbError) {
              console.error('[AUTH] Error fetching user data from database:', dbError);
              // Still keep user logged in even if database read fails
              setUser(currentUser);
            }
          } else {
            console.log('[AUTH] User not authenticated');
            setUser(null);
            setUserRole(null);
            setDisplayName(null);
          }
        } catch (err) {
          console.error('[AUTH] Auth state change error:', err);
        } finally {
          console.log('[AUTH] Setting loading to false');
          setLoading(false);
        }
      });
    };

    // Handle Back-Forward Cache restoration
    const handlePageShow = (event) => {
      if (event.persisted) {
        console.log('[AUTH] Page restored from Back-Forward Cache');
        // Reinitialize auth listener after page restoration
        if (unsubscribe) {
          unsubscribe();
        }
        unsubscribe = setupAuthListener();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    // Return cleanup function
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signup = async (email, password, displayName, role) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Store user info in database
      await set(ref(database, `users/${newUser.uid}`), {
        email,
        displayName,
        role,
        createdAt: new Date().toISOString()
      });

      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setUserRole(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userRole,
    displayName,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
