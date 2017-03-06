import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
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
  public authSubject: Subject<any> = null;
  private fireAuth: firebase.auth.Auth;
  private userProfile: any = null;
  private zone = null;

  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.userProfile = firebase.database().ref('/userProfile');
    this.fireAuth = firebase.auth();
    this.zone = new NgZone({});
    this.authSubject = new Subject();

    firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        this.authSubject.next(user);
      });
    });
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
