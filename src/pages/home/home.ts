import { Component, NgZone } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { PhotoPage } from './../photo/photo';
import { MapsPage } from './../maps/maps';
import { AuthService } from './../../services/auth';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private zone = null;
  private user = null;
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {
    this.zone = new NgZone({});
    firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        this.user = user;
      });
    });
  }

  signIn() {
    const alert = this.alertCtrl.create({
      title: 'Login',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'username',
          placeholder: 'Username',
          type: 'email'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Login',
          handler: data => {
            if (this.isValid(data.username, data.password)) {
              this.authService.signIn(data.username, data.password)
                .then(() => {
                  return true;
                })
                .catch((error) => {
                  this.errorAlert(error.message);
                });
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  errorAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  isValid(username, password) {
    return username && password;
  }

  signOut() {
    this.authService.signOut();
  }

  onAuthSuccess(data) {
    console.log(data);
  }

  goPhotoPage() {
    this.navCtrl.push(PhotoPage);
  }

  goMapsPage() {
    this.navCtrl.push(MapsPage);
  }
}
