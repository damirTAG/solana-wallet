import { useEffect, useState } from "react";
import { useWalletStore } from "../../../../entities/wallet";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const PAGE_SIZE = 10;

export function TransactionsList() {
    const { transactions, fetchTransactions } = useWalletStore();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadTransactions = async () => {
            await fetchTransactions(100); // fetch last 100 tx for pagination
            setCurrentPage(1);
        };
        loadTransactions();
    }, [fetchTransactions]);

    const totalPages = Math.max(Math.ceil(transactions.length / PAGE_SIZE), 1);

    const paginatedTransactions = transactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const getStatusLabel = (status: "Success" | "Failed" | "Pending") => {
        switch (status) {
            case "Success":
                return (
                    <span className="flex items-center gap-1 text-green-400 font-semibold">
                        <FaCheckCircle /> Success
                    </span>
                );
            case "Failed":
                return (
                    <span className="flex items-center gap-1 text-red-500 font-semibold">
                        <FaTimesCircle /> Failed
                    </span>
                );
            case "Pending":
                return (
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                        <FaClock /> Pending
                    </span>
                );
            default:
                return status;
        }
    };

    return (
        <div className="mt-4 p-4 bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl shadow-lg shadow-green-500/10">
            <h3 className="text-white text-lg font-semibold mb-3">Transaction History</h3>

            <div className="max-h-80 overflow-y-auto">
                <ul className="space-y-2">
                    {paginatedTransactions.map((tx) => (
                        <li
                            key={tx.signature}
                            className="flex justify-between items-center bg-black/30 backdrop-blur-md border border-green-500/10 rounded-lg p-2 hover:bg-black/50 transition-all duration-200"
                        >
                            <a
                                href={tx.solscanLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00FFA3] underline truncate max-w-[60%]"
                            >
                                {tx.signature.slice(0, 8)}...
                            </a>
                            <span className="flex gap-3 items-center">
                                {getStatusLabel(tx.status as "Success" | "Failed" | "Pending")}
                                <span className="text-gray-400 text-xs">
                                    {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "Pending"}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4 flex justify-center gap-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-black/30 backdrop-blur-md border border-green-500/20 rounded hover:bg-black/50 disabled:opacity-50 transition-all"
                >
                    Previous
                </button>
                <span className="text-gray-400 px-2 py-1">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-black/30 backdrop-blur-md border border-green-500/20 rounded hover:bg-black/50 disabled:opacity-50 transition-all"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
