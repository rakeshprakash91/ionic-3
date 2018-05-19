import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SchedulerComponent } from '../scheduler/schedulerComponent';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CallNumber } from '@ionic-native/call-number';
import { Toast } from '@ionic-native/toast';
import { AlertController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';

@Component({
    selector: 'app-schedule-list',
    templateUrl: 'scheduleList.component.html'
})
export class ScheduleListComponent implements OnInit {
    scheduleList: any;
    constructor(
        public navCtrl: NavController,
        private ref: ChangeDetectorRef,
        private localNotification: LocalNotifications,
        private callNumber: CallNumber,
        private toast: Toast,
        private alertCtrl: AlertController,
        private sms: SMS
    ) { }

    smsConfirm(num: number) {
        let prompt = this.alertCtrl.create({
            title: 'Send SMS',
            message: "Enter message to be sent below",
            inputs: [
                {
                    name: 'sms',
                    placeholder: 'SMS'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Send',
                    handler: data => {
                        this.sms.send('' + num, data.sms);
                    }
                }
            ]
        });
        prompt.present();
    }

    delete(id: number) {
        this.localNotification.cancel(id).then(res => {
            this.toast.show('Reminder deleted successfully', '5000', 'center').subscribe(res => {
                console.log('success');
            });
            this.getAllCalls();
        });
    }

    call(num: number, id: number) {
        this.callNumber.callNumber('' + num, true).then(res => {
            this.localNotification.cancel(id).then(res => {
                this.getAllCalls();
                this.smsConfirm(num);
            });
        });
    }

    edit(id: number) {
        this.navCtrl.push(SchedulerComponent, {
            id: id
        })
    }

    processResult(res: any): any {
        res.forEach(item => {
            const date = new Date(item.trigger.at);
            item.data = JSON.parse(item.data);
            item.trigger.at = date.toDateString() + ' ' + date.toTimeString().substring(0, 5);
        });
        return res;
    }

    ngOnInit() {
        this.getAllCalls();
    }

    getAllCalls() {
        this.localNotification.getAll().then((res) => {
            this.scheduleList = this.processResult(res);
            this.ref.detectChanges();
            console.log(this.scheduleList);
        }).catch((err) => {
            console.error(err);
        })
    }
}
