import React from "react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface Token {
    symbol: string;
    name: string;
    icon: string;
    balance: number;
    usdValue: number;
    price: number;
    change24h: number;
}

interface TokenListProps {
    tokens: Token[];
    onTokenClick?: (token: Token) => void;
}

export const TokenList: React.FC<TokenListProps> = ({ tokens, onTokenClick }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 4 : 2,
        }).format(price);
    };

    const formatChange = (change: number) => {
        const sign = change >= 0 ? "+" : "";
        return `${sign}${change.toFixed(2)}%`;
    };

    const formatBalance = (balance: number, symbol: string) => {
        if (balance >= 1000000) {
            return `${(balance / 1000000).toFixed(2)}M ${symbol}`;
        } else if (balance >= 1000) {
            return `${(balance / 1000).toFixed(2)}K ${symbol}`;
        }
        return `${balance.toFixed(4)} ${symbol}`;
    };

    return (
        <div className="space-y-3">
            {tokens.map((token) => (
                <div
                    key={token.symbol}
                    onClick={() => onTokenClick?.(token)}
                    className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-xl p-4 hover:border-green-500/40 hover:bg-black/50 transition-all duration-300 cursor-pointer group shadow-lg shadow-green-500/5"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md group-hover:bg-green-500/30 transition-all"></div>
                                <img
                                    src={token.icon}
                                    alt={token.name}
                                    className="w-12 h-12 rounded-full relative z-10 border-2 border-green-500/30 group-hover:border-green-500/50 transition-all"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%2322c55e"/><text x="50%" y="50%" font-size="20" text-anchor="middle" dy=".3em" fill="white">' +
                                            token.symbol[0] +
                                            "</text></svg>";
                                    }}
                                />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-semibold text-lg group-hover:text-green-400 transition-colors">
                                        {token.symbol}
                                    </h3>
                                    <div
                                        className={`flex items-center gap-1 text-xs ${
                                            token.change24h >= 0 ? "text-green-400" : "text-red-400"
                                        }`}
                                    >
                                        {token.change24h >= 0 ? (
                                            <FaArrowTrendUp className="w-3 h-3" />
                                        ) : (
                                            <FaArrowTrendDown className="w-3 h-3" />
                                        )}
                                        <span className="font-medium">{formatChange(token.change24h)}</span>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">{token.name}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-white font-semibold text-lg">{formatBalance(token.balance, token.symbol)}</p>
                            <p className="text-gray-400 text-sm">{formatPrice(token.usdValue)}</p>
                            <p className="text-gray-500 text-xs mt-0.5">@ {formatPrice(token.price)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
