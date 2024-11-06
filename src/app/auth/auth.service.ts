import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState$: Observable<any>; // Observable del estado de autenticación

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    // Asignamos el observable authState$ para emitir el estado de autenticación
    this.authState$ = this.afAuth.authState;
  }

  // Método para iniciar sesión con email y contraseña
  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['']); // Redirige al usuario después de iniciar sesión
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  // Método para registrar un nuevo usuario con email y contraseña
  async registerWithEmail(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      this.router.navigate(['/home']); // Redirige después de registrarse correctamente
    } catch (error) {
      console.error('Registration failed', error);
    }
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/']); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
}
