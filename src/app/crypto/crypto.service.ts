import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  interval,
  startWith,
  switchMap,
  catchError,
  map,
} from 'rxjs';
import { NasdaqApiResponse, CryptoData } from '../models/crypto.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly API_URL = '/api/api/quote/watchlist';
  private readonly REFRESH_INTERVAL = 30000; // 30 seconds

  private readonly CRYPTO_SYMBOLS = ['btc', 'eth', 'xrp', 'ada', 'doge'];

  constructor(private http: HttpClient) {}

  getCryptoData(): Observable<CryptoData[]> {
    return interval(this.REFRESH_INTERVAL).pipe(
      startWith(0),
      switchMap(() => this.fetchCryptoData()),
      catchError((error) => {
        console.error('Error fetching crypto data:', error);
        return [];
      })
    );
  }

  private fetchCryptoData(): Observable<CryptoData[]> {
    const symbols = this.CRYPTO_SYMBOLS.map(
      (symbol) => `symbol=${symbol}|crypto`
    ).join('&');
    const url = `${this.API_URL}?${symbols}`;

    return this.http
      .get<NasdaqApiResponse>(url)
      .pipe(map((response) => response.data || []));
  }

  calculatePortfolioValue(
    holdings: User['crypto'],
    currentPrices: CryptoData[]
  ): {
    totalValue: number;
    profits: { [key: string]: number };
  } {
    let totalValue = 0;
    const profits: { [key: string]: number } = {};

    Object.entries(holdings).forEach(([symbol, holding]) => {
      const cryptoData = currentPrices.find(
        (p) => p.symbol.toLowerCase() === symbol
      );

      if (cryptoData) {
        const currentPrice = parseFloat(cryptoData.lastSalePrice);
        const currentValue = holding.amount * currentPrice;
        const costBasis = holding.amount * holding.avgBuyPrice;

        totalValue += currentValue;
        profits[symbol] = currentValue - costBasis;
      }
    });

    return { totalValue, profits };
  }

  getCurrentPrice(symbol: string, prices: CryptoData[]): number {
    const crypto = prices.find(
      (p) => p.symbol.toLowerCase() === symbol.toLowerCase()
    );
    return crypto ? parseFloat(crypto.lastSalePrice) : 0;
  }
}
