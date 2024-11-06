// auth.component.ts
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

  constructor(
    private authService: AuthService,
    public angularFireAuth: AngularFireAuth // Changed from private to public
  ) {}

  login(): void {
    this.authService.loginWithEmail(this.email, this.password);
  }

  register(): void {
    this.authService.registerWithEmail(this.email, this.password);
  }

  logOut() {
    this.angularFireAuth.signOut();
  }
}
