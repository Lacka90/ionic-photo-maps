import { Injectable } from '@angular/core';
import { Coordinates } from 'ionic-native';
import * as localforage from "localforage";
import { attempt } from 'lodash';

const PHOTO_COLLECTION = 'photos';

export interface PhotoRecord {
  data: string;
  coords: Coordinates;
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
      const coords = this.coordsToJSON(coordinates);
      photoList.push({ data: photoData, coords });
      return localforage.setItem(PHOTO_COLLECTION, JSON.stringify(photoList));
    });
  }

  coordsToJSON(coordinates: Coordinates) : Coordinates {
    return {
      accuracy: coordinates.accuracy,
      altitude: coordinates.altitude,
      altitudeAccuracy: coordinates.altitudeAccuracy,
      heading: coordinates.heading,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      speed: coordinates.speed,
    };
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
