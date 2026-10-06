import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// IMPORTANT: Firebase config - hardcoded temporarily for testing
// TODO: Move back to environment variables after verification
const firebaseConfig = {
  apiKey: "AIzaSyAuoHQBJAMzH-zj9GFfj98LjjVGLsuRFFU",
  authDomain: "resi-3b5fe.firebaseapp.com",
  databaseURL: "https://resi-3b5fe-default-rtdb.firebaseio.com",
  projectId: "resi-3b5fe",
  storageBucket: "resi-3b5fe.firebasestorage.app",
  messagingSenderId: "816518853983",
  appId: "1:816518853983:web:07befea24b19c6216232ea"
};

console.log('[FIREBASE] Initializing with hardcoded config for project:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Database
export const auth = getAuth(app);
export const database = getDatabase(app);

// Note: Auth persistence is now configured in AuthContext.js before the listener is set up
// This ensures persistence is ready before Firebase tries to restore the session

export default app;
