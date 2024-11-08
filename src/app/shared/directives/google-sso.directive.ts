import { Directive, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@firebase/auth';
import { AuthService } from '../../auth/auth.service';

@Directive({
  selector: '[googleSso]',
})
export class GoogleSsoDirective {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  @HostListener('click')
  async onClick() {
    const creds = await this.angularFireAuth.signInWithPopup(
      new GoogleAuthProvider()
    );
    if (creds.user) {
      await this.authService.createUserDocument(creds.user);
      this.authService.navigateToHome();
    }
  }
}
