import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service'; // Importamos AuthService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'neatpagos-homework';
  isAuthenticated = false; // Declaramos isAuthenticated

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribimos al estado de autenticación expuesto por authService
    this.authService.authState$.subscribe((user) => {
      this.isAuthenticated = !!user; // true si está autenticado, false en caso contrario
    });
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        console.log('Usuario ha cerrado sesión');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }
}
