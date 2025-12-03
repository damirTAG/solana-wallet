import { useState, useEffect } from "react";
import { useWalletStore } from "./entities/wallet";

import { CreateWallet } from "./features/wallet/create";
import { RestoreWallet } from "./features/wallet/restore";

import { DashboardPage } from "./pages/dashboard/ui/DashboardPage";
import { WelcomePage } from "./pages/welcome/ui/WelcomePage";
import { UnlockPage } from "./pages/unlock/ui/UnlockPage";

import { Modal, storageLib } from "./shared";

function App() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [hasWallet, setHasWallet] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const { publicKey, isUnlocked } = useWalletStore();

    useEffect(() => {
        const checkWallet = async () => {
            const data = await storageLib.get("wallet");
            setHasWallet(!!data);
            setIsChecking(false);
        };
        checkWallet();
    }, [publicKey]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {!hasWallet ? (
                <WelcomePage onCreateWallet={() => setShowCreateModal(true)} onRestoreWallet={() => setShowRestoreModal(true)} />
            ) : !isUnlocked ? (
                <UnlockPage onUnlock={() => {}} />
            ) : (
                <DashboardPage />
            )}

            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Wallet">
                <CreateWallet onClose={() => setShowCreateModal(false)} />
            </Modal>

            <Modal isOpen={showRestoreModal} onClose={() => setShowRestoreModal(false)} title="Restore Wallet">
                <RestoreWallet onClose={() => setShowRestoreModal(false)} />
            </Modal>
        </div>
    );
}

export default App;
