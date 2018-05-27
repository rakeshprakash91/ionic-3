import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geofence } from '@ionic-native/geofence';
import {
    NativeGeocoder,
    NativeGeocoderReverseResult
} from '@ionic-native/native-geocoder';
import {
    BackgroundGeolocation,
    BackgroundGeolocationConfig,
    BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation';

@Component({
    selector: 'app-location-component',
    templateUrl: 'bgLocationComponent.html'
})
export class LocationComponent {
    location: any;
    currentPosition: any;
    constructor(
        public navCtrl: NavController,
        private backgroundGeolocation: BackgroundGeolocation,
        private geoFence: Geofence,
        private ref: ChangeDetectorRef,
        private nativeGeocoder: NativeGeocoder
    ) {
    }

    startLocationTracking() {
        const config: BackgroundGeolocationConfig = {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: false,
            stopOnTerminate: true
        };
        this.backgroundGeolocation.configure(config).subscribe((position: BackgroundGeolocationResponse) => {
            this.currentPosition = position;
            this.nativeGeocoder.reverseGeocode(position.latitude, position.longitude)
                .then((result: NativeGeocoderReverseResult) => {
                    const loc = result[0];
                    this.location = 'You are at ' + loc.thoroughfare + ', ' +
                        loc.locality + ', ' + loc.subAdministrativeArea + ', ' + loc.administrativeArea;
                    this.ref.detectChanges();
                }).catch((error: any) => {
                    console.log(error)
                });
            this.initializeGeoFence();
        }, (error) => {
            console.log('location tracking: ', error);
        });
        this.backgroundGeolocation.start();
    }

    initializeGeoFence(): any {
        this.geoFence.initialize().then(
            // resolved promise does not return a value
            () => {
                console.log('Geofence Plugin Ready');
                this.addGeofence();
            },
            (err) => console.log(err)
        )
    }

    private addGeofence() {
        //options describing geofence
        let fence = {
            id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
            latitude: this.currentPosition.latitude, //center of geofence radius
            longitude: this.currentPosition.longitude,
            radius: 10, //radius to edge of geofence in meters
            transitionType: 3, //see 'Transition Types' below
            notification: { //notification settings
                id: 1, //any unique ID
                title: 'You crossed a fence', //notification title
                text: 'You just arrived to Narnia.', //notification body
                openAppOnClick: true //open app when notification is tapped
            }
        }

        this.geoFence.addOrUpdate(fence).then(
            () => console.log('Geofence added'),
            (err) => console.log('Geofence failed to add')
        );
    }

    stopGeoTracking() {
        this.backgroundGeolocation.stop();
    }
}
