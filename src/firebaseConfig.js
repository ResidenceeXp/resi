import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAuoHQBAJMzh-zj9Gffj98LjjVGLsuRFfU",
  authDomain: "resi-3b5fe.firebaseapp.com",
  projectId: "resi-3b5fe",
  storageBucket: "resi-3b5fe.firebasestorage.app",
  messagingSenderId: "81651885393983",
  appId: "1:81651885393983:web:07befea24b19c621623ea",
  measurementId: "G-TB4H49TWM1",
  databaseURL: "https://resi-3b5fe-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
