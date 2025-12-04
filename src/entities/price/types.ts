export interface TokenInfo {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    decimals: number;
    circSupply: number;
    totalSupply: number;
    tokenProgram: string;

    firstPool: FirstPool;
    holderCount: number;

    audit: AuditInfo;

    apy: {
        jupEarn: number;
    };

    organicScore: number;
    organicScoreLabel: string;

    ctLikes: number;
    smartCtLikes: number;

    isVerified: boolean;
    tags: string[];

    createdAt: string;
    fdv: number;
    mcap: number;
    usdPrice: number;
    priceBlockId: number;
    liquidity: number;

    stats5m: StatsShort;
    stats1h: StatsFull;
    stats6h: StatsFull;
    stats24h: StatsFull;

    stats7d: StatsPriceOnly;
    stats30d: StatsPriceOnly;

    updatedAt: string;
}

export interface FirstPool {
    id: string;
    createdAt: string;
}

export interface AuditInfo {
    mintAuthorityDisabled: boolean;
    freezeAuthorityDisabled: boolean;
    topHoldersPercentage: number;
}

export interface StatsShort {
    priceChange: number;
}

export interface StatsPriceOnly {
    priceChange: number;
}

export interface StatsFull {
    priceChange: number;
    liquidityChange: number;
    volumeChange: number;

    buyVolume: number;
    sellVolume: number;

    buyOrganicVolume: number;
    sellOrganicVolume: number;

    numBuys: number;
    numSells: number;

    numTraders: number;
    numOrganicBuyers: number;
    numNetBuyers: number;
}

export interface TokenPrice {
    price: number;
    change24h: number;
    icon: string;
    symbol: string;
    name: string;
}
