import { useState } from "react";
import { useWalletStore } from "../../../entities/wallet";
import { Input, Button } from "../../../shared";

import { FaLock } from "react-icons/fa";

interface UnlockPageProps {
    onUnlock: () => void;
}

export const UnlockPage = ({ onUnlock }: UnlockPageProps) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { unlock } = useWalletStore();

    const handleUnlock = async () => {
        const success = await unlock(password);
        if (success) {
            onUnlock();
        } else {
            setError("Invalid password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gray-800 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                        <FaLock className="text-[#00FFA3] text-4xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Unlock your wallet</p>
                </div>

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(val) => {
                        setPassword(val);
                        setError("");
                    }}
                    placeholder="Enter your password"
                    error={error}
                />
                <Button onClick={handleUnlock} className="w-full mt-2">
                    Unlock Wallet
                </Button>
            </div>
        </div>
    );
};
