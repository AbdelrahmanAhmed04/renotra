import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updateProfile, onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';

export function observeAuth(callback) {
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}

export async function registerUser({ displayName, email, password, phone }) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(credential.user, { displayName: displayName.trim() });
  await setDoc(doc(db, 'users', credential.user.uid), {
    displayName: displayName.trim(), email: credential.user.email, phone: phone.trim(),
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
  return credential.user;
}

export async function loginUser(email, password) {
  return (await signInWithEmailAndPassword(auth, email.trim(), password)).user;
}

export function logoutUser() { return signOut(auth); }
export function resetPassword(email) { return sendPasswordResetEmail(auth, email.trim()); }

export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export function friendlyAuthError(error) {
  const messages = {
    'auth/email-already-in-use': 'An account already uses this email address.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/weak-password': 'Choose a stronger password with at least 8 characters.',
    'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
    'auth/network-request-failed': 'Network unavailable. Check your connection and try again.',
    'auth/user-not-found': 'No account was found for this email.'
  };
  return messages[error?.code] || 'Something went wrong. Please try again.';
}
