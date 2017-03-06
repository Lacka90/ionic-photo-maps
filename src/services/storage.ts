import { Injectable } from '@angular/core';
import { Coordinates } from 'ionic-native';
import firebase from 'firebase';

const DEFAULT_COORDS = {
  latitude: null,
  longitude: null,
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null
};

export interface PhotoRecord {
  $key?: string;
  filename?: string;
  data: string;
  coords: Coordinates;
  createdAt?: Object | Date | string;
  ordering: number;
}

@Injectable()
export class PhotoStorage {
  public photoRef: firebase.database.Reference = null;
  private storageRef: firebase.storage.Reference = null;
  private photos: PhotoRecord[] = [];

  constructor() {
    this.photoRef = firebase.database().ref('/items')
    this.photoRef.orderByChild('ordering').on('value', (snapshot: any) => {
      const items = snapshot.val();
      if (items) {
        const keys = Object.keys(items);
        this.photos = keys.map((key) => {
          return Object.assign({}, items[key], { $key: key });
        });
      }
    })
    this.storageRef = firebase.storage().ref()
  }

  uploadPicture(image, coords: Coordinates = DEFAULT_COORDS, filename, metadata = {}) {
    return this.storageRef.child('photos/' + filename).put(image, metadata).then((snapshot) => {
      const url = snapshot.downloadURL;
      return this.addPhoto('photos/' + filename, url, coords);
    });
  }

  addPhoto(filename: string, data: string, coordinates: Coordinates) {
    const coords = this.coordsToJSON(coordinates);
    return this.photoRef.once('value', (snapshot: any) => {
      const newPostRef = this.photoRef.push();
      return newPostRef.set({
        filename,
        data,
        coords,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        ordering: Number.MAX_SAFE_INTEGER - Object.keys(snapshot.val()).length,
      });
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

  deletePhoto(photo: PhotoRecord) {
    this.photoRef.child(photo.$key).remove();
    this.storageRef.child(photo.filename).delete();
  }
}
