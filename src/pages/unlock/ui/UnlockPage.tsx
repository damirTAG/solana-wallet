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
            <div className="max-w-md w-full p-6 rounded-2xl border border-white/20 backdrop-blur-lg bg-white/5 shadow-2xl shadow-green-500/10">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center bg-white/10 backdrop-blur-md">
                        <FaLock className="text-[#00FFA3] text-4xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-300">Unlock your wallet</p>
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
                <Button onClick={handleUnlock} className="w-full mt-4">
                    Unlock Wallet
                </Button>
            </div>
        </div>
    );
};
