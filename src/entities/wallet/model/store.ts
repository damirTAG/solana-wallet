import { create } from "zustand";
import * as bip39 from "bip39";
import { Keypair, PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { cryptoLib, storageLib } from "../../../shared";
import type { Transaction } from "../types";
import { Buffer } from "buffer";

interface WalletState {
    publicKey: string | null;
    isUnlocked: boolean;
    balance: { sol: number; usdc: number; usdt: number };
    transactions: Transaction[];
    unlock: (password: string) => Promise<boolean>;
    lock: () => void;
    createWallet: (password: string, seedPhrase: string) => Promise<void>;
    restoreWallet: (password: string, seedOrPrivateKey: string, isPrivateKey: boolean) => Promise<void>;
    deleteWallet: () => Promise<void>;
    refreshBalance: () => Promise<void>;
    getKeypair: (password: string) => Promise<Keypair | null>;
    fetchTransactions: (limit?: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
    publicKey: null,
    isUnlocked: false,
    balance: { sol: 0, usdc: 0, usdt: 0 },

    unlock: async (password: string) => {
        try {
            const data: any = await storageLib.get("wallet");
            if (!data) return false;
            await cryptoLib.decryptPrivateKey(data.encrypted, password, data.salt, data.iv);
            set({ isUnlocked: true, publicKey: data.publicKey });
            await get().refreshBalance();
            return true;
        } catch (error) {
            console.error("Unlock failed:", error);
            return false;
        }
    },

    lock: () => set({ isUnlocked: false }),

    createWallet: async (password: string, seedPhrase: string) => {
        const seed = await bip39.mnemonicToSeed(seedPhrase);
        const keypair = Keypair.fromSeed(seed.slice(0, 32));
        const privateKey = Buffer.from(keypair.secretKey).toString("base64");
        const publicKey = keypair.publicKey.toBase58();

        const encrypted = await cryptoLib.encryptPrivateKey(privateKey, password);
        await storageLib.save("wallet", { ...encrypted, publicKey });

        set({ publicKey, isUnlocked: true });
        await get().refreshBalance();
    },

    restoreWallet: async (password: string, seedOrPrivateKey: string, isPrivateKey: boolean) => {
        let keypair: Keypair;

        if (isPrivateKey) {
            const secretKey = Buffer.from(seedOrPrivateKey, "base64");
            keypair = Keypair.fromSecretKey(secretKey);
        } else {
            const seed = await bip39.mnemonicToSeed(seedOrPrivateKey);
            keypair = Keypair.fromSeed(seed.slice(0, 32));
        }

        const privateKey = Buffer.from(keypair.secretKey).toString("base64");
        const publicKey = keypair.publicKey.toBase58();

        const encrypted = await cryptoLib.encryptPrivateKey(privateKey, password);
        await storageLib.save("wallet", { ...encrypted, publicKey });

        set({ publicKey, isUnlocked: true });
        await get().refreshBalance();
    },

    deleteWallet: async () => {
        await storageLib.delete("wallet");
        set({ publicKey: null, isUnlocked: false, balance: { sol: 0, usdc: 0, usdt: 0 } });
    },

    refreshBalance: async () => {
        const { publicKey } = get();
        if (!publicKey) return;

        try {
            const connection = new Connection("https://api.devnet.solana.com");
            const pubKey = new PublicKey(publicKey);

            const solBalance = await connection.getBalance(pubKey);

            const usdcMint = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
            const usdtMint = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");

            let usdcBalance = 0,
                usdtBalance = 0;

            try {
                const usdcAta = await getAssociatedTokenAddress(usdcMint, pubKey);
                const usdcAccount = await connection.getTokenAccountBalance(usdcAta);
                usdcBalance = parseFloat(usdcAccount.value.uiAmount?.toString() || "0");
            } catch (e) {}

            try {
                const usdtAta = await getAssociatedTokenAddress(usdtMint, pubKey);
                const usdtAccount = await connection.getTokenAccountBalance(usdtAta);
                usdtBalance = parseFloat(usdtAccount.value.uiAmount?.toString() || "0");
            } catch (e) {}

            set({ balance: { sol: solBalance / LAMPORTS_PER_SOL, usdc: usdcBalance, usdt: usdtBalance } });
        } catch (error) {
            console.error("Failed to refresh balance:", error);
        }
    },

    getKeypair: async (password: string) => {
        try {
            const data: any = await storageLib.get("wallet");
            if (!data) return null;
            const privateKey = await cryptoLib.decryptPrivateKey(data.encrypted, password, data.salt, data.iv);
            const secretKey = Buffer.from(privateKey, "base64");
            return Keypair.fromSecretKey(secretKey);
        } catch (error) {
            console.error("Failed to get keypair:", error);
            return null;
        }
    },
    transactions: [],

    fetchTransactions: async (limit = 10) => {
        const { publicKey } = get();
        if (!publicKey) return;

        try {
            const connection = new Connection("https://api.devnet.solana.com");
            const pubKey = new PublicKey(publicKey);

            const signatures = await connection.getSignaturesForAddress(pubKey, { limit });

            const transactions: Transaction[] = signatures.map((sigInfo) => ({
                signature: sigInfo.signature,
                status: sigInfo.err ? "Failed" : "Success",
                blockTime: sigInfo.blockTime ?? null,
                solscanLink: `https://solscan.io/tx/${sigInfo.signature}?cluster=devnet`,
            }));

            set({ transactions });
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
    },
}));
