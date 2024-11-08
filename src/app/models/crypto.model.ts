export interface CryptoData {
  symbol: string;
  companyName: string;
  lastSalePrice: string;
  netChange: string;
  percentageChange: string;
  deltaIndicator: 'up' | 'down';
  lastTradeTimestamp: string;
  lastTradeTimestampDateTime: string;
  volume: string;
  assetClass: string;
  previousClosePrice: number | null;
  openingPrice: number;
  marketStatus: string | null;
}

export interface NasdaqApiResponse {
  data: CryptoData[];
  message: string | null;
  status: {
    rCode: number;
    bCodeMessage: string | null;
    developerMessage: string | null;
  };
}
