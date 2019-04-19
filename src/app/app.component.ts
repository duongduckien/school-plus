import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';

// Redux
import { select } from '@angular-redux/store';

// Services
import { ConfigService } from './services/config/config.service';
import { HelperService } from './services/helper/helper.service';
import { FirebaseService } from './services/firebase/firebase.service';

// Interfaces
import { AgentData } from './interfaces/agent.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @select() common;

    public dataConfig: any;
    public msgs: Message[] = [];

    constructor(
        public configService: ConfigService,
        public translate: TranslateService,
        public helperService: HelperService,
        public firebaseService: FirebaseService
    ) {

        // Set default language
        translate.setDefaultLang('en');

        this.common.subscribe(data => {
            this.dataConfig = data['globalConfig'];
            this.msgs = data['message'];
        });

    }

    ngOnInit() {

    }

    /**
     * Function create admin account
     */
    async createAdminAccount() {

        try {

            const emailAdmin = this.dataConfig['administrator']['email'].trim();
            const passwordAdmin = this.dataConfig['administrator']['password'].trim();
            const grantAccess = await this.firebaseService.get('access');
            const arrGrant = [];

            if (grantAccess.length > 0) {
                for (let i = 0; i < grantAccess.length; i++) {
                    arrGrant.push(grantAccess[i]['name']);
                }
            }

            const grantForAdmin = this.helperService.convertGrantAccess('insert', arrGrant);
            const result = await this.firebaseService.getWhere('agents', 'role', 0);

            if (result.length === 0) {

                const admin: AgentData = {
                    create_at: new Date().getTime(),
                    first_name: '',
                    last_name: '',
                    email: emailAdmin,
                    phone_number: '',
                    password: passwordAdmin,
                    role: 0,
                    status: 1,
                    update_at: 0,
                    grant_access: grantForAdmin
                }

                const resultCreateAcc = await this.firebaseService.createAccount(emailAdmin, passwordAdmin);

                if (resultCreateAcc === 'Success') {
                    await this.firebaseService.insert('agents', admin);
                }

            }

        } catch (e) {
            console.log(e);
        }

    }

    /**
    |--------------------------------------------------
    | Function for test
    |--------------------------------------------------
    */

    /**
     * Update group for pupils
     */
    async updateGroupsForPupils() {

        try {

            const pupils = await this.firebaseService.get('pupils');

            if (pupils.length > 0) {
                for (let i = 0; i < pupils.length; i++) {
                    const key = pupils[i]['$key'];
                    await this.firebaseService.updateWhereKey('pupils', key, {
                        group_class: '-LRpLc3iA7yv58L1_a_D'
                    });
                }
            }

            console.log('Success');

        } catch (e) {
            console.log(e);
        }

    }

}
