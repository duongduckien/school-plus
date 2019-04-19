import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';

// Redux
import { NgRedux } from '@angular-redux/store';
import { SHOW_LOADING, SHOW_MESSAGE } from '../../common/actions';

// Services
import { FirebaseService } from '../firebase/firebase.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class HelperService {

    public msgs: Message[] = [];

    constructor(
        public ngRedux: NgRedux<any>,
        public firebaseService: FirebaseService,
        public configService: ConfigService
    ) { }

    /**
     * Function dispatch data to redux
     */
    dispatchToRedux(action: string, data: any) {
        this.ngRedux.dispatch({
            type: action,
            payload: data
        });
    }

    /**
     * Set data to local storage
     */
    setItemToLocalStorage(name: string, data: any) {
        localStorage.setItem(name, data);
    }

    /**
     * Get data from local storage
     */
    getItemFromLocalStorage(name: string) {
        return localStorage.getItem(name);
    }

    /**
     * Function delete in local storage
     */
    removeItemInLocalStorage(name: string) {
        localStorage.removeItem(name);
    }

    /**
     * Function show loading
     */
    showLoading() {
        this.dispatchToRedux(SHOW_LOADING, true);
    }

    /**
     * Function hide loading
     */
    hideLoading() {
        this.dispatchToRedux(SHOW_LOADING, false);
    }

    /**
     * Function check is email
     */
    isEmail(email: string) {
        const rule = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return rule.test(email);
    }

    /**
     * Function check phone number
     */
    isPhoneNumber(phoneNumber: string) {
        return !/^\d+$/.test(phoneNumber.split(' ').join(''));
    }

    /**
     * Function check is number
     */
    isNumber(num: string) {
        return !/^\d+$/.test(num);
    }

    /**
     * Function convert grant access
     */
    convertGrantAccess(type: string, data: any) {
        switch (type) {
            case 'insert': {
                if (Array.isArray(data)) {
                    let grant = '';
                    if (data.length > 0) {
                        grant = data.join(',');
                    }
                    return grant;
                }
                break;
            }
            case 'get': {
                const arr = data.split(',');
                return arr;
            }
            default: {
                break;
            }
        }
    }

    /**
     * Function find object in array
     */
    findObjectInArray(arr: any, key: string, value: any) {
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][key] === value) {
                    return arr[i];
                }
            }
        }
        return false;
    }

    /**
     * Function convert date time to milliseconds
     */
    toMilliseconds(date: string) {
        const day = new Date(date);
        return day.getTime();
    }

    /**
     * Function get hours & minutes
     */
    getHourAndMinute(date: string) {
        const day = new Date(date);
        return {
            hours: day.getHours(),
            minutes: day.getMinutes()
        }
    }

    /**
     * Function set default time
     */
    setGroupTime(hours?: number, minutes?: number) {

        const day = new Date();

        if (hours && minutes) {
            day.setHours(hours, minutes, 0, 0);
        } else {
            day.setHours(9, 0, 0, 0);
        }

        return day;

    }

    /**
     * Function show message
     */
    showMessage(type: string, title: string, content: string) {

        const msgs = [];
        msgs.push({severity: type, summary: title, detail: content});
        this.dispatchToRedux(SHOW_MESSAGE, msgs);

        setInterval(() => {
            this.dispatchToRedux(SHOW_MESSAGE, []);
        }, 3000);

    }

    /**
     * Function update field of all records in collection
     */
    async updateField(collection: string, obj: any) {

        try {

            // Get all data in collection
            const data = await this.firebaseService.get(collection);

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const key = data[i]['$key'];
                    await this.firebaseService.updateWhereKey(collection, key, obj);
                }
            }

        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Function get file name from file
     */
    getFileName(file: any) {
        const extension = file.name.split('.').pop();
        const fileName = `${new Date().getTime()}.${extension}`;
        return fileName;
    }

    /**
     * Function check permission access page
     */
    checkPermissionAccess(pathName: string) {

        const dataAccount = JSON.parse(this.getItemFromLocalStorage('smartschool'));

        if (dataAccount['role'] === 0) {
            return true;
        } else {

            if (pathName === 'settings') {
                return false;
            }

            const grantAccess = this.convertGrantAccess('get', dataAccount['grant_access']);

            if (this.configService.dataConfig['grantAccess'][pathName] === '') {
                return true;
            }

            if (grantAccess.indexOf(this.configService.dataConfig['grantAccess'][pathName]) > -1) {
                return true;
            }

            return false;

        }

    }

    /**
     * Function get grant access of current user
     */
    getPermission() {
        const dataAccount = JSON.parse(this.getItemFromLocalStorage('smartschool'));
        const grantAccess = this.convertGrantAccess('get', dataAccount['grant_access']);
        return grantAccess;
    }

    /**
     * Function check is admin
     */
    isAdmin() {
        const dataAccount = JSON.parse(this.getItemFromLocalStorage('smartschool'));
        if (dataAccount['role'] === 0) {
            return true;
        }
        return false;
    }

}
