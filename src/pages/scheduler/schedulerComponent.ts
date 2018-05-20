import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FilePath } from '@ionic-native/file-path';
import { CallNumber } from '@ionic-native/call-number';
import { Toast } from '@ionic-native/toast';

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
        private toast: Toast
    ) {
        this.retrieveFilePath();
        this.id = this.navParams.get('id');
        if (!this.id) {
            this.isEdit = false;
            this.name = this.navParams.get('name');
            this.phone = this.navParams.get('phone');
            this.alertDate = this.dateHelper(new Date());
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
        this.alertDate = this.dateHelper(data.trigger.at);
    }

    dateHelper(date: any) {
        const val = new Date(date);
        const time = val.toTimeString().substring(0, 5);
        const month = val.getMonth() + 1;
        const _month = month < 9 ? '0' + month : month;
        const _date = val.getDate() < 9 ? '0' + val.getDate() : val.getDate();
        const _year = val.getFullYear();
        return '' + _year + '-' + _month + '-' + _date + 'T' + time + ':00Z';
    }

    retrieveFilePath(path?: string) {
        const str = path || 'file:///storage/emulated/0/detective.mp3';
        this.filePath.resolveNativePath(str)
            .then(result => {
                console.log(result);
            }, error => {
                console.log(error);
            });
    }

    generateID() {
        return (Date.now() + Math.ceil(Math.random() * 1000));
    }

    scheduleNotification(text: string, date: Date, actualTxt: string) {
        const notificationObj = {
            id: this.id ? this.id : this.generateID(),
            text: text,
            sound: 'file:///storage/emulated/0/detective.mp3',
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
        let successMsg;
        if (this.id) {
            successMsg = 'Reminder updated successfully!';
        } else {
            successMsg = 'Reminder scheduled successfully!';
        }
        this.scheduleNotification(notificationTxt, selectedDate, this.notificationText);

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
