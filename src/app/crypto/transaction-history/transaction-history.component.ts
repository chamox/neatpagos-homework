// src/app/crypto/transaction-history/transaction-history.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

interface Transaction {
  id: string;
  timestamp: Date;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css'],
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  private userId: string | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadTransactions();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadTransactions(): void {
    if (!this.userId) return;

    this.subscription = this.firestore
      .collection('users')
      .doc(this.userId)
      .collection<Transaction>('transactions', (ref) =>
        ref.orderBy('timestamp', 'desc')
      )
      .valueChanges({ idField: 'id' })
      .subscribe((transactions) => {
        this.transactions = transactions.map((transaction) => ({
          ...transaction,
          timestamp: (transaction.timestamp as unknown as Timestamp).toDate(),
        }));
      });
  }
}
