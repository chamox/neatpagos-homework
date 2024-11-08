// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState$: Observable<any>;

  private readonly firebaseErrorMessages: { [key: string]: string } = {
    'auth/invalid-credential':
      'Credenciales inválidas. Por favor, verifica tu email y contraseña.',
    'auth/user-not-found': 'No existe una cuenta con este email.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/email-already-in-use': 'Este email ya está registrado.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email': 'El formato del email es inválido.',
  };

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.authState$ = this.afAuth.authState;
  }

  private generateInitialCryptoHoldings(): User['crypto'] {
    return {
      btc: { amount: 0, avgBuyPrice: 0 },
      eth: { amount: 0, avgBuyPrice: 0 },
      xrp: { amount: 0, avgBuyPrice: 0 },
      ada: { amount: 0, avgBuyPrice: 0 },
      doge: { amount: 0, avgBuyPrice: 0 },
    };
  }

  private generateRandomBalance(): number {
    return Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
  }

  private handleAuthError(error: any): string {
    console.error('Auth error:', error);
    return (
      this.firebaseErrorMessages[error.code] ||
      'Ha ocurrido un error durante la autenticación.'
    );
  }

  public async createUserDocument(user: any): Promise<void> {
    const userData: User = {
      uid: user.uid,
      email: user.email || '',
      balance: this.generateRandomBalance(),
      createdAt: new Date(),
      crypto: this.generateInitialCryptoHoldings(),
    };
    await this.firestore.collection('users').doc(user.uid).set(userData);
  }

  async loginWithEmail(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const credentials = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      if (credentials.user) {
        this.router.navigate(['']);
        return { success: true };
      }
      return { success: false, message: 'No se pudo iniciar sesión.' };
    } catch (error: any) {
      return { success: false, message: this.handleAuthError(error) };
    }
  }

  async registerWithEmail(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const credentials = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (credentials.user) {
        await this.createUserDocument(credentials.user);
        this.router.navigate(['']);
        return { success: true };
      }
      return { success: false, message: 'No se pudo completar el registro.' };
    } catch (error: any) {
      return { success: false, message: this.handleAuthError(error) };
    }
  }

  async loginWithGoogle(): Promise<{ success: boolean; message?: string }> {
    try {
      const provider = new GoogleAuthProvider();
      const credentials = await this.afAuth.signInWithPopup(provider);

      if (credentials.user) {
        const userDoc = await this.firestore
          .collection('users')
          .doc(credentials.user.uid)
          .get()
          .toPromise();

        if (!userDoc?.exists) {
          await this.createUserDocument(credentials.user);
        }

        this.router.navigate(['']);
        return { success: true };
      }
      return {
        success: false,
        message: 'No se pudo iniciar sesión con Google.',
      };
    } catch (error: any) {
      return { success: false, message: this.handleAuthError(error) };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  }

  getUserData(uid: string): Observable<User | undefined> {
    return this.firestore.collection('users').doc<User>(uid).valueChanges();
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.user;
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
