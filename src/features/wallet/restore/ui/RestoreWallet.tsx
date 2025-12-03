import { useState } from "react";
import { useWalletStore } from "../../../../entities/wallet";
import { Input, Button, useToast } from "../../../../shared";

interface RestoreWalletProps {
    onClose: () => void;
}

export const RestoreWallet = ({ onClose }: RestoreWalletProps) => {
    const [password, setPassword] = useState("");
    const [input, setInput] = useState("");
    const [isPrivateKey, setIsPrivateKey] = useState(false);
    const { restoreWallet } = useWalletStore();
    const toast = useToast();

    const handleRestore = async () => {
        if (!password || !input) {
            toast.error("Please fill all fields");
            return;
        }
        try {
            await restoreWallet(password, input, isPrivateKey);
            onClose();
        } catch (error) {
            toast.error("Failed to restore wallet. Check your input.");
        }
    };

    return (
        <div>
            <Input label="Create Password" type="password" value={password} onChange={setPassword} placeholder="Enter password" />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Restore Method</label>
                <div className="flex gap-2 mb-2">
                    <button
                        onClick={() => setIsPrivateKey(false)}
                        className={`flex-1 px-4 py-2 rounded-lg ${!isPrivateKey ? "bg-purple-600" : "bg-gray-700"}`}
                    >
                        Seed Phrase
                    </button>
                    <button
                        onClick={() => setIsPrivateKey(true)}
                        className={`flex-1 px-4 py-2 rounded-lg ${isPrivateKey ? "bg-purple-600" : "bg-gray-700"}`}
                    >
                        Private Key
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">{isPrivateKey ? "Private Key" : "Seed Phrase"}</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isPrivateKey ? "Enter your private key" : "Enter your 12 or 24 word seed phrase"}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 h-32"
                />
            </div>

            <Button onClick={handleRestore} className="w-full">
                Restore Wallet
            </Button>
        </div>
    );
};
