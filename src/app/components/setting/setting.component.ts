import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

// Redux
import { select } from '@angular-redux/store';

// Services
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

    @select() common;

    public dataConfig: any;
    public admin: any = {
        key: '',
        email: '',
        first_name: '',
        last_name: '',
        password: ''
    }
    public oldPassword = '';
    public newPassword = '';
    public rePassword = '';

    constructor(
        public router: Router,
        public firebaseService: FirebaseService,
        public helperService: HelperService,
        public translate: TranslateService
    ) {

        this.common.subscribe(data => {
            this.dataConfig = data['globalConfig'];
        });

        if (!this.helperService.checkPermissionAccess('settings')) {
            this.router.navigate(['/']);
        }

    }

    ngOnInit() {
        this.helperService.showLoading();
        this.getAdminAccount();
    }

    /**
     * Function get admin account
     */
    async getAdminAccount() {

        try {

            const result = await this.firebaseService.getWhere('agents', 'role', 0);
            this.admin.key = result[0]['$key'];
            this.admin.email = result[0]['email'];
            this.admin.first_name = result[0]['first_name'];
            this.admin.last_name = result[0]['last_name'];
            this.admin.password = result[0]['password'];

        } catch (e) {
            console.log(e);
        } finally {
            this.helperService.hideLoading();
        }

    }

    /**
     * Function validate account admin for save
     */
    validateAdminAccount() {

        const minLengthPassword = this.dataConfig['validate']['minLengthPassword'];

        if (this.oldPassword.trim() === '') {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('OLD_PASSWORD_REQUIRED'));
        } else if (this.oldPassword.trim().length < minLengthPassword) {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('OLD_PASSWORD_MIN_LENGTH', { number: minLengthPassword }));
        } else if (this.newPassword.trim() === '') {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('NEW_PASSWORD_REQUIRED'));
        } else if (this.newPassword.trim().length < minLengthPassword) {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('NEW_PASSWORD_MIN_LENGTH', { number: minLengthPassword }));
        } else if (this.rePassword.trim() === '') {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('RETYPE_PASSWORD_REQUIRED'));
        } else if (this.rePassword.trim().length < minLengthPassword) {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('RETYPE_PASSWORD_MIN_LENGTH', { number: minLengthPassword }));
        } else if (this.newPassword.trim() !== this.rePassword.trim()) {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('NEW_PASSWORD_NOT_MATCH'));
        } else if (this.admin.password !== this.oldPassword.trim()) {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('OLD_PASSWORD_NOT_CORRECT'));
        } else {
            this.editAccountAdmin();
        }

    }

    /**
     * Function edit account admin
     */
    async editAccountAdmin() {

        try {

            await this.firebaseService.updatePasswordForAccount(this.admin.email, this.admin.password, this.newPassword.trim());

            await this.firebaseService.updateWhereKey('agents', this.admin.key, {
                password: this.newPassword.trim()
            });

            this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('UPDATE_SUCCESS'));

        } catch (e) {
            console.log(e);
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
        }

    }

}
