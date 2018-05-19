import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { LocationComponent } from '../pages/bgLocation/bgLocationComponent';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geofence } from '@ionic-native/geofence';
import { RelationshipManagerComponent } from '../pages/relationshipManager/relationshipManagerComponent';
import { Contacts } from '@ionic-native/contacts';
import { SchedulerComponent } from '../pages/scheduler/schedulerComponent';
import { FilePath } from '@ionic-native/file-path';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CallNumber } from '@ionic-native/call-number';
import { Toast } from '@ionic-native/toast';
import { ScheduleListComponent } from '../pages/scheduleList/scheduleList.component';
import { SMS } from '@ionic-native/sms';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { LocationManagerComponent } from '../pages/locationManager/location.manager.component';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    ContactPage,
    LocationComponent,
    SchedulerComponent,
    RelationshipManagerComponent,
    ScheduleListComponent,
    LocationManagerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    ContactPage,
    LocationComponent,
    SchedulerComponent,
    RelationshipManagerComponent,
    ScheduleListComponent,
    LocationManagerComponent
  ],
  providers: [
    SMS,
    Toast,
    FilePath,
    Geofence,
    Contacts,
    StatusBar,
    CallNumber,
    SplashScreen,
    NativeGeocoder,
    LocalNotifications,
    BackgroundGeolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
