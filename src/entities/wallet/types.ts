export interface Transaction {
    signature: string;
    status: "Success" | "Failed";
    blockTime: number | null;
    solscanLink: string;
}

export interface WalletData {
    encrypted: string;
    salt: string;
    iv: string;
    publicKey: string;
}
