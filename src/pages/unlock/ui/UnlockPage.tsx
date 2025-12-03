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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-linear-to-br from-purple-600 to-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl">
                            <FaLock />
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
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
                <Button onClick={handleUnlock} className="w-full">
                    Unlock Wallet
                </Button>
            </div>
        </div>
    );
};
