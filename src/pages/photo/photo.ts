import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { DomSanitizer } from '@angular/platform-browser';
import { PhotoStorage, PhotoRecord } from '../../services/storage';

const PLACEHOLDER: string = 'assets/images/placeholder.png'

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {
  private base64Image: string = PLACEHOLDER;
  private PLACEHOLDER: string = PLACEHOLDER;
  private photoList: PhotoRecord[] = [];

  constructor(
    private photoStorage: PhotoStorage,
    private navCtrl: NavController,
    private DomSanitizer: DomSanitizer
  ) {
    this.photoStorage.getPhotos().then(photos => {
      this.photoList = photos;
    })
  }

  savePicture() {
    if (this.base64Image !== this.PLACEHOLDER) {
      this.photoStorage.addPhoto(this.base64Image).then(() => {
        this.photoStorage.getPhotos().then(photoList => this.photoList = photoList);
      });
    }
  }

  deletePicture(index) {
    this.photoStorage.deletePhoto(index).then(() => {
      this.photoStorage.getPhotos().then(photoList => this.photoList = photoList);
    });
  }

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
