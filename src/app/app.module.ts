import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleSsoDirective } from './shared/directives/google-sso.directive';
import { AuthComponent } from './auth/auth.component';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CryptoListComponent } from './crypto/crypto-list.component';
import { TradeComponent } from './crypto/trade/trade.component';
import { TransactionHistoryComponent } from './crypto/transaction-history/transaction-history.component';

@NgModule({
  declarations: [
    AppComponent,
    GoogleSsoDirective,
    AuthComponent,
    CryptoListComponent,
    TradeComponent,
    TransactionHistoryComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
