import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AlertController } from 'ionic-angular';
import * as _ from 'underscore';
import { Contacts } from '@ionic-native/contacts';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { RelationshipManagerComponent } from '../relationshipManager/relationshipManagerComponent';

@Component({
    selector: 'app-voice-assistant',
    templateUrl: 'voice.assistant.component.html'
})
export class VoiceAssistantComponent {
    contact: any;
    name = 'Hi, I will help schedule calls for you. Tell me the contact name.';
    date = 'On what date would you like to call?';
    time = 'What time do you prefer?'
    callDetailsObj = {};
    yesVariants = ['yes', 'yeah', 'correct', 'right', 'that\'s right', 'yup', 'yep'];
    noVariants = ['no', 'nope', 'incorrect'];
    scheduleDate: string;
    scheduleTime: string;
    scheduleText: string;
    constructor(
        public navCtrl: NavController,
        private ref: ChangeDetectorRef,
        private navParams: NavParams,
        private tts: TextToSpeech,
        private contacts: Contacts,
        private alertCtrl: AlertController,
        private speechRecognition: SpeechRecognition,
        private localNotifications: LocalNotifications
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

    searchResult: any;
    isTruncated: boolean;

    checkContactAvailablity(str) {
        this.contacts.find(['displayName'], { 'filter': str }).then((res) => {
            this.searchResult = this.processSearchResult(res);
            if (this.searchResult.length > 0) {
                this.contact = this.searchResult[0];
                //set Name & number to notification obj
                // if count > 1, i have x contacts, which one would u like to call
                this.initiate(this.date);
            } else {
                this.startVoiceAssistant();
            }
            this.ref.detectChanges();
        }, (err) => {
            console.log(err);
        })
    }

    checkDate(date: any) {
        //23rd may; 21st may, 23rd of may, may 22nd, 22nd, 23rd, 21st
        if (date === 'today') {
            this.scheduleDate = this.dateHelper(new Date());
        } else if (date === 'tomorrow') {
            this.scheduleDate = this.dateHelper(new Date(), 'tomorrow')
        }
        //set date to notification obj
    }

    checkTime(time: any) {
        // 10 P.M, 10:30 P.M, 10 tonight, night, evening, morning
        let x = time.toLowerCase().indexOf('p');
        let y = time.toLowerCase().indexOf('a');
        /*         let p = time.toLowerCase().indexOf('morning');
                let q = time.toLowerCase().indexOf('night');
                let r = time.toLowerCase().indexOf('morning'); */
        if (x > -1) {
            let eveTime = time.substring(0, x);
            const eveTimeLen = eveTime.split(':').length;
            if (eveTimeLen > 1) {
                this.scheduleTime = '' + (Number(eveTime.split(':')[0]) + 12) + ':' + eveTime.split(':')[1];
            }
            // const val = Number(time.substring(0, x));
            else if (eveTime === '12') {
                this.scheduleTime = '' + eveTime;
            } else {
                this.scheduleTime = '' + (eveTime + 12);
            }
        } else if (y > -1) {
            this.scheduleTime = time.substring(0, y);
        }
        /* else if (p > -1) {
            this.scheduleTime = time.substring(0, p);
        } else if (q > -1) {
            this.scheduleTime = time.substring(0, q);
        } else if (r > -1) {
            this.scheduleTime = time.substring(0, r);
        } */
        //set time to notification obj
        this.scheduleTime = this.scheduleTime.trim();
    }

    processSearchResult(contacts: Array<any>) {
        let processedContacts = [];
        this.isTruncated = false;
        if (contacts.length > 10) {
            this.isTruncated = true;
            contacts.splice(10, contacts.length - 1);
        }
        contacts.forEach((item, index) => {
            let contact = {
                name: <string>null,
                hasMultiple: <boolean>null,
                phoneNumber: <any>null
            };
            contact.name = item.displayName;
            contact.phoneNumber = [];
            if (item.phoneNumbers.length > 1) {
                contact.hasMultiple = true;
                item.phoneNumbers.forEach((num, index) => {
                    if (contact.phoneNumber.indexOf(num.value) === -1) {
                        contact.phoneNumber.push(num.value.replace(/\s/g, ''));
                    }
                });
            } else {
                contact.phoneNumber.push(item.phoneNumbers[0].value);
            }
            processedContacts.push(contact);
        });
        return processedContacts;
    }

    leapYear(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    dateHelper(date: any, str?: string) {
        const val = new Date(date);
        const time = val.toTimeString().substring(0, 5);
        const month = val.getMonth() + 1;
        let _year = val.getFullYear();
        const isLeap = this.leapYear(Number(_year));
        let _month = month < 9 ? '0' + month : month;
        let _date = val.getDate() < 9 ? '0' + val.getDate() : val.getDate();
        if (str === 'tomorrow') {
            if (_month === '01' || _month === '03' || _month === '05' || _month === '07' || _month === '08' || _month === '10' || _month === '12') {
                if (_date === '31') {
                    _month = '' + (Number(_month) + 1);
                    _date = '01';
                } else {
                    _date = Number(_date) + 1;
                }
            } else if (_month === '04' || _month === '06' || _month === '09' || _month === '11') {
                if (_date === '30') {
                    _month = '' + (Number(_month) + 1);
                    _date = '01';
                } else {
                    _date = Number(_date) + 1;
                }
            } else if ((_date === '28' && _month === '02' && !isLeap) || (_date === '29' && _month === '02')) {
                _month = '' + (Number(_month) + 1);
                _date = '01';
            } else {
                _date = Number(_date) + 1;
            }
            if (_month === '12' && _date === '31') {
                _date = '01';
                _month = '01';
                _year = Number(_year) + 1;
            }
        }
        return '' + _year + '-' + _month + '-' + _date;
        // + 'T' + time + ':00Z';
    }

    generateID() {
        return (Date.now() + Math.ceil(Math.random() * 1000));
    }

    setNotification() {
        let consolidatedDate = this.scheduleDate + 'T' + this.scheduleTime + ':00Z';
        const date = new Date(consolidatedDate.replace(/[TZ]/g, ' '));
        if (date) {
            const notificationObj = {
                id: this.generateID(),
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
                        if (_.contains(this.yesVariants, ans[0])) {
                            if (str.indexOf('name') > -1) {
                                this.callDetailsObj['name'] = matches[0];
                                this.checkContactAvailablity(this.callDetailsObj['name']);
                            }
                            if (str.indexOf('date') > -1) {
                                this.callDetailsObj['date'] = matches[0];
                                this.initiate(this.time);
                                this.checkDate(matches[0]);
                            }
                            if (str.indexOf('time') > -1) {
                                this.callDetailsObj['time'] = matches[0];
                                this.checkTime(matches[0]);
                                this.setNotification();
                            }
                        } else if (_.contains(this.noVariants, ans[0])) {
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
            console.log(this.callDetailsObj)
        });
    }

    startVoiceAssistant() {
        this.initiate(this.name);
    }

    processData(str) {

    }
}
