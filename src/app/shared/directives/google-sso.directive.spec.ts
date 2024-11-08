import { GoogleSsoDirective } from './google-sso.directive';

describe('GoogleSsoDirective', () => {
  it('should create an instance', () => {
    const angularFireAuth = jasmine.createSpyObj('AngularFireAuth', [
      'authState',
    ]);
    const authService = jasmine.createSpyObj('AuthService', ['someMethod']);
    const directive = new GoogleSsoDirective(angularFireAuth, authService);
    expect(directive).toBeTruthy();
  });
});
