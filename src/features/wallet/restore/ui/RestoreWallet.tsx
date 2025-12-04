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
            console.log(`Failed to restore wallet: ${error}`);
            toast.error("Failed to restore wallet. Check your input.");
        }
    };

    return (
        <div className="flex items-center justify-center bg-black">
            <div className="max-w-lg w-full backdrop-blur-md rounded-2xl shadow-lg">
                <div className="space-y-4">
                    <Input label="Create Password" type="password" value={password} onChange={setPassword} placeholder="Enter password" />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Restore Method</label>
                        <div className="flex gap-2 mb-2">
                            {["Seed Phrase", "Private Key"].map((method, index) => (
                                <button
                                    key={method}
                                    onClick={() => setIsPrivateKey(index === 1)}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        (index === 1 ? isPrivateKey : !isPrivateKey)
                                            ? "bg-green-500/20 border border-green-400 text-green-300"
                                            : "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10"
                                    }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {isPrivateKey ? "Private Key" : "Seed Phrase"}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isPrivateKey ? "Enter your private key" : "Enter your 12 or 24 word seed phrase"}
                            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 h-32 transition-colors"
                        />
                    </div>

                    <Button onClick={handleRestore} className="w-full">
                        Restore Wallet
                    </Button>
                </div>
            </div>
        </div>
    );
};
