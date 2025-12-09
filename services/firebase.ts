import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

// ------------------------------------------------------------------
// CONFIGURATION
// Replace these values with your actual Firebase Project keys.
// You can get these from the Firebase Console -> Project Settings.
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Check if config is valid (not using placeholders)
const isConfigValid = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("YOUR_API_KEY");

let auth: any;
let googleProvider: any;
let facebookProvider: any;

if (isConfigValid) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    facebookProvider = new FacebookAuthProvider();
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.warn("⚠️ Firebase Config missing or invalid. App running in MOCK AUTH mode.");
}

// Mock User for Fallback Mode
const MOCK_USER = {
  uid: 'mock-user-sa-123',
  email: 'student@skillsnexus.africa',
  displayName: 'Thabo Mokoena',
  photoURL: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  emailVerified: true,
  isAnonymous: false,
};

// Helper to trigger UI updates in mock mode
const triggerMockAuthEvent = () => {
  window.dispatchEvent(new Event('mock-auth-change'));
};

export const signInWithGoogle = async () => {
  if (!isConfigValid || !auth) {
    // Fallback Mock Login
    console.log("Simulating Google Sign In...");
    await new Promise(resolve => setTimeout(resolve, 800)); // Fake network delay
    const user = { ...MOCK_USER, displayName: 'Thabo Mokoena (Google)' };
    localStorage.setItem('mock_user', JSON.stringify(user));
    triggerMockAuthEvent();
    return user as unknown as User;
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign In Error", error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  if (!isConfigValid || !auth) {
    // Fallback Mock Login
    console.log("Simulating Facebook Sign In...");
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = { ...MOCK_USER, displayName: 'Thabo Mokoena (FB)' };
    localStorage.setItem('mock_user', JSON.stringify(user));
    triggerMockAuthEvent();
    return user as unknown as User;
  }

  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  } catch (error) {
    console.error("Facebook Sign In Error", error);
    throw error;
  }
};

export const logoutUser = async () => {
  if (!isConfigValid || !auth) {
    localStorage.removeItem('mock_user');
    triggerMockAuthEvent();
    return;
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error", error);
  }
};

export const onUserChange = (callback: (user: User | null) => void) => {
  if (!isConfigValid || !auth) {
    // Mock Listener
    const checkMockUser = () => {
      const stored = localStorage.getItem('mock_user');
      callback(stored ? JSON.parse(stored) : null);
    };

    // Check immediately
    checkMockUser();

    // Listen for custom events
    window.addEventListener('mock-auth-change', checkMockUser);
    return () => window.removeEventListener('mock-auth-change', checkMockUser);
  }

  return onAuthStateChanged(auth, callback);
};