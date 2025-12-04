import { useState } from "react";
import { useWalletStore } from "../../../../entities/wallet";
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";

import { Input, Button, useToast } from "../../../../shared";

export const SendTransaction = ({ onClose }: { onClose: () => void }) => {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [token, setToken] = useState("SOL");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { getKeypair, refreshBalance, balance } = useWalletStore();
    const toast = useToast();

    const userBalance = balance?.[token.toLowerCase() as keyof typeof balance] ?? 0;

    const handleSend = async () => {
        if (!recipient || !amount || !password) {
            toast.info("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const keypair = await getKeypair(password);
            if (!keypair) throw new Error("Invalid password");

            const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL);
            const toPubkey = new PublicKey(recipient);

            if (token === "SOL") {
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: keypair.publicKey,
                        toPubkey,
                        lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                    })
                );
                const signature = await connection.sendTransaction(transaction, [keypair]);
                await connection.confirmTransaction({
                    signature,
                    blockhash: (await connection.getLatestBlockhash()).blockhash,
                    lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
                });
            } else {
                let mintAddress: PublicKey;
                if (token === "USDC") {
                    mintAddress = new PublicKey(import.meta.env.VITE_USDC_MINT_ADDRESS);
                } else if (token === "USDT") {
                    mintAddress = new PublicKey(import.meta.env.VITE_USDT_MINT_ADDRESS);
                } else {
                    throw new Error("Unsupported token for SPL transfer");
                }

                const fromAta = await getAssociatedTokenAddress(mintAddress, keypair.publicKey);
                const toAta = await getAssociatedTokenAddress(mintAddress, toPubkey);

                const transaction = new Transaction();
                const toAccount = await connection.getAccountInfo(toAta);
                if (!toAccount) {
                    transaction.add(createAssociatedTokenAccountInstruction(keypair.publicKey, toAta, toPubkey, mintAddress));
                }

                transaction.add(createTransferInstruction(fromAta, toAta, keypair.publicKey, parseFloat(amount) * 1e6));

                const signature = await connection.sendTransaction(transaction, [keypair]);
                await connection.confirmTransaction({
                    signature,
                    blockhash: (await connection.getLatestBlockhash()).blockhash,
                    lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
                });
            }

            toast.success("Transaction sent successfully!");
            await refreshBalance();
            onClose();
        } catch (error) {
            console.error("Send failed:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error("Transaction failed: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const setAmountByPercentage = (percentage: number) => {
        const value = userBalance * percentage;
        setAmount(value.toFixed(6));
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl shadow-green-500/5 p-6 space-y-4">
            {/* Token selector */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Token</label>
                <div className="flex gap-2">
                    {["SOL", "USDC", "USDT"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setToken(t)}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                token === t
                                    ? "bg-green-500/20 border-2 border-green-500/60 text-green-400 shadow-lg shadow-green-500/20"
                                    : "bg-black/40 backdrop-blur-sm border border-green-500/20 text-gray-400 hover:border-green-500/40 hover:text-green-300"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recipient */}
            <Input label="Recipient Address" value={recipient} onChange={setRecipient} placeholder="Enter Solana address" />

            {/* Amount with suggestion buttons */}
            <div>
                <Input label="Amount" type="number" value={amount} onChange={setAmount} placeholder="0.0" />
                <div className="flex gap-2 mt-2">
                    {[1, 0.5, 0.25].map((pct) => (
                        <button
                            key={pct}
                            onClick={() => setAmountByPercentage(pct)}
                            className="flex-1 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-green-500/20 text-gray-300 hover:border-green-500/40 hover:text-green-400 transition-all"
                        >
                            {pct * 100}%
                        </button>
                    ))}
                </div>
                <p className="text-gray-400 text-xs mt-1">
                    Balance: {userBalance.toFixed(6)} {token}
                </p>
            </div>

            {/* Password */}
            <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter password" />

            {/* Send button */}
            <Button onClick={handleSend} className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Transaction"}
            </Button>
        </div>
    );
};
