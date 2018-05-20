import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SchedulerComponent } from '../scheduler/schedulerComponent';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CallNumber } from '@ionic-native/call-number';
import { Toast } from '@ionic-native/toast';
import { AlertController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import { SearchContactComponent } from '../searchContact/search.contact.component';

@Component({
    selector: 'app-relationship-manager',
    templateUrl: 'relationshipManagerComponent.html'
})
export class RelationshipManagerComponent {
    scheduleList = [];
    constructor(
        public navCtrl: NavController,
        private ref: ChangeDetectorRef,
        private localNotification: LocalNotifications,
        private callNumber: CallNumber,
        private toast: Toast,
        private alertCtrl: AlertController,
        private sms: SMS
    ) { }

    goToScheduler() {
        this.navCtrl.push(SearchContactComponent);
    }

    smsConfirm(num: number) {
        let prompt = this.alertCtrl.create({
            title: 'Send SMS to ' + num,
            message: "Enter message below",
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
            this.toast.show('Reminder deleted successfully', '2000', 'center').subscribe(res => {
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

    ionViewWillEnter() {
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
