import React from "react";
import { FaTrash, FaLock } from "react-icons/fa";
import { FaRepeat, FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { usePriceStore } from "../../../entities/price";

interface HeaderProps {
    onRefresh: () => void;
    onDelete: () => void;
    onLock: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, onDelete, onLock }) => {
    const sol = usePriceStore((s) => s.prices.sol);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const formatChange = (change: number) => {
        const sign = change >= 0 ? "+" : "";
        return `${sign}${change.toFixed(2)}%`;
    };

    return (
        <div className="flex justify-between items-center mb-2 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-green-500/20 shadow-2xl shadow-green-500/5">
            <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20">
                    <img src="https://solana.com/src/img/branding/solanaLogoMark.svg" alt="Solana Logo" width={24} height={24} />
                </div>

                {sol && (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{formatPrice(sol.price)}</span>
                            <span className="text-xs text-gray-400 font-medium">SOL</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {sol.change24h >= 0 ? (
                                <FaArrowTrendUp className="w-3 h-3 text-green-400" />
                            ) : (
                                <FaArrowTrendDown className="w-3 h-3 text-red-400" />
                            )}
                            <span className={`text-sm font-medium ${sol.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                                {formatChange(sol.change24h)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">24h</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onRefresh}
                    className="p-2.5 bg-black/40 backdrop-blur-sm rounded-lg hover:bg-green-500/10 transition-all duration-200 hover:scale-105 active:scale-95 border border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/20 group"
                    title="Refresh"
                >
                    <FaRepeat className="text-gray-300 group-hover:text-green-400 transition-colors" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2.5 bg-black/40 backdrop-blur-sm rounded-lg hover:bg-red-500/10 transition-all duration-200 hover:scale-105 active:scale-95 border border-green-500/20 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/20 group"
                    title="Delete Wallet"
                >
                    <FaTrash className="text-gray-300 group-hover:text-red-400 transition-colors" />
                </button>
                <button
                    onClick={onLock}
                    className="p-2.5 bg-black/40 backdrop-blur-sm rounded-lg hover:bg-green-500/10 transition-all duration-200 hover:scale-105 active:scale-95 border border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/20 group"
                    title="Lock"
                >
                    <FaLock className="text-gray-300 group-hover:text-green-400 transition-colors" />
                </button>
            </div>
        </div>
    );
};
