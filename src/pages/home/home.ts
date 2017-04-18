import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { PhotoPage } from './../photo/photo';
import { MapsPage } from './../maps/maps';
import { AuthService } from './../../services/auth';
import { PhotoStorage } from './../../services/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private user = null;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private storage: PhotoStorage
  ) {
    this.authService.af.auth.subscribe((auth) => {
      if (!auth) {
        this.user = null;
        this.storage.initDbByUser(null);
      } else {
        this.user = auth.auth;
        this.storage.initDbByUser(this.user.uid);
      }
    });
  }

  createModal(title: string, okLabel: string, handler: Function) {
    return this.alertCtrl.create({
      title,
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'email',
          placeholder: 'E-mail',
          type: 'email',
          value: '',
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password',
          value: '',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: okLabel,
          handler,
        }
      ]
    });
  }

  signup() {
    const alert = this.createModal('Sign Up', 'Register', (data) => {
      if (this.isValid(data.email, data.password)) {
        this.authService.create(data.email, data.password);
      } else {
        return false;
      }
    });
    alert.present();
  }

  login() {
    const alert = this.createModal('Login', 'Login', (data) => {
      if (this.isValid(data.email, data.password)) {
        this.authService.login(data.email, data.password);
      } else {
        return false;
      }
    });
    alert.present();
  }

  isValid(username, password) {
    return username && password;
  }

  logout() {
    this.authService.logout();
  }

  goPhotoPage() {
    this.navCtrl.push(PhotoPage);
  }

  goMapsPage() {
    this.navCtrl.push(MapsPage);
  }
}
