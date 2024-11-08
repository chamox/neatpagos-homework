import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LandingComponent } from './landing/landing.component';
import { AuthComponent } from './auth/auth.component';
// import { authGuard } from './auth/auth.guard';
import { CryptoListComponent } from './crypto/crypto-list.component';
import { TradeComponent } from './crypto/trade/trade.component';
import { TransactionHistoryComponent } from './crypto/transaction-history/transaction-history.component'; // Importar TransactionHistoryComponent

const routes: Routes = [
  { path: '', component: CryptoListComponent },
  { path: 'signin', component: AuthComponent },
  { path: 'crypto', component: CryptoListComponent },
  { path: 'trade', component: TradeComponent },
  { path: 'transaction-history', component: TransactionHistoryComponent }, // Nueva ruta para TransactionHistoryComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
