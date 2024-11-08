export interface CryptoHolding {
  amount: number;
  avgBuyPrice: number;
}

export interface User {
  uid: string;
  email: string;
  balance: number;
  createdAt: Date;
  crypto: {
    [key: string]: CryptoHolding;
  };
}
