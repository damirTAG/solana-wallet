interface TokenBalance {
    usdc: number;
    usdt: number;
}

export const TokenList = ({ balance }: { balance: TokenBalance }) => {
    const tokens = [
        {
            symbol: "USDC",
            name: "USD Coin",
            balance: balance.usdc,
            icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025",
        },
        {
            symbol: "USDT",
            name: "Tether USD",
            balance: balance.usdt,
            icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025",
        },
    ];

    return (
        <div className="space-y-3">
            {tokens.map((token) => (
                <div
                    key={token.symbol}
                    className="bg-gray-900 border border-gray-700 rounded-2xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-3">
                        <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="font-medium text-white">{token.symbol}</p>
                            <p className="text-sm text-gray-400">{token.name}</p>
                        </div>
                    </div>
                    <p className="text-lg font-bold text-white">{token.balance.toFixed(2)}</p>
                </div>
            ))}
        </div>
    );
};
