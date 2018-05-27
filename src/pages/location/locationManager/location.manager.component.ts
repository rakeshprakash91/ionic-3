import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
    selector: 'app-location-manager',
    templateUrl: 'location.manager.component.html'
})
export class LocationManagerComponent {
    constructor(
        public navCtrl: NavController,
        private ref: ChangeDetectorRef
    ) { }
}
