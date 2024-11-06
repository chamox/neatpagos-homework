import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { LandingComponent } from './landing/landing.component';
import { RequireAuthComponent } from './require-auth/require-auth.component';
import { AuthComponent } from './auth/auth.component'; // Importar AuthComponent
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signin', component: AuthComponent },
  { path: 'auth', component: AuthComponent }, // Nueva ruta para el componente de autenticación
  {
    path: 'require-auth',
    component: RequireAuthComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
