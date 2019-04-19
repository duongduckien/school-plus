import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

// Services
import { HelperService } from '../../services/helper/helper.service';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Component({
    selector: 'app-vacation-settings',
    templateUrl: 'vacation-settings.component.html',
    styleUrls: ['vacation-settings.component.scss']
})
export class VacationSettingsComponent implements OnInit {

    public key: string = '';
    public scheduleAm: any = [];
    public schedulePm: any = [];
    public scheduleValAm: string[] = [];
    public scheduleValPm: string[] = [];
    public vacations: any = [];
    public hoverStartTime;
    public hoverEndTime;
    public hoverType: string = '';
    public selectedVacations: string[] = [];
    public selectAll: string[] = [];
    public keyOfVacations: string[] = [];
    public doughnutChart: any;
    public barChart: any;

    constructor(
        public route: ActivatedRoute,
        public translate: TranslateService,
        public helperService: HelperService,
        public firebaseService: FirebaseService,
        public location: Location,
    ) {
        this.doughnutChart = {
            labels: ['Đúng giờ', 'Muộn giờ'],
            datasets: [
                {
                    data: [60, 5],
                    backgroundColor: [
                        '#36A2EB',
                        '#FF6384'
                    ],
                    hoverBackgroundColor: [
                        '#36A2EB',
                        '#FF6384'
                    ]
                }
            ]
        };

        this.barChart = {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [
                {
                    label: 'Doanh thu',
                    backgroundColor: '#9CCC65',
                    borderColor: '#7CB342',
                    data: [65, 59, 80, 81, 56, 55, 48, 80, 81, 56, 55, 48]
                }
            ]
        }
    }

    ngOnInit() {
        this.route.params.subscribe(res => {
            this.key = res['key'];
            this.getSchedule();
            this.getVacations();
            this.getGroupsData(res['key']);
        });
    }

    /**
     * Function handle when hover to vacation
     */
    handleHoverVacation(event, vacation, overlaypanel) {
        this.hoverStartTime = new Date(vacation['start_time']);
        this.hoverEndTime = new Date(vacation['end_time']);
        this.hoverType = vacation['type'];
        overlaypanel.toggle(event);
    }

    /**
     * Function handle select vacation
     */
    async handleSelectVacation() {

        try {

            // Update vacation of group
            await this.firebaseService.updateWhereKey('groups', this.key, {
                updated_at: new Date().getTime(),
                vacations: (this.selectedVacations.length > 0) ? this.selectedVacations : 0
            });

            this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('UPDATE_SUCCESS'));

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Function handle when click select all vacations
     */
    selectAllVacations() {

        if (this.selectAll.length > 0) {
            this.selectedVacations = this.keyOfVacations;
        } else {
            this.selectedVacations = [];
        }

        // Update vacations of group
        this.handleSelectVacation();

    }

    /**
     * Function get list vacations
     */
    async getVacations() {

        this.helperService.showLoading();

        try {

            const result = await this.firebaseService.get('vacations');
            this.vacations = result;

            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    this.keyOfVacations.push(result[i]['$key']);
                }
            }

            this.helperService.hideLoading();

        } catch (e) {
            this.helperService.hideLoading();
            console.log(e);
        }

    }

    /**
     * Function get data of group
     */
    async getGroupsData(key: string) {

        try {

            const result = await this.firebaseService.getWhereKey('groups', key);

            // Get list vacations selected
            if (result[0]['vacations'] && result[0]['vacations'] !== 0) {
                this.selectedVacations = result[0]['vacations'];
            }

            // Get recurrent
            if (result[0]['recurrentAm'] && result[0]['recurrentAm'] !== 0) {
                this.scheduleValAm = result[0]['recurrentAm']
            }

            if (result[0]['recurrentPm'] && result[0]['recurrentPm'] !== 0) {
                this.scheduleValPm = result[0]['recurrentPm']
            }

        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Function handle onchange recurrent
     */
    async handleChangeRecurrent(type: string) {

        try {

            switch (type) {
                case 'AM': {
                    await this.firebaseService.updateWhereKey('groups', this.key, {
                        updated_at: new Date().getTime(),
                        recurrentAm: (this.scheduleValAm.length > 0) ? this.scheduleValAm : 0
                    });
                    break;
                }
                case 'PM': {
                    await this.firebaseService.updateWhereKey('groups', this.key, {
                        updated_at: new Date().getTime(),
                        recurrentPm: (this.scheduleValPm.length > 0) ? this.scheduleValPm : 0
                    });
                    break;
                }
                default: {
                    break;
                }
            }

            this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('UPDATE_SUCCESS'));

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Function get schedule
     */
    getSchedule() {

        this.scheduleAm = [
            { name: 'MONDAY_AM' },
            { name: 'TUESDAY_AM' },
            { name: 'WEDNESDAY_AM' },
            { name: 'THURSDAY_AM' },
            { name: 'FRIDAY_AM' },
            { name: 'SATURDAY_AM' },
            { name: 'SUNDAY_AM' }
        ];

        this.schedulePm = [
            { name: 'MONDAY_PM' },
            { name: 'TUESDAY_PM' },
            { name: 'WEDNESDAY_PM' },
            { name: 'THURSDAY_PM' },
            { name: 'FRIDAY_PM' },
            { name: 'SATURDAY_PM' },
            { name: 'SUNDAY_PM' }
        ];

    }

    // updateField() {
    //     const arr = ['SATURDAY_AM', 'SATURDAY_PM', 'SUNDAY_AM', 'SUNDAY_PM'];
    //     this.helperService.updateField('groups', {
    //         vacations: 0,
    //         recurrent: arr
    //     });
    // }

    /**
     * Function go back to groups
     */
    backToGroups() {
        this.location.back();
    }
}
