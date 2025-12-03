# Solana Wallet

![App](<public/img/screen_(iPhone%2012%20Pro).png>)

A minimalistic Solana wallet built with modern frontend technologies, secure storage, and blockchain integration.

---

## Features

-   **Create or Restore Wallet:** Generate a new wallet or restore from a private key / seed phrase.
-   **Token Management:** Send and receive SOL, USDT, USDC tokens.
-   **Secure Storage:** Wallet data encrypted with AES-GCM and PBKDF2, stored in IndexedDB.
-   **QR Code Support:** Easily scan or display wallet addresses using QR codes.
-   **Modern design:** Sleek and minimal UI optimized for mobile and desktop.

---

## Tech Stack

-   **Frontend:** Vite, React, Zustand (state management)
-   **Architecture:** FSD (Feature-Sliced Design)
-   **Blockchain:** `@solana/web3.js`, `@solana/spl-token`
-   **Storage & Security:** IndexedDB, WebCrypto AES-GCM, PBKDF2, Base58
-   **Utilities:** `react.qrcode`

---

## Installation

```bash
npm install

npm run dev
```
