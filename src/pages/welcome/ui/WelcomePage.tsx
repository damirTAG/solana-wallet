import { Button } from "../../../shared";

import { FaLock } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";

interface WelcomePageProps {
    onCreateWallet: () => void;
    onRestoreWallet: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onCreateWallet, onRestoreWallet }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
            <div className="mb-8">
                <div className="w-20 h-20 bg-linear-to-br from-purple-600 to-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">💎</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">Solana Wallet</h1>
                <p className="text-gray-400">Secure, Simple, Powerful</p>
            </div>

            <div className="space-y-3">
                <Button onClick={onCreateWallet} className="w-full">
                    Create New Wallet
                </Button>
                <Button onClick={onRestoreWallet} variant="secondary" className="w-full">
                    Restore Wallet
                </Button>
            </div>

            <div className="mt-8 text-xs text-gray-500">
                <p>
                    <FaLock /> Your keys are encrypted and stored locally
                </p>
                <p className="mt-1">
                    <BiWorld /> Connected to Devnet
                </p>
            </div>
        </div>
    </div>
);
