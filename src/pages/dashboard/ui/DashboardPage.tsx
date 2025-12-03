import { useState, useEffect } from "react";
import { useWalletStore, BalanceCard, TokenList } from "../../../entities/wallet";
import { Button, Modal } from "../../../shared";
import { SendTransaction } from "../../../features/transaction/send";
import ReceiveTransaction from "../../../features/transaction/receive";

import { IoIosInformationCircle } from "react-icons/io";
import { FaRepeat } from "react-icons/fa6";
import { FaTrash, FaLock, FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";

export const DashboardPage = () => {
    const { publicKey, balance, isUnlocked, lock, deleteWallet, refreshBalance } = useWalletStore();
    const [showSend, setShowSend] = useState(false);
    const [showReceive, setShowReceive] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (isUnlocked) {
            refreshBalance();
            const interval = setInterval(refreshBalance, 30000);
            return () => clearInterval(interval);
        }
    }, [isUnlocked]);

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <img src="https://solana.com/src/img/branding/solanaLogoMark.svg" alt="Solana Logo" width={30} height={30} />
                    <div className="flex gap-2">
                        <button onClick={refreshBalance} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700" title="Refresh">
                            <FaRepeat />
                        </button>
                        <button
                            onClick={() => setShowDelete(true)}
                            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                            title="Delete Wallet"
                        >
                            <FaTrash />
                        </button>
                        <button onClick={lock} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700" title="Lock">
                            <FaLock />
                        </button>
                    </div>
                </div>

                <BalanceCard balance={balance} publicKey={publicKey ?? ""} />

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

                <TokenList balance={balance} />

                <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-xl">
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                        <IoIosInformationCircle className="text-[#00FFA3] w-5 h-5 shrink-0" />
                        <span>
                            You're connected to Devnet. Get test SOL from{" "}
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
            </div>

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
