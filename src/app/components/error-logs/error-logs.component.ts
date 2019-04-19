import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy } from 'lodash';
import { ConfirmationService } from 'primeng/api';

// Services
import { ConfigService } from '../../services/config/config.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';

@Component({
    selector: 'app-error-logs',
    templateUrl: './error-logs.component.html',
    styleUrls: ['./error-logs.component.scss']
})
export class ErrorLogsComponent implements OnInit {

    public errorsLogs: any = [];

    constructor(
        public configService: ConfigService,
        public router: Router,
        public firebaseService: FirebaseService,
        public helperService: HelperService,
        private confirmationService: ConfirmationService
    ) {

        if (this.configService.dataConfig['environment'] !== 'development' || !this.configService.dataConfig['debugger']['showErrorLogs']) {
            this.router.navigate(['/']);
        }

    }

    ngOnInit() {
        this.helperService.showLoading();
        this.getErrorsLogs();
    }

    /**
     * Function get errors logs
     */
    async getErrorsLogs() {

        try {

            const result = await this.firebaseService.get('error_logs');
            this.errorsLogs = orderBy(result, ['created_at'], ['desc']);
            console.log(this.errorsLogs);

        } catch (e) {
            console.log(e);
        } finally {
            this.helperService.hideLoading();
        }

    }

    /**
     * Function convert date time
     */
    convertTime(time: number) {
        return new Date(time);
    }

    /**
     * Function convert account data
     */
    convertAccData(data) {

        try {

            const obj = JSON.parse(data);
            return `Email: ${obj['email']}, Name: ${obj['name']}`;

        } catch (e) {
            return ``;
        }

    }

    /**
     * Function show confirm delete log
     */
    deleteErrorLog(key: string) {
        this.confirmationService.confirm({
            message: 'Do you want remove this log?',
            accept: () => {
                this.removeErrorLog(key);
            }
        });
    }

    /**
     * Function delete log
     */
    async removeErrorLog(key: string) {

        try {

            await this.firebaseService.deleteWhereKey('error_logs', key);
            this.getErrorsLogs();

        } catch (e) {
            console.log(e);
        }

    }

}
