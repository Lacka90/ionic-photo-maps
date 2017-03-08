import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { Camera, Geolocation, Coordinates } from 'ionic-native';
import { DomSanitizer } from '@angular/platform-browser';
import { PhotoStorage, PhotoRecord } from '../../services/storage';

import * as exif from 'exif-js';

const PLACEHOLDER: string = 'assets/images/placeholder.png'

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {
  private base64Image: string = PLACEHOLDER;
  private PLACEHOLDER: string = PLACEHOLDER;
  private coords: Coordinates = null;
  private locationLoading: boolean = false;
  private image: Blob = null;

  constructor(
    private photoStorage: PhotoStorage,
    private navCtrl: NavController,
    private DomSanitizer: DomSanitizer,
    private platform: Platform
  ) {}

  savePicture() {
    if (this.image) {
      const metadata = { contentType: (this.image as any).type };

      const filename = `image-${new Date().getTime()}.jpg`;
      this.photoStorage.uploadPicture(this.image, this.coords, filename, metadata)
        .then(() => this.resetImage())
        .catch(() => this.resetImage());
    }
  }

  resetImage() {
    this.coords = null;
    this.image = null;
    this.base64Image = this.PLACEHOLDER;
  }

  deletePicture(photo: PhotoRecord) {
    this.photoStorage.deletePhoto(photo);
  }

  takePicture() {
    if (this.base64Image === this.PLACEHOLDER) {
      Camera.getPicture({
        correctOrientation: true,
        targetWidth: 720,
        destinationType: Camera.DestinationType.FILE_URI,
      }).then((fileData) => {
        this.locationLoading = true;
        return this.makeBlobFromFile(fileData);
      }).then((imageData) => {
        return this.rotateImage(imageData);
      }).then((rotatedData: Blob) => {
        this.image = rotatedData;
        const urlCreator = window.URL || (window as any).webkitURL;
        this.base64Image = urlCreator.createObjectURL(rotatedData);
        this.getGeoCoords().then(coords => this.coords = coords);
      });
    } else {
      this.resetCoords();
      this.base64Image = this.PLACEHOLDER;
    }
  }

  getGeoCoords(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      return Geolocation.getCurrentPosition().then((resp) => {
        this.locationLoading = false;
        resolve(resp.coords);
      }).catch((error) => {
        this.locationLoading = false;
        this.resetCoords();
      });
    });
  }

  resetCoords() {
    this.coords = null;
    this.image = null;
  }

  makeBlobFromFile(file): Promise<Blob> {
    return new Promise((resolve, reject) => {
      (window as any).resolveLocalFileSystemURL(file, (fileEntry) => {
        fileEntry.file((resFile) => {
          const reader = new FileReader();
          reader.onloadend = (evt: any) => {
            const imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = 'sample.jpg';
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };
          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  rotateImage(imageBlob): Promise<Blob> {
    const urlCreator = window.URL || (window as any).webkitURL;
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        exif.getData(img, function () {
          let width = img.width,
              height = img.height,
              canvas = document.createElement('canvas'),
              ctx = canvas.getContext("2d"),
              srcOrientation = exif.getTag(this, "Orientation");

          if ([5,6,7,8].indexOf(srcOrientation) > -1) {
            canvas.width = height;
            canvas.height = width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }

          switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height , width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: ctx.transform(1, 0, 0, 1, 0, 0);
          }

          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => resolve(blob))
        });
      }

      img.src = urlCreator.createObjectURL(imageBlob);
    });
  }
}
