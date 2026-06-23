# HashPrime Technical Documentation

## Overview
HashPrime is an investment platform built with Next.js App Router, Tailwind CSS, and MongoDB. It allows users to register, invest in different tier-based schemes, manage their profile, secure their account with 2FA, and add nominees.

## Key Features & User Flow

### 1. Authentication & Security
- **Registration/Login:** JWT-based authentication via `jose`.
- **Role-Based Access Control:** Users and Admins. Admin emails are auto-elevated upon login.
- **Two-Factor Authentication (2FA):** 
  - Users can enable Authenticator App based 2FA (Google Authenticator, Authy).
  - Setup uses `otplib` to generate Secrets and `qrcode` to generate scanning endpoints.
  - Upon enabling, the `isTwoFactorEnabled` flag is set on the `User` model.
  - **Login Flow with 2FA:** If enabled, the primary login issues a short-lived `temp_auth_token` cookie. The user must then submit their TOTP code. The `/api/auth/2fa/verify` endpoint verifies the code and issues the full `auth_token`.

### 2. User Dashboards & Profiles
- **Profile Management:** Users can update personal details and submit KYC information.
- **KYC System:** KYC submissions are reviewed by an Admin. **Users must have an 'approved' KYC status to place any investments.**
- **Bank Accounts:** Users can link bank accounts for future withdrawal processing.
- **Nominee Management:** Users can add a legal nominee to inherit their assets.

### 3. Investment System
- Four distinct schemes (3-Month, 6-Month, 1-Year FD, 5-Year Vision) with varying base and maximum returns.
- **Payment & Deposits:** Users submit payment references manually after following instructions. Admins verify these deposits to add `USDT` balance.
- **Staking/Investing:** Users use their `USDT` balance to subscribe to schemes. The `usdtBalance` is deducted, and a new `Investment` record is created. Returns accrue daily via the `accumulatedAmount` field based on the plan type.

### 4. Admin Management
- **User Overview:** View all registered users, balances, and roles.
- **Investments & Deposits:** Verify manual deposits to credit balances. Monitor active schemes.
- **KYC Approvals:** Review user-submitted documentation and details to verify identity.
- **Support Tickets:** A built-in ticketing system allows users to raise queries and Admins to resolve them with direct replies.

## Setup Instructions for Admins

### Setting up Email (Placeholder)
*(Note: As per current implementation, 2FA relies entirely on Authenticator Apps. Email OTP is not integrated to keep external dependencies low and security high.)*
To set up email notifications in the future:
1. Create an account with an SMTP provider like Resend or SendGrid.
2. Store the API keys in your `.env.local` file (e.g., `RESEND_API_KEY=...`).
3. Install the provider's node package (e.g., `npm i resend`).
4. Integrate the mail sending logic in the relevant route handlers (like password reset or registration confirmation).

### Setting up Authenticator App (For Users)
1. Instruct users to download Google Authenticator, Authy, or Microsoft Authenticator from their device's App Store.
2. In the HashPrime dashboard, they should navigate to the **Security** tab.
3. Click "Begin Setup" to generate a QR code.
4. Scan the QR code using the Authenticator App.
5. Enter the 6-digit code displayed in the app back into HashPrime to verify and enable 2FA.

### Storing Images
Currently, KYC documents are processed by having the user manually input their document numbers (e.g., PAN, Aadhaar) as per the platform's initial requirements to avoid the complexity and cost of file storage.
If image storage is required in the future:
- **Local Storage:** Not recommended for production due to ephemeral serverless environments (like Vercel).
- **Cloud Storage (Recommended):** Integrate AWS S3 or Cloudinary. 
  1. Add a file input to the frontend forms.
  2. Modify the API route to accept `multipart/form-data`.
  3. Upload the file buffer to S3/Cloudinary and store the returned secure URL string in the MongoDB `User` document.
