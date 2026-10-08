// Firebase web configuration.
// Get these values from Firebase Console → Project settings → Your apps → Web app.
// These identifiers are intended for client-side use; do NOT put service-account credentials here.
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
