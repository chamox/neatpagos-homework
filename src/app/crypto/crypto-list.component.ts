import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptoService } from './crypto.service';
import { AuthService } from '../auth/auth.service';
import { CryptoData } from '../models/crypto.model';
import { User } from '../models/user.model';
import { Subject, takeUntil, switchMap, EMPTY } from 'rxjs';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.css'],
})
export class CryptoListComponent implements OnInit, OnDestroy {
  cryptoList: CryptoData[] = [];
  userData?: User;
  portfolioValue = 0;
  loading = false;
  error: string | null = null;
  private profits: { [key: string]: number } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private cryptoService: CryptoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserDataAndCrypto();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserDataAndCrypto(): void {
    this.loading = true;

    // Subscribe to user data
    this.authService
      .getCurrentUser()
      .pipe(
        switchMap((user) =>
          user ? this.authService.getUserData(user.uid) : EMPTY
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((userData) => {
        this.userData = userData;
        this.updatePortfolioValue();
      });

    // Subscribe to crypto prices with auto-refresh
    this.cryptoService
      .getCryptoData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cryptoData) => {
          this.cryptoList = cryptoData;
          this.loading = false;
          this.updatePortfolioValue();
        },
        error: (error) => {
          this.error = 'Error loading cryptocurrency data';
          this.loading = false;
          console.error('Error:', error);
        },
      });
  }

  private updatePortfolioValue(): void {
    if (this.userData?.crypto && this.cryptoList.length > 0) {
      const { totalValue, profits } =
        this.cryptoService.calculatePortfolioValue(
          this.userData.crypto,
          this.cryptoList
        );
      this.portfolioValue = totalValue;
      this.profits = profits;
    }
  }

  getUserHolding(symbol: string): number {
    return this.userData?.crypto?.[symbol.toLowerCase()]?.amount || 0;
  }

  getProfitLoss(symbol: string): number {
    return this.profits[symbol.toLowerCase()] || 0;
  }

  getCurrentPrice(symbol: string): number {
    return this.cryptoService.getCurrentPrice(symbol, this.cryptoList);
  }
}
