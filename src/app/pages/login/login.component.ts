import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Md5 } from 'ts-md5/dist/md5';

// Redux
import { select } from '@angular-redux/store';

// Services
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    @select() common;

    public dataConfig: any;
    public username: string = '';
    public password: string = '';
    public message: string = '';
    private minLengthPassword: number;

    constructor(
        public router: Router,
        public translate: TranslateService,
        public firebaseService: FirebaseService,
        public helperService: HelperService
    ) {

        this.common.subscribe(data => {
            this.dataConfig = data['globalConfig'];
        });

    }

    ngOnInit() {

    }

    /**
     * Function validate for login
     */
    login() {

        this.minLengthPassword = this.dataConfig['validate']['minLengthPassword'];
        this.message = '';

        if (this.username === '') {
            this.message = this.translate.instant('EMAIL_REQUIRED');
        } else if (this.password === '') {
            this.message = this.translate.instant('PASSWORD_REQUIRED');
        } else if (this.password.length < this.minLengthPassword) {
            this.message = this.translate.instant('PASSWORD_MIN_LENGTH', { number : this.minLengthPassword });
        } else {
            this.logging(this.username, this.password);
        }

    }

    /**
     * Function login
     */
    async logging(username, password) {

        this.helperService.showLoading();

        this.message = '';

        try {

            const result = await this.firebaseService.signIn(username, password);

            if (result) {

                const account = await this.firebaseService.getWhere('agents', 'email', username);

                const data = {
                    email: account[0]['email'],
                    grant_access: account[0]['grant_access'],
                    role: account[0]['role']
                }

                this.helperService.setItemToLocalStorage('smartschool', JSON.stringify(data));
                this.router.navigate(['status']);

            }

        } catch (e) {
            this.message = this.translate.instant('USERNAME_OR_PASSWORD_INCORRECT');
            console.log(e);
        } finally {
            this.helperService.hideLoading();
        }

    }

}
