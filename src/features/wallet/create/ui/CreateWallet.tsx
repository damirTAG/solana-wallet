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
        <div>
            {step === 1 && (
                <>
                    <Input label="Create Password" type="password" value={password} onChange={setPassword} placeholder="Enter password" />
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
                </>
            )}

            {step === 2 && (
                <>
                    <div className="bg-gray-800 p-4 rounded-xl mb-4">
                        <p className="text-sm text-gray-400 mb-2">Your Seed Phrase (12 words):</p>
                        <div className="grid grid-cols-3 gap-2">
                            {seedPhrase.split(" ").map((word, i) => (
                                <div key={i} className="bg-gray-700 px-3 py-2 rounded text-sm">
                                    {i + 1}. {word}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-xl p-4 mb-4">
                        <p className="text-yellow-300 text-sm">
                            <TiWarning className="inline mr-2" /> Write down your seed phrase and store it safely. You'll need it to recover
                            your wallet.
                        </p>
                    </div>
                    <label className="flex items-center mb-4">
                        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mr-2" />
                        <span className="text-sm text-gray-300">I have saved my seed phrase</span>
                    </label>
                    <Button onClick={handleCreate} className="w-full" disabled={!confirmed}>
                        Create Wallet
                    </Button>
                </>
            )}
        </div>
    );
};
