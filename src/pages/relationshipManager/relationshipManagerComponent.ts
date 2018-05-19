import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SchedulerComponent } from '../scheduler/schedulerComponent';
import { ScheduleListComponent } from '../scheduleList/scheduleList.component';

@Component({
    selector: 'app-relationship-manager',
    templateUrl: 'relationshipManagerComponent.html'
})
export class RelationshipManagerComponent {
    contactName: string;
    searchResult: any;
    isTruncated: boolean;
    constructor(
        public navCtrl: NavController,
        private contacts: Contacts,
        private ref: ChangeDetectorRef
    ) {

    }
    searchContact() {
        this.contactName = this.contactName || 'Amma';
        if (this.contactName) {
            this.contacts.find(['displayName'], { 'filter': this.contactName }).then((res) => {
                this.searchResult = this.processSearchResult(res);
                this.ref.detectChanges();
            }, (err) => {
                console.log(err);
            })
        }
    }


    goToList() {
        this.navCtrl.push(ScheduleListComponent);
    }

    selectNumber(phone: string, name: string) {
        this.navCtrl.push(SchedulerComponent, {
            name: name,
            phone: phone
        });
    }

    processSearchResult(contacts: Array<any>) {
        let processedContacts = [];
        this.isTruncated = false;
        if (contacts.length > 5) {
            this.isTruncated = true;
            contacts.splice(5, contacts.length - 1);
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

}
