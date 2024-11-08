import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    public angularFireAuth: AngularFireAuth
  ) {}

  async login(): Promise<void> {
    const result = await this.authService.loginWithEmail(
      this.email,
      this.password
    );
    if (!result.success && result.message) {
      this.errorMessage = result.message;
    }
  }

  async register(): Promise<void> {
    const result = await this.authService.registerWithEmail(
      this.email,
      this.password
    );
    if (!result.success && result.message) {
      this.errorMessage = result.message;
    }
  }

  async loginWithGoogle(): Promise<void> {
    const result = await this.authService.loginWithGoogle();
    if (!result.success && result.message) {
      this.errorMessage = result.message;
    }
  }

  logOut(): void {
    this.authService.logout();
  }
}
