import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AlertController } from 'ionic-angular';
import * as _ from 'underscore';
import { Contacts } from '@ionic-native/contacts';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { RelationshipManagerComponent } from '../relationshipManager/relationshipManagerComponent';
import { Helpers } from '../Helpers';
import { Constants } from '../constants';

@Component({
    selector: 'app-voice-assistant',
    templateUrl: 'voice.assistant.component.html'
})
export class VoiceAssistantComponent {
    constructor(
        public navCtrl: NavController,
        private ref: ChangeDetectorRef,
        private navParams: NavParams,
        private tts: TextToSpeech,
        private contacts: Contacts,
        private alertCtrl: AlertController,
        private speechRecognition: SpeechRecognition,
        private localNotifications: LocalNotifications,
        private helpers: Helpers,
        private constants: Constants
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
    contact: any;
    callDetailsObj = {};
    scheduleDate: string;
    scheduleTime: string;
    scheduleText: string;
    searchResult: any;
    isTruncated: boolean;

    checkContactAvailablity(str) {
        this.contacts.find(['displayName'], { 'filter': str }).then((res) => {
            const results = this.helpers.processContactSearchResult(res);
            this.searchResult = results.processedContacts;
            this.isTruncated = results.isTruncated;
            if (this.searchResult.length > 0) {
                this.contact = this.searchResult[0];
                //set Name & number to notification obj
                // if count > 1, i have x contacts, which one would u like to call
                this.initiate(this.constants.date);
            } else {
                this.initiate(this.constants.name);
            }
            this.ref.detectChanges();
        }, (err) => {
            console.log(err);
        })
    }

    checkDate(date: any) {
        //23rd may; 21st may, 23rd of may, may 22nd, 22nd, 23rd, 21st
        if (date === 'today') {
            this.scheduleDate = this.helpers.speechAssistDateConverter(new Date());
        } else if (date === 'tomorrow') {
            this.scheduleDate = this.helpers.speechAssistDateConverter(new Date(), 'tomorrow')
        }
        //set date to notification obj
    }

    setNotification() {
        let consolidatedDate = this.scheduleDate + 'T' + this.scheduleTime + ':00Z';
        const date = new Date(consolidatedDate.replace(/[TZ]/g, ' '));
        if (date) {
            const notificationObj = {
                id: this.helpers.generateID(),
                text: 'Call ' + this.callDetailsObj['name'],
                data: { number: this.contact['phoneNumber'][0], name: this.callDetailsObj['name'], actualTxt: '' },
                trigger: { at: date },
                vibrate: true,
                lockscreen: true,
                priority: 2
            };
            this.localNotifications.schedule(notificationObj);
            this.tts.speak('Reminder for ' + this.callDetailsObj['name'] + ' added successfully.').then(() => {
                this.navCtrl.push(RelationshipManagerComponent);
            })
        }
    }

    startListening(str?: string) {
        this.speechRecognition.startListening().subscribe(
            (matches: Array<string>) => {
                this.tts.speak(matches[0] + '. Is that right?').then(res => {
                    this.speechRecognition.startListening().subscribe(ans => {
                        if (_.contains(this.constants.yesVariants, ans[0])) {
                            if (str.indexOf('name') > -1) {
                                this.callDetailsObj['name'] = matches[0];
                                this.checkContactAvailablity(this.callDetailsObj['name']);
                            }
                            if (str.indexOf('date') > -1) {
                                this.callDetailsObj['date'] = matches[0];
                                this.initiate(this.constants.time);
                                this.checkDate(matches[0]);
                            }
                            if (str.indexOf('time') > -1) {
                                this.callDetailsObj['time'] = matches[0];
                                this.scheduleTime = this.helpers.speechAssistTimeConverter(matches[0]);
                                this.setNotification();
                            }
                        } else if (_.contains(this.constants.noVariants, ans[0])) {
                            this.initiate(str);
                        }
                    })
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
        });
    }

    startVoiceAssistant() {
        this.tts.speak(this.constants.welcomeTxt).then((res) => {
            this.initiate(this.constants.name);
        });
    }
}
