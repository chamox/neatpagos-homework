import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
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
    // Simular 10% de rechazo
    const willSucceed = Math.random() > 0.1;

    return of(willSucceed).pipe(
      delay(1000), // Simular latencia
      map((success) => {
        if (!success) {
          return {
            success: false,
            message: 'Transacción rechazada por el exchange',
          };
        }

        const transaction = {
          id: this.firestore.createId(),
          timestamp: new Date(),
          type: request.type,
          symbol: request.symbol,
          amount: request.amount,
          price: request.price,
          total: request.amount * request.price,
        };

        // Store transaction in Firestore
        this.firestore
          .collection('users')
          .doc(request.userId)
          .collection('transactions')
          .add(transaction);

        // Update user's crypto holdings
        this.updateUserHoldings(request);

        return {
          success: true,
          message: 'Transacción completada exitosamente',
          transaction,
        };
      })
    );
  }

  private async updateUserHoldings(request: TradeRequest): Promise<void> {
    const userRef = this.firestore.collection('users').doc(request.userId);
    const userDoc = await userRef.get().toPromise();
    const userData = userDoc?.data() as any;

    if (!userData) return;

    const multiplier = request.type === 'buy' ? 1 : -1;
    const newAmount =
      (userData.crypto[request.symbol]?.amount || 0) +
      multiplier * request.amount;
    const newBalance =
      userData.balance - multiplier * request.amount * request.price;

    await userRef.update({
      [`crypto.${request.symbol}.amount`]: newAmount,
      [`crypto.${request.symbol}.avgBuyPrice`]: request.price,
      balance: newBalance,
    });
  }
}
