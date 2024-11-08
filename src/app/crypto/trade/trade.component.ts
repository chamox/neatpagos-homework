import { Component, OnInit } from '@angular/core';
import { TradeService } from './trade.service';
import { AuthService } from '../../auth/auth.service';
import { CryptoService } from '../crypto.service';
import { CryptoData } from '../../models/crypto.model';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
})
export class TradeComponent implements OnInit {
  tradeForm: FormGroup;
  cryptoList: CryptoData[] = [];
  userData?: User;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private tradeService: TradeService,
    private authService: AuthService,
    private cryptoService: CryptoService,
    private fb: FormBuilder
  ) {
    this.tradeForm = this.fb.group({
      type: ['buy', Validators.required],
      symbol: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.00000001)]], // Permitir decimales mayores que 0
      price: [{ value: 0, disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserDataAndCrypto();
    this.tradeForm.get('symbol')?.valueChanges.subscribe((symbol) => {
      this.updatePrice(symbol);
    });
  }

  private loadUserDataAndCrypto(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.authService.getUserData(user.uid).subscribe((userData) => {
          this.userData = userData;
        });
      }
    });

    this.cryptoService.getCryptoData().subscribe((cryptoData) => {
      this.cryptoList = cryptoData;
    });
  }

  private updatePrice(symbol: string): void {
    const crypto = this.cryptoList.find((c) => c.symbol === symbol);
    if (crypto) {
      const price = parseFloat(crypto.lastSalePrice.replace(/,/g, ''));
      this.tradeForm.get('price')?.setValue(price.toFixed(2));
    }
  }

  executeTrade(): void {
    if (this.tradeForm.invalid) {
      return;
    }

    const { type, symbol, amount, price } = this.tradeForm.getRawValue();
    const userId = this.userData?.uid || '';

    this.loading = true;
    this.tradeService
      .executeTrade({ type, symbol, amount, price, userId })
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = response.message;
            this.error = null;
            this.tradeForm.reset({
              type: 'buy',
              symbol: '',
              amount: 0,
              price: 0,
            });
          } else {
            this.error = response.message;
            this.successMessage = null;
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error executing trade';
          this.successMessage = null;
          console.error('Error:', err);
        },
      });
  }
}
