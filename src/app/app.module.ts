import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './signin/signin.component';
import { GoogleSsoDirective } from './auth/google-sso.directive';
import { RequireAuthComponent } from './require-auth/require-auth.component';
import { AuthComponent } from './auth/auth.component'; // Importar AuthComponent
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SigninComponent,
    GoogleSsoDirective,
    RequireAuthComponent,
    AuthComponent, // Asegúrate de declarar AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Configuración de Firebase
    AngularFireAuthModule, // Módulo de autenticación de Firebase
    FormsModule, // Importar FormsModule para usar [(ngModel)]
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
