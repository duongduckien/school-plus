import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

// Redux
import { select } from '@angular-redux/store';
import { VACATIONS_DATA } from '../../common/actions';

// Services
import { HelperService } from '../../services/helper/helper.service';
import { FirebaseService } from '../../services/firebase/firebase.service';

// Interfaces
import { VacationData } from '../../interfaces/vacation.interface';

@Component({
    selector: 'app-vacations',
    templateUrl: 'vacations.component.html',
    styleUrls: ['vacations.component.scss']
})
export class VacationsComponent implements OnInit {

    @select() common;
    @select() vacations;

    public dataConfig: any;
    public vacationFormatDate: string = '';
    public onLabel: string = '';
    public offLabel: string = '';
    public addVacation: boolean = false;
    public typeVacation: boolean = true;
    public startTime: any;
    public endTime: any;
    public vacationName: string = '';
    public vacationsData: any = [];
    public searchText: string = '';

    constructor(
        public translate: TranslateService,
        public helperService: HelperService,
        public firebaseService: FirebaseService,
        private confirmationService: ConfirmationService
    ) {

        this.common.subscribe(data => {
            this.dataConfig = data['globalConfig'];
            this.vacationFormatDate = data['globalConfig']['formatDate']['vacation'];
        });

        this.vacations.subscribe(data => {
            this.vacationsData = data['vacationsData'];
        });

    }

    ngOnInit() {
        this.onLabel = this.translate.instant('AM');
        this.offLabel = this.translate.instant('PM');
        this.helperService.showLoading();
        this.getListVacations();
    }

    /**
     * Function get list all vacation
     */
    async getListVacations() {

        try {

            const vacations = await this.firebaseService.get('vacations');
            this.helperService.dispatchToRedux(VACATIONS_DATA, this.convertVacations(vacations));
            this.helperService.hideLoading();

        } catch (e) {
            this.helperService.hideLoading();
            console.log(e);
        }

    }

    /**
     * Function convert vacation data
     */
    convertVacations(vacations) {
        if (vacations.length > 0) {
            for (let i = 0; i < vacations.length; i++) {
                vacations[i]['checked'] = (vacations[i]['type'] === 'AM') ? true : false;
                vacations[i]['startTime'] = new Date(vacations[i]['start_time']);
                vacations[i]['endTime'] = new Date(vacations[i]['end_time']);
            }
        }
        return vacations;
    }

    /**
     * Function on change start time or end time
     */
    async onChangeTime(type: string, time: any, key: string, timeForCompare: any) {

        try {

            switch (type) {
                case 'start': {

                    if (this.helperService.toMilliseconds(time) > this.helperService.toMilliseconds(timeForCompare)) {

                        this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('START_TIME_LESS_THAN_EQUAL_END_TIME'));

                        // Get again vacation data
                        const vacations = await this.firebaseService.get('vacations');
                        this.helperService.dispatchToRedux(VACATIONS_DATA, this.convertVacations(vacations));

                    } else {
                        await this.firebaseService.updateWhereKey('vacations', key, {
                            start_time: this.helperService.toMilliseconds(time),
                            updated_at: new Date().getTime()
                        });
                        this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('UPDATE_SUCCESS'));
                    }

                    break;

                }
                case 'end': {

                    if (this.helperService.toMilliseconds(time) < this.helperService.toMilliseconds(timeForCompare)) {

                        this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('START_TIME_LESS_THAN_EQUAL_END_TIME'));

                        // Get again vacation data
                        const vacations = await this.firebaseService.get('vacations');
                        this.helperService.dispatchToRedux(VACATIONS_DATA, this.convertVacations(vacations));

                    } else {
                        await this.firebaseService.updateWhereKey('vacations', key, {
                            end_time: this.helperService.toMilliseconds(time),
                            updated_at: new Date().getTime()
                        });
                        this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('UPDATE_SUCCESS'));
                    }

                    break;

                }
                default: {
                    break;
                }
            }

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Function on change type
     */
    async onChangeType(type: boolean, key: string) {

        try {

            await this.firebaseService.updateWhereKey('vacations', key, {
                type: (type) ? 'AM' : 'PM',
                updated_at: new Date().getTime()
            });

            this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('UPDATE_SUCCESS'));

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Function delete vacation
     */
    deleteVacation(key: string) {

        this.confirmationService.confirm({
            message: this.translate.instant('CONFIRM_DELETE_VACATION'),
            accept: () => {
                this.removeVacation(key);
            }
        });

    }

    /**
     * Function remove vacation
     */
    async removeVacation(key: string) {

        try {

            await this.firebaseService.deleteWhereKey('vacations', key);
            this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('DELETE_SUCCESS'));

            // Get again vacation data
            const vacations = await this.firebaseService.get('vacations');
            this.helperService.dispatchToRedux(VACATIONS_DATA, this.convertVacations(vacations));

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Function show add vacation
     */
    showAddVacation(param: boolean) {
        this.addVacation = param;
    }

    /**
     * Function validate vacation data
     */
    validateVacation() {

        const start = this.helperService.toMilliseconds(this.startTime);
        const end = this.helperService.toMilliseconds(this.endTime);

        if (this.vacationName === '') {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('VACATION_NAME_REQUIRED'));
        } else if (!this.startTime) {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('START_TIME_VACATION_REQUIRED'));
        } else if (!this.endTime) {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('END_TIME_VACATION_REQUIRED'));
        } else if (end < start) {
            this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('START_TIME_LESS_THAN_EQUAL_END_TIME'));
        } else {
            this.storeVacation();
        }

    }

    /**
     * Function save vacation data
     */
    async storeVacation() {

        try {

            // Check name of vacation exist
            const vacation = await this.firebaseService.getWhere('vacations', 'vacation_name', this.vacationName);

            if (vacation.length > 0) {
                this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('VACATION_NAME_EXIST'));
            } else {

                const vacationData: VacationData = {
                    vacation_name: this.vacationName,
                    start_time: this.helperService.toMilliseconds(this.startTime),
                    end_time: this.helperService.toMilliseconds(this.endTime),
                    type: this.typeVacation ? 'AM' : 'PM',
                    status: 1,
                    created_at: new Date().getTime(),
                    updated_at: 0
                }

                await this.firebaseService.create('vacations', vacationData);

                // Get again vacations data
                const vacations = await this.firebaseService.get('vacations');
                this.helperService.dispatchToRedux(VACATIONS_DATA, this.convertVacations(vacations));

                // Format create vacation form
                this.resetFormVacation();

                this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('ADD_SUCCESS'));

            }

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Function format create vacation form
     */
    resetFormVacation() {
        this.vacationName = '';
        this.startTime = null;
        this.endTime = null;
    }

}
