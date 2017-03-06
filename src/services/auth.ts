import { Injectable } from '@angular/core';
import firebase from 'firebase';

import * as config from '../config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  databaseURL: config.databaseUrl,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
};

@Injectable()
export class AuthService {
  private fireAuth: firebase.auth.Auth;
  private userProfile: any = null;

  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.userProfile = firebase.database().ref('/userProfile');
    this.fireAuth = firebase.auth();
  }

  signUp(email: string, password: string): firebase.Promise<any> {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        this.userProfile.child(newUser.uid).set({email: email});
      });
  }

  signIn(email: string, password: string): firebase.Promise<any> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): firebase.Promise<any> {
    return this.fireAuth.signOut();
  }
}
