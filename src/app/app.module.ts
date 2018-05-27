import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geofence } from '@ionic-native/geofence';
import { Contacts } from '@ionic-native/contacts';
import { FilePath } from '@ionic-native/file-path';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CallNumber } from '@ionic-native/call-number';
import { Toast } from '@ionic-native/toast';
import { SMS } from '@ionic-native/sms';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { VoiceAssistantComponent } from '../pages/voiceAssistant/voice.assistant.compoenent';
import { Helpers } from '../pages/Helpers';
import { Constants } from '../pages/constants';
import { SchedulerComponent } from '../pages/calls/scheduler/schedulerComponent';
import { RelationshipManagerComponent } from '../pages/calls/relationshipManager/relationshipManagerComponent';
import { SearchContactComponent } from '../pages/calls/searchContact/search.contact.component';
import { LocationManagerComponent } from '../pages/location/locationManager/location.manager.component';
import { LocationComponent } from '../pages/location/bgLocation/bgLocationComponent';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    LocationComponent,
    SchedulerComponent,
    RelationshipManagerComponent,
    LocationManagerComponent,
    SearchContactComponent,
    VoiceAssistantComponent
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
    LocationComponent,
    SchedulerComponent,
    RelationshipManagerComponent,
    LocationManagerComponent,
    SearchContactComponent,
    VoiceAssistantComponent
  ],
  providers: [
    SMS,
    Toast,
    FilePath,
    Geofence,
    Contacts,
    StatusBar,
    CallNumber,
    TextToSpeech,
    SplashScreen,
    NativeGeocoder,
    SpeechRecognition,
    LocalNotifications,
    BackgroundGeolocation,
    Helpers,
    Constants,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
