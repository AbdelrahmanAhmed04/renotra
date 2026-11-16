import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const env = import.meta.env;
const requestedEmulators = env.DEV && String(env.VITE_USE_EMULATORS ?? 'true').toLowerCase() === 'true';

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || (requestedEmulators ? 'demo-key' : ''),
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || (requestedEmulators ? 'rentora-demo.firebaseapp.com' : ''),
  projectId: env.VITE_FIREBASE_PROJECT_ID || (requestedEmulators ? 'rentora-demo' : ''),
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || (requestedEmulators ? '1:123:web:rentora-demo' : '')
};

export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
export const usingEmulators = requestedEmulators;

let app;
let auth;
let db;

if (firebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  setPersistence(auth, browserLocalPersistence).catch(() => {});
  if (usingEmulators && !globalThis.__rentoraEmulatorsConnected) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    globalThis.__rentoraEmulatorsConnected = true;
  }
}

export { app, auth, db };
