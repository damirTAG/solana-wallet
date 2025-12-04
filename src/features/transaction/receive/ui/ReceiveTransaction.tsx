import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "../../../../shared";
import { useWalletStore } from "../../../../entities/wallet";

interface ReceiveTransactionProps {
    onClose?: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReceiveTransaction = (_props: ReceiveTransactionProps) => {
    const { publicKey } = useWalletStore();
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(publicKey || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center gap-4 bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl shadow-green-500/5">
            <div className="relative p-4 bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/10">
                <QRCodeSVG value={publicKey || ""} size={180} />
            </div>

            <p className="text-sm text-gray-400 font-medium">Your Wallet Address:</p>

            <div className="bg-black/60 backdrop-blur-sm border border-green-500/20 p-3 rounded-xl break-all text-sm text-center w-full max-w-xs text-gray-300 font-mono">
                {publicKey}
            </div>

            <Button onClick={copyAddress} variant="secondary" className="w-full max-w-xs">
                {copied ? "✓ Copied!" : "Copy Address"}
            </Button>
        </div>
    );
};

export default ReceiveTransaction;
