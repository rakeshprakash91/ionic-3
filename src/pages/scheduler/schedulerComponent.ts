import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FilePath } from '@ionic-native/file-path';
import { CallNumber } from '@ionic-native/call-number';
import { Toast } from '@ionic-native/toast';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Constants } from '../constants';
import { Helpers } from '../Helpers';

@Component({
    selector: 'app-scheduler',
    templateUrl: 'schedulerComponent.html'
})
export class SchedulerComponent {
    frequency: any;
    notificationText: string;
    name: string;
    phone: string;
    id: number;
    alertDate: any;
    isEdit: boolean;
    constructor(
        public navCtrl: NavController,
        private ref: ChangeDetectorRef,
        private localNotifications: LocalNotifications,
        private filePath: FilePath,
        private navParams: NavParams,
        private callNumber: CallNumber,
        private toast: Toast,
        private tts: TextToSpeech,
        private constants: Constants,
        private helpers: Helpers
    ) {
        // this.retrieveFilePath();
        this.id = this.navParams.get('id');
        if (!this.id) {
            this.isEdit = false;
            this.name = this.navParams.get('name');
            this.phone = this.navParams.get('phone');
            this.alertDate = this.helpers.isoConverter(new Date());
        } else {
            this.isEdit = true;
            this.localNotifications.get(this.id).then(obj => {
                this.setEditData(obj);
            }).catch(err => {
                console.log(err);
            })
        }
    }

    setEditData(data: any) {
        let details = JSON.parse(data.data);
        this.name = details.name;
        this.phone = details.number;
        this.notificationText = details.actualTxt;
        this.alertDate = this.helpers.isoConverter(data.trigger.at);
    }

    /* retrieveFilePath(path?: string) {
        const str = path || 'file:///storage/emulated/0/detective.mp3';
        this.filePath.resolveNativePath(str)
            .then(result => {
                console.log(result);
            }, error => {
                console.log(error);
            });
    } */

    scheduleNotification(text: string, date: Date, actualTxt: string) {
        const notificationObj = {
            id: this.id ? this.id : this.helpers.generateID(),
            text: text,
            data: { number: this.phone, name: this.name, actualTxt: actualTxt },
            trigger: { at: date },
            vibrate: true,
            lockscreen: true,
            priority: 2
        };
        if (this.id) {
            this.localNotifications.cancel(this.id).then(res => {
                this.localNotifications.schedule(notificationObj);
            });
        } else {
            this.localNotifications.schedule(notificationObj);
        }
    }

    setReminder() {
        const notificationTxt = this.notificationText ? 'Call ' + this.name + ': ' + this.notificationText : 'Call ' + this.name;
        const selectedDate = new Date(this.alertDate.replace(/[TZ]/g, ' '));
        let speechTxt = '';
        let successMsg;
        if (this.id) {
            successMsg = this.constants.reminderUpdateSuccess;
            speechTxt = 'Reminder for calling' + this.name + 'updated successfully.';
        } else {
            successMsg = this.constants.reminderSuccess;
            speechTxt = 'Reminder set to call ' + this.name;
        }
        this.scheduleNotification(notificationTxt, selectedDate, this.notificationText);
        this.tts.speak(speechTxt)
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
        // Non intrusive alert.
        this.toast.show(successMsg, '3000', 'center').subscribe(toast => {
            setTimeout(() => {
                this.navCtrl.popTo(this.navCtrl.getByIndex(1));
            }, 3000);
        }, err => {
            console.log(err);
        });
    }
}
