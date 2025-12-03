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
    const { getKeypair, refreshBalance } = useWalletStore();
    const toast = useToast();

    const handleSend = async () => {
        if (!recipient || !amount || !password) {
            toast.info("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const keypair = await getKeypair(password);
            if (!keypair) throw new Error("Invalid password");

            const connection = new Connection("https://api.devnet.solana.com");
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
                const mintAddress = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
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

    return (
        <div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Token</label>
                <div className="flex gap-2">
                    {["SOL", "USDC", "USDT"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setToken(t)}
                            className={`flex-1 px-4 py-2 rounded-lg ${token === t ? "bg-purple-600" : "bg-gray-700"}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <Input label="Recipient Address" value={recipient} onChange={setRecipient} placeholder="Enter Solana address" />
            <Input label="Amount" type="number" value={amount} onChange={setAmount} placeholder="0.0" />
            <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter password" />
            <Button onClick={handleSend} className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Transaction"}
            </Button>
        </div>
    );
};
