import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SchedulerComponent } from '../scheduler/schedulerComponent';
import { ScheduleListComponent } from '../scheduleList/scheduleList.component';
import { Helpers } from '../Helpers';

@Component({
    selector: 'app-search-contact',
    templateUrl: 'search.contact.component.html'
})
export class SearchContactComponent {
    contactName: string;
    searchResult: any;
    isTruncated: boolean;
    constructor(
        public navCtrl: NavController,
        private contacts: Contacts,
        private ref: ChangeDetectorRef,
        private helpers: Helpers
    ) {

    }
    searchContact() {
        this.contactName = this.contactName || 'Amma';
        if (this.contactName) {
            this.contacts.find(['displayName'], { 'filter': this.contactName }).then((res) => {
                const results = this.helpers.processContactSearchResult(res);
                this.searchResult = results.processedContacts;
                this.isTruncated = results.isTruncated;
                this.ref.detectChanges();
            }, (err) => {
                console.log(err);
            })
        }
    }

    selectNumber(phone: string, name: string) {
        this.navCtrl.push(SchedulerComponent, {
            name: name,
            phone: phone
        });
    }
}
