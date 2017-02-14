import { Injectable } from '@angular/core';
import { Coordinates } from 'ionic-native';
import * as localforage from "localforage";
import { attempt } from 'lodash';

const PHOTO_COLLECTION = 'photos';

export interface PhotoRecord {
  data: string;
  coordinates: Coordinates
}

@Injectable()
export class PhotoStorage {
  constructor() {}

  getPhotos(): Promise<PhotoRecord[]> {
    return localforage.getItem(PHOTO_COLLECTION).then(photoList => {
      if (photoList) {
        const parsedPhotoList = attempt(() => JSON.parse(photoList as string)) as PhotoRecord[];
        if (parsedPhotoList) {
          return parsedPhotoList;
        }
      }
      return [];
    });
  }

  addPhoto(photoData: string, coordinates: Coordinates) {
    return this.getPhotos().then(photoList => {
      photoList.push({ data: photoData, coordinates });
      return localforage.setItem(PHOTO_COLLECTION, JSON.stringify(photoList));
    });
  }

  deletePhoto(index: number) {
    return this.getPhotos().then(photoList => {
      if (photoList && photoList.length) {
        photoList.splice(index, 1);
        return localforage.setItem(PHOTO_COLLECTION, JSON.stringify(photoList));
      }
      return null;
    });
  }
}
