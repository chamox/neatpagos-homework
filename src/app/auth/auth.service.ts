// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
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

  private generateRandomBalance(): number {
    return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
  }

  private handleAuthError(error: any): string {
    console.error('Auth error:', error);
    const errorCode = error.code;
    return (
      this.firebaseErrorMessages[errorCode] ||
      'Ha ocurrido un error durante la autenticación.'
    );
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
        this.router.navigate(['/require-auth']);
        return { success: true };
      }
      return { success: false, message: 'No se pudo iniciar sesión.' };
    } catch (error: any) {
      const errorMessage = this.handleAuthError(error);
      return { success: false, message: errorMessage };
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
        const userData: User = {
          uid: credentials.user.uid,
          email: credentials.user.email || '',
          balance: this.generateRandomBalance(),
          createdAt: new Date(),
        };
        await this.firestore
          .collection('users')
          .doc(credentials.user.uid)
          .set(userData);
        this.router.navigate(['/require-auth']);
        return { success: true };
      }
      return { success: false, message: 'No se pudo completar el registro.' };
    } catch (error: any) {
      const errorMessage = this.handleAuthError(error);
      return { success: false, message: errorMessage };
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
          const userData: User = {
            uid: credentials.user.uid,
            email: credentials.user.email || '',
            balance: this.generateRandomBalance(),
            createdAt: new Date(),
          };
          await this.firestore
            .collection('users')
            .doc(credentials.user.uid)
            .set(userData);
        }

        this.router.navigate(['/require-auth']);
        return { success: true };
      }
      return {
        success: false,
        message: 'No se pudo iniciar sesión con Google.',
      };
    } catch (error: any) {
      const errorMessage = this.handleAuthError(error);
      return { success: false, message: errorMessage };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/']);
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
}
