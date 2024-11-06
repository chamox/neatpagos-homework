import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './signin/signin.component';
import { GoogleSsoDirective } from './google-sso.directive';
import { environment } from '../environments/environment';
import { RequireAuthComponent } from './require-auth/require-auth.component'; // Asegúrate de tener un archivo de entorno con la configuración de Firebase

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    SigninComponent,
    GoogleSsoDirective,
    RequireAuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Proporciona la configuración de Firebase
    AngularFireAuthModule, // Importa el módulo de autenticación de Firebase
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
