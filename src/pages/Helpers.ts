export class Helpers {
    public leapYear(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    public speechAssistDateConverter(date: any, str?: string) {
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
    }

    public speechAssistTimeConverter(time: any) {
        // 10 P.M, 10:30 P.M, 10 tonight, night, evening, morning
        let x = time.toLowerCase().indexOf('p');
        let y = time.toLowerCase().indexOf('a');
        /*         let p = time.toLowerCase().indexOf('morning');
                let q = time.toLowerCase().indexOf('night');
                let r = time.toLowerCase().indexOf('morning'); */
        let scheduleTime: any;
        if (x > -1) {
            let eveTime = time.substring(0, x);
            const eveTimeLen = eveTime.split(':').length;
            if (eveTimeLen > 1) {
                scheduleTime = '' + (Number(eveTime.split(':')[0]) + 12) + ':' + eveTime.split(':')[1];
            }
            // const val = Number(time.substring(0, x));
            else if (eveTime === '12') {
                scheduleTime = '' + eveTime;
            } else {
                scheduleTime = '' + (eveTime + 12);
            }
        } else if (y > -1) {
            scheduleTime = time.substring(0, y);
        }
        /* else if (p > -1) {
            scheduleTime = time.substring(0, p);
        } else if (q > -1) {
            scheduleTime = time.substring(0, q);
        } else if (r > -1) {
            scheduleTime = time.substring(0, r);
        } */
        //set time to notification obj
        return scheduleTime.trim();
    }

    public processContactSearchResult(contacts: Array<any>) {
        let processedContacts = [];
        let isTruncated = false;
        if (contacts.length > 10) {
            isTruncated = true;
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
        return {
            processedContacts: processedContacts,
            isTruncated: isTruncated
        }
    }

    public generateID() {
        return (Date.now() + Math.ceil(Math.random() * 1000));
    }

    public isoConverter(date: any) {
        const val = new Date(date);
        const time = val.toTimeString().substring(0, 5);
        const month = val.getMonth() + 1;
        const _month = month < 9 ? '0' + month : month;
        const _date = val.getDate() < 9 ? '0' + val.getDate() : val.getDate();
        const _year = val.getFullYear();
        return '' + _year + '-' + _month + '-' + _date + 'T' + time + ':00Z';
    }
}
