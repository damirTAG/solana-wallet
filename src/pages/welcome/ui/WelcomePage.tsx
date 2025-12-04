import { Button } from "../../../shared";
import { FaLock } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";

interface WelcomePageProps {
    onCreateWallet: () => void;
    onRestoreWallet: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onCreateWallet, onRestoreWallet }) => (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="max-w-md w-full p-6 rounded-2xl border border-white/20 backdrop-blur-lg bg-white/5 shadow-2xl shadow-green-500/10 text-center">
            <div className="mb-8">
                <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center bg-white/10 backdrop-blur-md">
                    <img src="https://solana.com/src/img/branding/solanaLogoMark.svg" alt="Solana Logo" width={30} height={30} />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Solana Wallet</h1>
                <p className="text-[#00FFA3] text-sm">
                    <a
                        href="https://github.com/damirtag/solana-wallet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white transition-colors"
                    >
                        github.com/damirtag/solana-wallet
                    </a>
                </p>
            </div>

            <div className="space-y-3">
                <Button onClick={onCreateWallet} className="w-full">
                    Create New Wallet
                </Button>
                <Button onClick={onRestoreWallet} variant="secondary" className="w-full">
                    Restore Wallet
                </Button>
            </div>

            <div className="mt-8 text-xs text-gray-300 space-y-1">
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
