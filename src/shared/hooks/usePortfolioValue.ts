import { useWalletStore } from "../../entities/wallet";
import { usePriceStore } from "../../entities/price";
import { useMemo } from "react";

export const usePortfolioValue = () => {
    const balance = useWalletStore((s) => s.balance);
    const prices = usePriceStore((s) => s.prices);

    return useMemo(() => {
        const solValue = (prices.sol?.price ?? 0) * balance.sol;
        const usdcValue = (prices.usdc?.price ?? 0) * balance.usdc;
        const usdtValue = (prices.usdt?.price ?? 0) * balance.usdt;

        return solValue + usdcValue + usdtValue;
    }, [balance, prices]);
};
