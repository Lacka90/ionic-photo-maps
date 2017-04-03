import { Injectable } from '@angular/core';
import { Coordinates } from 'ionic-native';
import firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

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
  private storageRef: firebase.storage.Reference = null;
  public photos: FirebaseListObservable<PhotoRecord[]> = null;

  constructor(private af: AngularFire) {}

  initDbByUser(owner) {
    if (owner) {
      this.storageRef = firebase.storage().ref();
      this.photos = this.af.database.list(`/items/${owner}`);
    }
  }

  uploadPicture(image, coords: Coordinates = DEFAULT_COORDS, filename: string, metadata = {}) {
    return this.storageRef.child('photos/' + filename).put(image, metadata).then((snapshot) => {
      const url = snapshot.downloadURL;
      return this.addPhoto('photos/' + filename, url, coords);
    });
  }

  addPhoto(filename: string, data: string, coordinates: Coordinates) {
    const coords = this.coordsToJSON(coordinates);
    return this.photos.push({
      filename,
      data,
      coords,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
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
    this.photos.remove(photo.$key);
    this.storageRef.child(photo.filename).delete();
  }
}
