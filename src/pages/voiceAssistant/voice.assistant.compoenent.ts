import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'app-voice-assistant',
    templateUrl: 'voice.assistant.component.html'
})
export class VoiceAssistantComponent {
    name = 'Hi, I will help schedule calls for you. Tell me the contact name.';
    date = 'On what date would you like to call?';
    time = 'What time do you prefer?'
    callDetailsObj = {};
    constructor(
        public navCtrl: NavController,
        private ref: ChangeDetectorRef,
        private navParams: NavParams,
        private tts: TextToSpeech,
        private alertCtrl: AlertController,
        private speechRecognition: SpeechRecognition
    ) {
        this.speechRecognition.hasPermission()
            .then((hasPermission: boolean) => {
                if (!hasPermission) {
                    this.speechRecognition.requestPermission()
                        .then(
                            () => console.log('Granted'),
                            () => console.log('Denied')
                        )
                }
            });
    }

    startListening(str?: string) {
        this.speechRecognition.startListening().subscribe(
            (matches: Array<string>) => {
                this.tts.speak(matches[0] + '. Is that right?').then(res => {
                    let alert = this.alertCtrl.create({
                        title: 'Confirm',
                        message: matches[0] + '. Proceed?',
                        buttons: [
                            {
                                text: 'No',
                                role: 'cancel',
                                handler: () => {
                                    this.initiate(str);
                                }
                            },
                            {
                                text: 'Yes',
                                handler: () => {
                                    if (str.indexOf('name') > -1) {
                                        this.callDetailsObj['name'] = matches[0];
                                        this.initiate(this.date);
                                    }
                                    if (str.indexOf('date') > -1) {
                                        this.callDetailsObj['date'] = matches[0];
                                        this.initiate(this.time)
                                    }
                                    if (str.indexOf('time') > -1) {
                                        this.callDetailsObj['time'] = matches[0];
                                    }
                                }
                            }
                        ]
                    });
                    alert.present();
                })
            },
            (onerror) => {
                console.log('error:', onerror)
            }
        )
    }

    initiate(str: string): any {
        this.tts.speak(str).then(res => {
            this.startListening(str);
            console.log(this.callDetailsObj)
        });
    }

    startVoiceAssistant() {
        this.initiate(this.name);
    }

    processData(str) {

    }
}
