import { Component } from '@angular/core';
import {
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 GoogleMapsMarkerOptions
} from 'ionic-native';
import { PhotoStorage, PhotoRecord } from './../../services/storage';

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
        this.loadImagePlaces(this.map)
          .then(coords => {
            const filtered = coords.filter(coord => coord);
            const bounds = filtered.map((coord: Coordinates) => {
              return new GoogleMapsLatLng(coord.latitude, coord.longitude);
            });

            this.map.moveCamera({
              target: bounds,
            });
          });
      });
    }
  }

  loadImagePlaces(map: GoogleMap): Promise<Coordinates[]> {
    return new Promise((resolve) => {
      this.photoStorage.photos.subscribe((items: PhotoRecord[]) => {
        resolve(
          items.map((photo: PhotoRecord) => {
            const coords = photo.coords as Coordinates;
            if (coords) {
              if (coords.latitude && coords.longitude) {
                this.createMarker(coords, photo.data, map);
              }
              return coords;
            }
          })
        );
      });
    });
  }

  createMarker(coords: Coordinates, data: string, map: GoogleMap) {
    const place: GoogleMapsLatLng = new GoogleMapsLatLng(coords.latitude, coords.longitude);

    const img = new Image();
    img.onload = () => this.createMarkerWithImage(img, place, map);
    img.src = data;
  }

  createMarkerWithImage(img: HTMLImageElement, place: GoogleMapsLatLng, map: GoogleMap) {
    const canvas = this.createCanvas(img, window);

    let markerOptions: GoogleMapsMarkerOptions = {
      position: place,
      title: canvas.toDataURL(),
    };

    map.addMarker(markerOptions);
  }

  createCanvas(img: HTMLImageElement, window: Window) {
    const ratio = this.getRatio(img, window);
    const width = img.width * ratio;
    const height = img.height * ratio;

    return this.drawImageToCanvas(width, height, img);
  }

  getRatio(img: HTMLImageElement, window: Window) {
    let ratio = 1;
    if (img.width > img.height) {
      ratio = (window.innerWidth / img.width) * 0.8;
    } else {
      ratio = (window.innerWidth / img.height) * 0.8;
    }
    return ratio;
  }

  drawImageToCanvas(width: number, height: number, img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, width, height);
    return canvas;
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
