# Authentication Setup

This portfolio uses Firebase Authentication with Email/Password sign-in.

## 1. Create a Firebase project

Create a project in the Firebase Console, then add a Web App.

## 2. Enable Email/Password

In Firebase Console:

1. Open **Authentication**.
2. Open **Sign-in method**.
3. Enable **Email/Password**.
4. Create the authorized user accounts under the **Users** tab.

No passwords are stored in this GitHub repository.

## 3. Configure the web app

Copy the Firebase web configuration into `firebase-config.js`.

Replace the empty values with the configuration from **Firebase Console → Project settings → Your apps → Web app**.

```js
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

The Firebase Web API key is a client-side identifier and is not a secret. Never put Firebase service-account private keys or other server credentials into this file.

## 4. Configure authorized domains

In Firebase Console, open **Authentication → Settings → Authorized domains** and add the GitHub Pages domain, for example `zafransyauqi02.github.io`, plus any custom domain you use.

## Authentication flow

```text
Browser
   │
   ├── load index.html
   │
   ├── load auth.js
   │
   ▼
Firebase Auth
   │
   ├── no session → show sign-in screen
   │
   └── valid session → reveal portfolio
                         │
                         ├── CV link
                         ├── projects
                         └── contact/skills
```

After sign-in, the client receives authenticated Firebase user/session state. The site keeps auth state for the current browser session using `browserSessionPersistence`.

Sign-out calls Firebase `signOut()`. Password reset uses Firebase `sendPasswordResetEmail()`.

## Important GitHub Pages security limitation

GitHub Pages is a static host. It cannot perform a server-side authorization check before serving `Zafran_Syauqi_CV.pdf`.

Therefore, the authentication protects access to the portfolio interface, but the CV file remains technically reachable by its direct public URL. This setup is suitable for gating the page UI, not for protecting confidential documents.

For **true private document protection**, move the CV and other private assets to authenticated storage/backend infrastructure and authorize access after Firebase authentication.

## Files

- `index.html` — authentication gate and protected portfolio UI
- `auth.js` — Firebase authentication logic
- `firebase-config.js` — Firebase web configuration template
- `Zafran_Syauqi_CV.pdf` — current CV asset
