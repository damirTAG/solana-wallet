import { useState } from "react";
import { useWalletStore } from "../../../../entities/wallet";
import * as bip39 from "bip39";
import { Input, Button, useToast } from "../../../../shared";
import { TiWarning } from "react-icons/ti";

interface CreateWalletProps {
    onClose: () => void;
}

export const CreateWallet = ({ onClose }: CreateWalletProps) => {
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [seedPhrase, setSeedPhrase] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const { createWallet } = useWalletStore();
    const toast = useToast();

    const generateSeedPhrase = () => {
        const mnemonic = bip39.generateMnemonic(128);
        setSeedPhrase(mnemonic);
        setStep(2);
    };

    const handleCreate = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!confirmed) {
            toast.warning("Please confirm you saved your seed phrase");
            return;
        }
        try {
            await createWallet(password, seedPhrase);
            toast.success("Wallet created successfully");
            onClose();
        } catch (e) {
            console.error("Create wallet failed:", e);
            toast.error("Failed to create wallet");
        }
    };

    return (
        <div className="flex items-center justify-center bg-black ">
            <div className="max-w-lg w-full backdrop-blur-md rounded-2xl shadow-lg">
                {step === 1 && (
                    <div className="space-y-4">
                        <Input
                            label="Create Password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="Enter password"
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="Confirm password"
                        />
                        <Button onClick={generateSeedPhrase} className="w-full" disabled={!password || password !== confirmPassword}>
                            Generate Seed Phrase
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
                            <p className="text-sm text-gray-300 mb-2">Your Seed Phrase (12 words):</p>
                            <div className="grid grid-cols-3 gap-2">
                                {seedPhrase.split(" ").map((word, i) => (
                                    <div key={i} className="bg-white/5 backdrop-blur-sm px-3 py-2 rounded text-sm text-gray-100">
                                        {i + 1}. {word}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-xl p-4">
                            <p className="text-yellow-300 text-sm flex items-center gap-2">
                                <TiWarning /> Write down your seed phrase and store it safely. You'll need it to recover your wallet.
                            </p>
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                                className="accent-green-400"
                            />
                            <span className="text-sm text-gray-300">I have saved my seed phrase</span>
                        </label>

                        <Button onClick={handleCreate} className="w-full" disabled={!confirmed}>
                            Create Wallet
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
