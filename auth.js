import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

const authGate = document.getElementById("auth-gate");
const protectedContent = document.getElementById("protected-content");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const resetButton = document.getElementById("reset-button");
const logoutButton = document.getElementById("logout-button");
const authStatus = document.getElementById("auth-status");
const userEmail = document.getElementById("user-email");
const authLoading = document.getElementById("auth-loading");

function setStatus(message, type = "error") {
  authStatus.textContent = message;
  authStatus.dataset.type = type;
  authStatus.hidden = !message;
}

function setBusy(isBusy) {
  loginButton.disabled = isBusy;
  resetButton.disabled = isBusy;
  loginButton.textContent = isBusy ? "Signing in..." : "Sign in";
}

function showSignedOut() {
  authGate.hidden = false;
  protectedContent.hidden = true;
}

function showSignedIn(user) {
  authGate.hidden = true;
  protectedContent.hidden = false;
  userEmail.textContent = user.email || "Authenticated user";
}

function friendlyAuthError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "The email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection and try again.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      return "Authentication failed. Please try again.";
  }
}

if (!isFirebaseConfigured) {
  authLoading.hidden = true;
  showSignedOut();
  loginButton.disabled = true;
  resetButton.disabled = true;
  setStatus(
    "Authentication is not configured yet. Add your Firebase web app configuration to firebase-config.js.",
    "warning"
  );
} else {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
      authLoading.hidden = true;

      if (user) {
        showSignedIn(user);
      } else {
        showSignedOut();
      }
    });

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("");
      setBusy(true);

      try {
        await setPersistence(auth, browserSessionPersistence);
        await signInWithEmailAndPassword(
          auth,
          emailInput.value.trim(),
          passwordInput.value
        );
        passwordInput.value = "";
      } catch (error) {
        setStatus(friendlyAuthError(error.code));
      } finally {
        setBusy(false);
      }
    });

    resetButton.addEventListener("click", async () => {
      const email = emailInput.value.trim();

      if (!email) {
        setStatus("Enter your email address first.");
        emailInput.focus();
        return;
      }

      resetButton.disabled = true;
      setStatus("");

      try {
        await sendPasswordResetEmail(auth, email);
        setStatus("Password-reset email sent. Check your inbox.", "success");
      } catch (error) {
        setStatus(friendlyAuthError(error.code));
      } finally {
        resetButton.disabled = false;
      }
    });

    logoutButton.addEventListener("click", async () => {
      try {
        await signOut(auth);
      } catch {
        setStatus("Unable to sign out. Please try again.");
      }
    });
  } catch {
    authLoading.hidden = true;
    showSignedOut();
    loginButton.disabled = true;
    resetButton.disabled = true;
    setStatus(
      "Firebase could not be initialized. Check firebase-config.js and the browser console.",
      "warning"
    );
  }
}
