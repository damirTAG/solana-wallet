import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "../../../../shared";
import { useWalletStore } from "../../../../entities/wallet";

interface ReceiveTransactionProps {
    onClose?: () => void;
}

const ReceiveTransaction = (_: ReceiveTransactionProps) => {
    const { publicKey } = useWalletStore();
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(publicKey || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-900 rounded-2xl shadow-lg">
            <div className="relative p-4 bg-gray-800 rounded-2xl flex items-center justify-center shadow-xl">
                <QRCodeSVG value={publicKey || ""} size={180} />
            </div>

            <p className="text-sm text-gray-400">Your Wallet Address:</p>

            <div className="bg-gray-800 p-3 rounded-xl break-all text-sm text-center w-full max-w-xs">{publicKey}</div>

            <Button onClick={copyAddress} variant="secondary" className="w-full max-w-xs">
                {copied ? "✓ Copied!" : "Copy Address"}
            </Button>
        </div>
    );
};

export default ReceiveTransaction;
