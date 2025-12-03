import { useState } from "react";

interface BalanceCardProps {
    balance: { sol: number };
    publicKey: string;
}

export const BalanceCard = ({ balance, publicKey }: BalanceCardProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(publicKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6 w-full">
            <p className="text-sm text-gray-400 mb-1">Total Balance</p>
            <h2 className="text-4xl font-bold mb-4 text-white">{balance.sol.toFixed(4)} SOL</h2>
            <p
                className="text-xs text-gray-500 break-all cursor-pointer hover:text-white transition-colors"
                onClick={handleCopy}
                title="Click to copy"
            >
                {publicKey} {copied && <span className="text-green-400 ml-2">Copied!</span>}
            </p>
        </div>
    );
};
