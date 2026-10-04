import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAuoHQBJAMzH-zj9GfFj98LjjVGLsuRFFU",
  authDomain: "resi-3b5fe.firebaseapp.com",
  databaseURL: "https://resi-3b5fe-default-rtdb.firebaseio.com",
  projectId: "resi-3b5fe",
  storageBucket: "resi-3b5fe.firebasestorage.app",
  messagingSenderId: "816518853983",
  appId: "1:816518853983:web:07befea24b19c6216232ea",
  measurementId: "G-TB4H49TWM1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
