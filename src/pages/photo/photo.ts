import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { DomSanitizer } from '@angular/platform-browser';


const PLACEHOLDER: string = 'assets/images/placeholder.png'

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {
  private base64Image: string = PLACEHOLDER;
  private PLACEHOLDER: string = PLACEHOLDER;

  constructor(
    public navCtrl: NavController,
    private DomSanitizer: DomSanitizer
  ) {}

  takePicture() {
    if (this.base64Image === this.PLACEHOLDER) {
      Camera.getPicture({
        correctOrientation: true,
        destinationType: Camera.DestinationType.DATA_URL,
      }).then((imageData) => {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        console.error(err);
      });
    } else {
      this.base64Image = this.PLACEHOLDER;
    }
  }

}
