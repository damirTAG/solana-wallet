import { useState } from "react";

interface BalanceCardProps {
    balance: { usd: number };
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
        <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 mb-6 w-full shadow-2xl shadow-green-500/5 hover:border-green-500/30 transition-all duration-300">
            <p className="text-sm text-gray-400 mb-1 font-medium">Total Balance</p>

            <h2 className="text-4xl font-bold mb-4 text-white">${balance.usd.toFixed(2)}</h2>

            <div className="relative group" onClick={handleCopy}>
                <p
                    className="text-xs text-gray-500 break-all cursor-pointer group-hover:text-green-400 transition-colors font-mono bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-green-500/10 group-hover:border-green-500/30"
                    title="Click to copy"
                >
                    {publicKey}
                </p>
                {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-green-400 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20 animate-fade-in">
                        Copied!
                    </span>
                )}
            </div>
        </div>
    );
};
