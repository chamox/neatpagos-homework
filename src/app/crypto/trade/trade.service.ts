import { Injectable } from '@angular/core';
import { Observable, of, firstValueFrom } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface TradeRequest {
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  userId: string;
}

interface TradeResponse {
  success: boolean;
  message: string;
  transaction?: {
    id: string;
    timestamp: Date;
    type: 'buy' | 'sell';
    symbol: string;
    amount: number;
    price: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TradeService {
  constructor(private firestore: AngularFirestore) {}

  executeTrade(request: TradeRequest): Observable<TradeResponse> {
    return of(true).pipe(
      delay(1000), // Simulate latency
      switchMap(async () => {
        const normalizedSymbol = request.symbol.toLowerCase();
        const userRef = this.firestore.collection('users').doc(request.userId);
        const userDoc = await firstValueFrom(userRef.get());
        const userData = userDoc?.data() as any;

        if (!userData) {
          return {
            success: false,
            message: 'User data not found',
          };
        }

        const totalCost = request.amount * request.price;

        if (request.type === 'buy' && userData.balance < totalCost) {
          return {
            success: false,
            message: 'Insufficient funds',
          };
        }

        if (
          request.type === 'sell' &&
          (!userData.crypto[normalizedSymbol] ||
            userData.crypto[normalizedSymbol].amount < request.amount)
        ) {
          return {
            success: false,
            message: 'Insufficient cryptocurrency holdings',
          };
        }

        const transaction = {
          id: this.firestore.createId(),
          timestamp: new Date(),
          type: request.type,
          symbol: normalizedSymbol,
          amount: request.amount,
          price: request.price,
          total: totalCost,
        };

        // Store transaction in Firestore
        await this.firestore
          .collection('users')
          .doc(request.userId)
          .collection('transactions')
          .add(transaction);

        // Update user's crypto holdings
        await this.updateUserHoldings(request, userData, normalizedSymbol);

        return {
          success: true,
          message: 'Transaction completed successfully',
          transaction,
        };
      })
    );
  }

  private async updateUserHoldings(
    request: TradeRequest,
    userData: any,
    normalizedSymbol: string
  ): Promise<void> {
    const userRef = this.firestore.collection('users').doc(request.userId);

    const multiplier = request.type === 'buy' ? 1 : -1;
    const newAmount =
      (userData.crypto[normalizedSymbol]?.amount || 0) +
      multiplier * request.amount;
    const newBalance =
      userData.balance - multiplier * request.amount * request.price;

    await userRef.update({
      [`crypto.${normalizedSymbol}.amount`]: newAmount,
      [`crypto.${normalizedSymbol}.avgBuyPrice`]: request.price,
      balance: newBalance,
    });
  }
}
