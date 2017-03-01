import { Component } from '@angular/core';
import {
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 GoogleMapsMarkerOptions
} from 'ionic-native';
import { PhotoStorage } from './../../services/storage';

@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html'
})
export class MapsPage {
  private map: GoogleMap = null;

  constructor(private photoStorage: PhotoStorage) {}

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const element: HTMLElement = document.getElementById('map');
    if (!this.map) {
      this.map = new GoogleMap(element);
      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        this.loadImagePlaces(this.map);
      });
    }
  }

  loadImagePlaces(map: GoogleMap) {
    this.photoStorage.getPhotos().then(photos => {
      photos.forEach(photo => {
        const coords = photo.coords as Coordinates;
        if (coords) {
          if (coords.latitude && coords.longitude) {
            this.createMarker(coords, map);
          }
        }
      });
    });
  }

  createMarker(coords: Coordinates, map: GoogleMap) {
    let place: GoogleMapsLatLng = new GoogleMapsLatLng(coords.latitude, coords.longitude);

    let markerOptions: GoogleMapsMarkerOptions = {
      position: place,
      title: 'Picture'
    };

    map.addMarker(markerOptions);
  }

  ionViewWillLeave() {
    this.clearMap(this.map);
  }

  clearMap(map) {
    map.clear();
  }

  ngOnDestroy() {
    this.map.remove();
    this.map = null;
  }
}
