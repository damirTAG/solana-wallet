import { Buffer } from "buffer";

// Polyfill Buffer for browser environment (required by @solana/web3.js and bip39)
globalThis.Buffer = Buffer;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App.tsx";
import { ToastContainer } from "./shared/index.ts";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
        <ToastContainer />
    </StrictMode>
);
