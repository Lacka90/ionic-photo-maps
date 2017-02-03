import * as localforage from "localforage";
import * as _ from 'lodash';

const PHOTO_COLLECTION = 'photos';

export class PhotoStorage {
  constructor() {}

  getPhotos(): Promise<string[]> {
    return localforage.getItem(PHOTO_COLLECTION).then(photoList => {
      if (photoList) {
        const parsedPhotoList = _.attempt(() => JSON.parse(photoList as string)) as string[];
        if (parsedPhotoList) {
          return parsedPhotoList;
        }
      }
      return [];
    });
  }

  addPhoto(photoData) {
    return this.getPhotos().then(photoList => {
      (photoList as string[]).push(photoData);
      return localforage.setItem(PHOTO_COLLECTION, JSON.stringify(photoList));
    });
  }

  deletePhoto(index) {
    return this.getPhotos().then(photoList => {
      if (photoList) {
        (photoList as string[]).splice(index, 1);
      }
      return localforage.setItem(PHOTO_COLLECTION, JSON.stringify(photoList));
    });
  }
}
