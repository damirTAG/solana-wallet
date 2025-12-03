import { Button } from "../../../shared";
import { FaLock } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";

interface WelcomePageProps {
    onCreateWallet: () => void;
    onRestoreWallet: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onCreateWallet, onRestoreWallet }) => (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="mb-8">
                <div className="w-20 h-20 bg-gray-800 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                    <img src="https://solana.com/src/img/branding/solanaLogoMark.svg" alt="Solana Logo" width={30} height={30} />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Solana Wallet</h1>
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

            <div className="mt-8 text-xs text-gray-400 space-y-1">
                <p className="flex items-center justify-center gap-1">
                    <FaLock className="text-[#00FFA3]" /> Your keys are encrypted and stored locally
                </p>
                <p className="flex items-center justify-center gap-1">
                    <BiWorld className="text-[#00FFA3]" /> Connected to Devnet
                </p>
            </div>
        </div>
    </div>
);
