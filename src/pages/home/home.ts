import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { PhotoPage } from './../photo/photo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController
  ) {}

  goPhotoPage() {
    this.navCtrl.push(PhotoPage)
  }

}
