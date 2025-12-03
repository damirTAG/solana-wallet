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
        <div className="text-center">
            <QRCodeSVG value={publicKey || ""} size={200} />
            <p className="text-sm text-gray-400 mb-2">Your Wallet Address:</p>
            <div className="bg-gray-800 p-3 rounded-xl mb-4 break-all text-sm">{publicKey}</div>
            <Button onClick={copyAddress} variant="secondary" className="w-full">
                {copied ? "✓ Copied!" : "Copy Address"}
            </Button>
        </div>
    );
};

export default ReceiveTransaction;
