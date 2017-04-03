import { PhotoStorage } from './storage';
import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Injectable()
export class AuthService {
  constructor(
    private storage: PhotoStorage,
    public af: AngularFire
  ) {}

  create(email: string, password: string): firebase.Promise<any> {
    return this.af.auth.createUser({ email, password });
  }

  login(email: string, password: string): firebase.Promise<any> {
    return this.af.auth.login({ email, password });
  }

  logout(): firebase.Promise<any> {
    return this.af.auth.logout();
  }
}
