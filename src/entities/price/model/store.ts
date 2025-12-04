import { create } from "zustand";
import { type TokenInfo, type TokenPrice } from "../types";

interface PriceState {
    prices: {
        sol?: TokenPrice;
        usdc?: TokenPrice;
        usdt?: TokenPrice;
    };
    fetchPrices: () => Promise<void>;
}

interface PriceState {
    prices: {
        sol?: TokenPrice;
        usdc?: TokenPrice;
        usdt?: TokenPrice;
    };
    fetchPrices: () => Promise<void>;
}

export const usePriceStore = create<PriceState>((set) => ({
    prices: {},
    fetchPrices: async () => {
        try {
            const query =
                "So11111111111111111111111111111111111111112," + // SOL
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v," + // USDC
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; // USDT

            const response: TokenInfo[] = await fetch(`https://datapi.jup.ag/v1/assets/search?query=${query}`).then((r) => r.json());

            const tokenMap = new Map<string, TokenInfo>(response.map((token) => [token.symbol, token]));

            const sol = tokenMap.get("SOL");
            const usdc = tokenMap.get("USDC");
            const usdt = tokenMap.get("USDT");

            set({
                prices: {
                    sol: sol && {
                        price: sol.usdPrice,
                        change24h: sol.stats24h?.priceChange ?? 0,
                        icon: sol.icon,
                        symbol: sol.symbol,
                        name: sol.name,
                    },
                    usdc: usdc && {
                        price: usdc.usdPrice,
                        change24h: usdc.stats24h?.priceChange ?? 0,
                        icon: usdc.icon,
                        symbol: usdc.symbol,
                        name: usdc.name,
                    },
                    usdt: usdt && {
                        price: usdt.usdPrice,
                        change24h: usdt.stats24h?.priceChange ?? 0,
                        icon: usdt.icon,
                        symbol: usdt.symbol,
                        name: usdt.name,
                    },
                },
            });
        } catch (error) {
            console.error("Error fetching prices:", error);
        }
    },
}));
