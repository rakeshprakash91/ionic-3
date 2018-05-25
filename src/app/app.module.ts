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
import { SMS } from '@ionic-native/sms';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { LocationManagerComponent } from '../pages/locationManager/location.manager.component';
import { SearchContactComponent } from '../pages/searchContact/search.contact.component';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { VoiceAssistantComponent } from '../pages/voiceAssistant/voice.assistant.compoenent';
import { Helpers } from '../pages/Helpers';
import { Constants } from '../pages/constants';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    ContactPage,
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
    ContactPage,
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
