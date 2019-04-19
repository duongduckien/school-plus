import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

// Redux
import { select } from '@angular-redux/store';

// Services
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';

// Interfaces
import { GroupData } from '../../interfaces/group.interface';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {

    @select() common;

    public dataConfig: any;
    public searchText: string = '';
    public showAddGroup: boolean = false;
    public groupName: string = '';
    public BFSCIT_TIME;
    public BFSCOT_TIME;
    public CASCIT_AM_TIME;
    public CASCOT_AM_TIME;
    public CASCIT_PM_TIME;
    public CASCOT_PM_TIME;
    public AFSCIT_TIME;
    public AFSCOT_TIME;
    public groups: any = [];
    public searchGroups = new Subject<any>();
    public listAgents: any = [];
    public agent: string = '';

    constructor(
        public translate: TranslateService,
        public firebaseService: FirebaseService,
        public helperService: HelperService,
        public router: Router,
        private confirmationService: ConfirmationService
    ) {

        if (!this.helperService.checkPermissionAccess('groups')) {
            this.router.navigate(['/']);
        }

        this.searchGroups
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(text => {
                this.searchGroup(text);
            });

        this.common.subscribe(data => {
            this.dataConfig = data['globalConfig'];
        });

    }

    ngOnInit() {
        this.helperService.showLoading();
        this.getGroups();
        this.setListAgents();
    }

    /**
     * Function set list agents
     */
    async setListAgents() {

        try {

            const result = await this.firebaseService.get('agents');

            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    this.listAgents.push({
                        label: `${result[i]['first_name']} ${result[i]['last_name']}`,
                        value: result[i]['$key']
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Function set default time
     */
    setDefaultTime() {
        this.CASCIT_AM_TIME = this.helperService.setGroupTime();
        this.CASCOT_AM_TIME = this.helperService.setGroupTime();
        this.CASCIT_PM_TIME = this.helperService.setGroupTime();
        this.CASCOT_PM_TIME = this.helperService.setGroupTime();
    }

    /**
     * Function get list groups
     */
    async getGroups() {

        try {

            const result = await this.firebaseService.get('groups');
            this.groups = this.convertGroupData(result);
            this.helperService.hideLoading();

        } catch (e) {
            this.helperService.hideLoading();
            console.log(e);
        }

    }

    /**
     * Function search group
     */
    async searchGroup(text: string) {

        try {

            const result = await this.firebaseService.get('groups');
            this.groups = this.convertGroupData(result, text);

        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Function convert groups data
     */
    convertGroupData(data, text?: string) {

        const arrGroups = [];

        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {

                if (text) {

                    if (data[i].group_name.toLowerCase().indexOf(text.toLowerCase()) > -1) {
                        arrGroups.push({
                            group_name: data[i]['group_name'],
                            BFSCIT_TIME: (data[i]['BFSCIT_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['BFSCIT_TIME']['hours'], data[i]['BFSCIT_TIME']['minutes']) : null,
                            BFSCOT_TIME: (data[i]['BFSCOT_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['BFSCOT_TIME']['hours'], data[i]['BFSCOT_TIME']['minutes']) : null,
                            CASCIT_AM_TIME: (data[i]['CASCIT_AM_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['CASCIT_AM_TIME']['hours'], data[i]['CASCIT_AM_TIME']['minutes']) : null,
                            CASCOT_AM_TIME: (data[i]['CASCOT_AM_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['CASCOT_AM_TIME']['hours'], data[i]['CASCOT_AM_TIME']['minutes']) : null,
                            CASCIT_PM_TIME: (data[i]['CASCIT_PM_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['CASCIT_PM_TIME']['hours'], data[i]['CASCIT_PM_TIME']['minutes']) : null,
                            CASCOT_PM_TIME: (data[i]['CASCOT_PM_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['CASCOT_PM_TIME']['hours'], data[i]['CASCOT_PM_TIME']['minutes']) : null,
                            AFSCIT_TIME: (data[i]['AFSCIT_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['AFSCIT_TIME']['hours'], data[i]['AFSCIT_TIME']['minutes']) : null,
                            AFSCOT_TIME: (data[i]['AFSCOT_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['AFSCOT_TIME']['hours'], data[i]['AFSCOT_TIME']['minutes']) : null,
                            agent: data[i]['agent'],
                            key: data[i]['$key']
                        });
                    }

                } else {
                    arrGroups.push({
                        group_name: data[i]['group_name'],
                        BFSCIT_TIME: (data[i]['BFSCIT_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['BFSCIT_TIME']['hours'], data[i]['BFSCIT_TIME']['minutes']) : null,
                        BFSCOT_TIME: (data[i]['BFSCOT_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['BFSCOT_TIME']['hours'], data[i]['BFSCOT_TIME']['minutes']) : null,
                        CASCIT_AM_TIME: (data[i]['CASCIT_AM_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['CASCIT_AM_TIME']['hours'], data[i]['CASCIT_AM_TIME']['minutes']) : null,
                        CASCOT_AM_TIME: (data[i]['CASCOT_AM_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['CASCOT_AM_TIME']['hours'], data[i]['CASCOT_AM_TIME']['minutes']) : null,
                        CASCIT_PM_TIME: (data[i]['CASCIT_PM_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['CASCIT_PM_TIME']['hours'], data[i]['CASCIT_PM_TIME']['minutes']) : null,
                        CASCOT_PM_TIME: (data[i]['CASCOT_PM_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['CASCOT_PM_TIME']['hours'], data[i]['CASCOT_PM_TIME']['minutes']) : null,
                        AFSCIT_TIME: (data[i]['AFSCIT_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['AFSCIT_TIME']['hours'], data[i]['AFSCIT_TIME']['minutes']) : null,
                        AFSCOT_TIME: (data[i]['AFSCOT_TIME'] !== 0) ? this.helperService.setGroupTime(data[i]['AFSCOT_TIME']['hours'], data[i]['AFSCOT_TIME']['minutes']) : null,
                        agent: data[i]['agent'],
                        key: data[i]['$key']
                    });
                }

            }
        }

        return arrGroups;

    }

    /**
     *  Function show or hide modal for add group
     */
    showAddGroupRow(param: boolean) {
        this.showAddGroup = param;
        this.resetForm();
    }

    /**
     * Reset form
     */
    resetForm() {
        this.groupName = '';
        this.BFSCIT_TIME = null;
        this.BFSCOT_TIME = null;
        this.CASCIT_AM_TIME = null;
        this.CASCOT_AM_TIME = null;
        this.CASCIT_PM_TIME = null;
        this.CASCOT_PM_TIME = null;
        this.AFSCIT_TIME = null;
        this.AFSCOT_TIME = null;
        this.agent = '';
        this.setDefaultTime();
    }

    /**
     * Function add group
     */
    async addGroup() {

        try {

            if (this.groupName === '') {
                this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('GROUP_NAME_REQUIRED'));
            } else {

                // Check name of group exist
                const group = await this.firebaseService.getWhere('groups', 'group_name', this.groupName);

                // Schedule recurrent
                const arrRecurrentAm = this.dataConfig['recurrentDefault']['scheduleAm'];
                const arrRecurrentPm = this.dataConfig['recurrentDefault']['schedulePm'];

                if (group.length > 0) {
                    this.helperService.showMessage('warn', this.translate.instant('WARNING'), this.translate.instant('GROUP_NAME_EXIST'));
                } else {
                    const groupData: GroupData = {
                        group_name: this.groupName,
                        BFSCIT_TIME: (this.BFSCIT_TIME) ? this.helperService.getHourAndMinute(this.BFSCIT_TIME) : 0,
                        BFSCOT_TIME: (this.BFSCOT_TIME) ? this.helperService.getHourAndMinute(this.BFSCOT_TIME) : 0,
                        CASCIT_AM_TIME: (this.CASCIT_AM_TIME) ? this.helperService.getHourAndMinute(this.CASCIT_AM_TIME) : 0,
                        CASCOT_AM_TIME: (this.CASCOT_AM_TIME) ? this.helperService.getHourAndMinute(this.CASCOT_AM_TIME) : 0,
                        CASCIT_PM_TIME: (this.CASCIT_PM_TIME) ? this.helperService.getHourAndMinute(this.CASCIT_PM_TIME) : 0,
                        CASCOT_PM_TIME: (this.CASCOT_PM_TIME) ? this.helperService.getHourAndMinute(this.CASCOT_PM_TIME) : 0,
                        AFSCIT_TIME: (this.AFSCIT_TIME) ? this.helperService.getHourAndMinute(this.AFSCIT_TIME) : 0,
                        AFSCOT_TIME: (this.AFSCOT_TIME) ? this.helperService.getHourAndMinute(this.AFSCOT_TIME) : 0,
                        create_at: new Date().getTime(),
                        update_at: 0,
                        status: 1,
                        recurrentAm: arrRecurrentAm,
                        recurrentPm: arrRecurrentPm,
                        vacations: 0,
                        agent: this.agent,
                    }

                    await this.firebaseService.insert('groups', groupData);
                    this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('ADD_SUCCESS'));

                    // Get groups data again
                    const result = await this.firebaseService.get('groups');
                    this.groups = this.convertGroupData(result);

                    // Reset form
                    this.showAddGroupRow(false);
                }

            }

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Function handle on change time of group
     */
    async onChangeTime(type: string, time: any, key: string) {

        try {

            if (time && type !== '') {

                const timeForChange = this.helperService.getHourAndMinute(time);

                switch (type) {
                    case 'BFSCIT_TIME': {
                        await this.firebaseService.updateWhereKey('groups', key, {
                            BFSCIT_TIME: timeForChange,
                            update_at: new Date().getTime()
                        });
                        break;
                    }
                    case 'BFSCOT_TIME': {
                        await this.firebaseService.updateWhereKey('groups', key, {
                            BFSCOT_TIME: timeForChange,
                            update_at: new Date().getTime()
                        });
                        break;
                    }
                    case 'CASCIT_AM_TIME': {
                        await this.firebaseService.updateWhereKey('groups', key, {
                            CASCIT_AM_TIME: timeForChange,
                            update_at: new Date().getTime()
                        });
                        break;
                    }
                    case 'CASCOT_AM_TIME': {
                        await this.firebaseService.updateWhereKey('groups', key, {
                            CASCOT_AM_TIME: timeForChange,
                            update_at: new Date().getTime()
                        });
                        break;
                    }
                    case 'CASCIT_PM_TIME': {
                        await this.firebaseService.updateWhereKey('groups', key, {
                            CASCIT_PM_TIME: timeForChange,
                            update_at: new Date().getTime()
                        });
                        break;
                    }
                    case 'CASCOT_PM_TIME': {
                        await this.firebaseService.updateWhereKey('groups', key, {
                            CASCOT_PM_TIME: timeForChange,
                            update_at: new Date().getTime()
                        });
                        break;
                    }
                    case 'AFSCIT_TIME': {
                        await this.firebaseService.updateWhereKey('groups', key, {
                            AFSCIT_TIME: timeForChange,
                            update_at: new Date().getTime()
                        });
                        break;
                    }
                    case 'AFSCOT_TIME': {
                        await this.firebaseService.updateWhereKey('groups', key, {
                            AFSCOT_TIME: timeForChange,
                            update_at: new Date().getTime()
                        });
                        break;
                    }
                    default: {
                        break;
                    }
                }

                this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('UPDATE_SUCCESS'));

            }

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Function confirm remove group
     */
    deleteVacation(key: string) {

        this.confirmationService.confirm({
            message: this.translate.instant('CONFIRM_DELETE_GROUP'),
            accept: () => {
                this.removeGroup(key);
            }
        });

    }

    /**
     * Function remove group
     */
    async removeGroup(key: string) {

        try {

            if (key !== '') {

                // Check if group have any pupils.
                const pupils = await this.firebaseService.getWhere('pupils', 'group_class', key);

                if (pupils && pupils.length === 0) {

                    // Remove group
                    await this.firebaseService.deleteWhereKey('groups', key);
                    this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('DELETE_SUCCESS'));

                    // Get groups data again
                    const result = await this.firebaseService.get('groups');
                    this.groups = this.convertGroupData(result);

                } else {
                    this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('HAS_PUPILS'));
                }

            }

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Function redirect to vacation settings
     */
    redirectToVacationSettings(key: string) {
        this.router.navigate(['vacation-settings', key]);
    }

    ngOnDestroy() {

    }

}
