import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { TabsPage } from '../pages/tabs/tabs';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private localNotifications: LocalNotifications, private callNumber: CallNumber, private tts: TextToSpeech) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.localNotifications.on('trigger').subscribe((res) => {
        setTimeout(() => {
          this.tts.speak(res.text).then(res => {
            console.log('success');
          });
        }, 500);
      });
      this.localNotifications.on('click').subscribe((res) => {
        this.callNumber.callNumber(res.data.number, true)
          .then(data => {
            console.log(res, 'call back data');
            this.localNotifications.cancel(res.id);
          })
          .catch(err => console.log('Error launching dialer', err));
      });
    });
  }
}
