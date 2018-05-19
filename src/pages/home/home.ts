import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RelationshipManagerComponent } from '../relationshipManager/relationshipManagerComponent';
import { LocationManagerComponent } from '../locationManager/location.manager.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  banList: string;
  constructor(
    public navCtrl: NavController,
    private http: HttpClient
  ) {

  }

  navigateToLocationManager() {
    this.navCtrl.push(LocationManagerComponent);
  }

  navigateToRelationshipManager() {
    this.navCtrl.push(RelationshipManagerComponent);
  }

  downloadBanList() {
    this.http.get('https://www.nseindia.com/content/fo/fo_secban.csv').subscribe((res) => {
      console.log(res);
    }, (err) => {
      console.log(err);
      this.banList = err.error.text.replace(/\n*,/g, '.')
    }, () => {
      console.log('the banlist is : ', this.banList)
    });
  }

}
