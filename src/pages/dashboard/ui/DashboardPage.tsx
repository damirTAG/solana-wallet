import { useState, useEffect } from "react";
import { useWalletStore, BalanceCard, TokenList } from "../../../entities/wallet";
import { Button, Modal, usePortfolioValue } from "../../../shared";
import { Header } from "../../../widgets/header";
import { SendTransaction } from "../../../features/transaction/send";
import ReceiveTransaction from "../../../features/transaction/receive";
import { TransactionsList } from "../../../features/transaction/history";

import { IoIosInformationCircle } from "react-icons/io";
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";

import { usePriceStore } from "../../../entities/price";

export const DashboardPage = () => {
    const { publicKey, isUnlocked, balance, deleteWallet, refreshBalance } = useWalletStore();
    const { prices, fetchPrices } = usePriceStore();

    const totalPortfolioValue = usePortfolioValue();

    const [showSend, setShowSend] = useState(false);
    const [showReceive, setShowReceive] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const tokens = Object.entries(balance ?? {}).map(([symbol, balance]) => {
        const priceInfo = Object.values(prices).find((p) => p?.symbol.toUpperCase() === symbol.toUpperCase());

        return {
            symbol: priceInfo?.symbol || symbol,
            name: priceInfo?.name || symbol,
            icon: priceInfo?.icon || "",
            balance,
            usdValue: balance * (priceInfo?.price || 0),
            price: priceInfo?.price || 0,
            change24h: priceInfo?.change24h || 0,
        };
    });

    useEffect(() => {
        if (!isUnlocked) return;

        refreshBalance();
        fetchPrices();

        const interval = setInterval(() => {
            refreshBalance();
            fetchPrices();
        }, 30000);

        return () => clearInterval(interval);
    }, [isUnlocked, fetchPrices, refreshBalance]);

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-md mx-auto">
                <Header onRefresh={fetchPrices} onDelete={() => setShowDelete(true)} onLock={() => useWalletStore.getState().lock()} />

                <BalanceCard balance={{ usd: totalPortfolioValue }} publicKey={publicKey ?? ""} />

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <Button onClick={() => setShowSend(true)} className="w-full flex items-center justify-center gap-2">
                        <FaArrowCircleUp /> Send
                    </Button>
                    <Button
                        onClick={() => setShowReceive(true)}
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <FaArrowCircleDown /> Receive
                    </Button>
                </div>

                <TokenList tokens={tokens} />

                {["devnet", "testnet"].includes(import.meta.env.VITE_SOLANA_NETWORK) && (
                    <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-xl">
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            <IoIosInformationCircle className="text-[#00FFA3] w-5 h-5 shrink-0" />
                            <span>
                                You're connected to{" "}
                                {import.meta.env.VITE_SOLANA_NETWORK.charAt(0).toUpperCase() + import.meta.env.VITE_SOLANA_NETWORK.slice(1)}
                                . Get test SOL from{" "}
                                <a
                                    href="https://faucet.solana.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-[#00FFA3]"
                                >
                                    Solana Faucet
                                </a>
                            </span>
                        </p>
                    </div>
                )}

                <TransactionsList />
            </div>

            {/* Modals */}
            <Modal isOpen={showSend} onClose={() => setShowSend(false)} title="Send Transaction">
                <SendTransaction onClose={() => setShowSend(false)} />
            </Modal>

            <Modal isOpen={showReceive} onClose={() => setShowReceive(false)} title="Receive">
                <ReceiveTransaction onClose={() => setShowReceive(false)} />
            </Modal>

            <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Wallet">
                <div>
                    <p className="text-gray-300 mb-4">
                        Are you sure you want to delete this wallet? Make sure you have your seed phrase saved.
                    </p>
                    <div className="flex gap-2">
                        <Button onClick={() => setShowDelete(false)} variant="secondary" className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                await deleteWallet();
                                setShowDelete(false);
                            }}
                            variant="danger"
                            className="flex-1"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
