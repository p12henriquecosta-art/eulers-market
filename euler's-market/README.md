# Euler's Market | Customer Portal Pipeline

A precision-engineered digital asset management portal built with React, TypeScript, and Firebase.

## 🏗 Architectural Logic

The application follows a **Modular SPA (Single Page Application)** architecture with a centralized authentication guard.

### 1. Authentication Layer (`/src/pages/Login.tsx`)
- **Dual-Provider Auth**: Supports traditional Email/Password and Google OAuth via Firebase Authentication.
- **Identity Verification**: Uses `onAuthStateChanged` in the root `App.tsx` to maintain persistent sessions across reloads.
- **Dynamic UX**: A unified login/signup controller that switches state without page refreshes.

### 2. Security Patterns
- **Rate Limiting**: Integrated mock API check (`/api/auth/rate-limit-check`) before authentication attempts to prevent brute-force attacks.
- **Navigation Guards**: Routes are protected using ternary logic in `App.tsx`. Unauthorized users are automatically redirected to `/login` when attempting to access the `Portal` or `Admin` sections.
- **Firebase Security Rules**: All database operations are governed by server-side rules that enforce document ownership.

### 3. Core Features
- **The Portal (`/src/pages/Dashboard.tsx`)**: A central command interface for customers.
  - **Access Key Management**: Secure display and copying of proprietary license keys.
  - **System Metrics**: Real-time nominal status checks.
  - **Security Checklist**: Dynamic reporting on user account hardening (MFA status, verification).
- **Waitlist Logic**: A dedicated signup pipeline on the Home page that syncs interested leads directly to Firestore.

### 4. Visual Language
- **Typography**: Heavy focus on Inter and Monospaced fonts to convey mathematical precision.
- **Motion**: Powered by `motion/react` for fluid state transitions and layout shifts.
- **Styling**: Atomic utility classes via Tailwind CSS, strictly avoiding custom CSS files to maintain performance and consistency.

## 📁 Repository Structure

- `src/components/layout/`: Global UI wrappers (Shell, Navigation).
- `src/lib/`: Low-level utilities and Firebase initialization.
- `src/pages/`: Modular page components with isolated logic.
- `src/types.ts`: Shared TypeScript interfaces for data consistency.

## 🌐 Deployment
The app is optimized for ESM-native builds via Vite and served as a static distribution or behind an Express proxy for full-stack requirements.
