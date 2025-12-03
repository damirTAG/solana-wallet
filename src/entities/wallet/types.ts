export interface Transaction {
    signature: string;
    status: "Success" | "Failed";
    blockTime: number | null;
    solscanLink: string;
}
