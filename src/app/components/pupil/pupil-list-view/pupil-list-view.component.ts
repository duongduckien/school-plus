import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

// Redux
import { select } from '@angular-redux/store';
import { PUPILS_SELECTED, SHOW_PUPIL_MODAL, SET_PUPIL_MODAL_TYPE, SET_PUPIL_VAL, SET_PUPIL_KEY_FOR_EDIT, PUPILS_DATA } from '../../../common/actions';

// Services
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { HelperService } from '../../../services/helper/helper.service';
import { UploadService } from '../../../services/upload/upload.service';
import { RelationService } from '../../../services/relation/relation.service';

// Interfaces
import { PupilData } from '../../../interfaces/pupil.interface';

@Component({
    selector: 'app-pupil-list-view',
    templateUrl: './pupil-list-view.component.html',
    styleUrls: ['./pupil-list-view.component.scss']
})
export class PupilListViewComponent implements OnInit {

    @select() pupil;
    @select() common;

    public selectAll: string[] = [];
    public selectedPupil: string[] = [];
    public pupils: any = [];
    public fieldsort: string = '';
    public isDesc: boolean = false;
    public direction: number;
    public searchText: string = '';
    public dataConfig: any;
    public groups: any;
    public agents: any;
    public selectedGroup: any = {};
    public selectedAgent: string = '';
    public groupsByAgent: any = [];

    constructor(
        public firebaseService: FirebaseService,
        public helperService: HelperService,
        private confirmationService: ConfirmationService,
        public translate: TranslateService,
        public uploadService: UploadService,
        public relationService: RelationService,
        public router: Router,
    ) {

        this.pupil.subscribe(data => {
            this.pupils = data.pupilsData;
            this.searchText = data.textSearchPupil;
        });

        this.common.subscribe(data => {
            this.dataConfig = data['globalConfig'];
        });

        this.groups = [{
            label: this.translate.instant('SELECT_GROUP_CLASS'),
            value: null
        }];

        this.agents = [{
            label: this.translate.instant('SELECT_AGENT'),
            value: null
        }]

    }

    ngOnInit() {
        this.getGroups();
        this.setAgents();
    }

    /**
     * Function get list groups
     */
    async getGroups() {
        try {
            const result = await this.firebaseService.get('groups');
            this.groupsByAgent = result;
            this.groups = this.convertGroupData(result);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Function convert groups data
     */
    convertGroupData(data) {

        const arrGroups = [{
            label: this.translate.instant('SELECT_GROUP_CLASS'),
            value: null
        }];

        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                    arrGroups.push({
                        label: data[i]['group_name'],
                        value: data[i],
                    });
                }

        }

        return arrGroups;

    }

    /**
     * Function set list agents
     */
    async setAgents() {

        try {

            const result = await this.firebaseService.get('agents');

            if (result && result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    this.agents.push({
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
     * Function sort by condition
     */
    orderBy(col) {
        this.fieldsort = col;
        this.isDesc = !this.isDesc;
        this.direction = this.isDesc ? 1 : -1;
    }

    /**
     * Function handle when click select all pupils
     */
    selectAllPupil() {

        const keyOfPupil = [];

        if (this.pupils.length > 0) {
            for (let i = 0; i < this.pupils.length; i++) {
                keyOfPupil.push(this.pupils[i]['$key']);
            }
        }

        this.selectedPupil = (this.selectAll.length > 0) ? keyOfPupil : [];

        this.helperService.dispatchToRedux(PUPILS_SELECTED, this.selectedPupil);

    }

    /**
     * Function handle event user selected
     */
    selectPupil() {
        this.helperService.dispatchToRedux(PUPILS_SELECTED, this.selectedPupil);
    }

    /**
     * Function edit pupil
     */
    editPupil(key: string) {

        this.helperService.dispatchToRedux(SHOW_PUPIL_MODAL, true);
        this.helperService.dispatchToRedux(SET_PUPIL_MODAL_TYPE, {
            type: 'editPupil',
            data: key
        });

        const pupil = this.helperService.findObjectInArray(this.pupils, '$key', key);

        if (pupil) {
            const pupilVal: PupilData = {
                id: pupil['id'] ? pupil['id'] : '',
                first_name: pupil['first_name'] ? pupil['first_name'] : '',
                last_name: pupil['last_name'] ? pupil['last_name'] : '',
                avatar_name: pupil['avatar_name'] ? pupil['avatar_name'] : '',
                avatar_url: pupil['avatar_url'] ? pupil['avatar_url'] : '',
                father_mobile: pupil['father_mobile'] ? pupil['father_mobile'] : '',
                mother_mobile: pupil['mother_mobile'] ? pupil['mother_mobile'] : '',
                date_of_birth: pupil['date_of_birth'] ? pupil['date_of_birth'] : '',
                home_address: pupil['home_address'] ? pupil['home_address'] : '',
                allergies: pupil['allergies'] ? pupil['allergies'] : '',
                blood_group: pupil['blood_group'] ? pupil['blood_group'] : '',
                group_class: (pupil['group_class'] && pupil['group_class'] !== '') ? pupil['group_class']['$key'] : '',
                meal: pupil['meal'] ? pupil['meal'] : '',
                tutor: pupil['tutor'] ? pupil['tutor'] : '',
                sex: pupil['sex'] ? pupil['sex'] : '',
                status: pupil['status'] ? pupil['status'] : 1,
                created_at: pupil['created_at'] ? pupil['created_at'] : 0,
                updated_at: pupil['updated_at'] ? pupil['updated_at'] : 0,
            }

            this.helperService.dispatchToRedux(SET_PUPIL_KEY_FOR_EDIT, pupil['$key']);
            this.helperService.dispatchToRedux(SET_PUPIL_VAL, pupilVal);
        }

    }

    /**
     * Function show confirm delete pupil
     */
    deletePupil(key: string) {

        this.confirmationService.confirm({
            message: this.translate.instant('CONFIRM_DELETE_PUPIL'),
            accept: () => {
                this.removePupil(key);
            }
        });

    }

    /**
     * Function delete pupil
     */
    async removePupil(key: string) {

        try {

            // Get data of pupils
            const result = await this.firebaseService.getWhereKey('pupils', key);

            if (result.length > 0) {

                await this.firebaseService.deleteWhereKey('pupils', key);
                this.helperService.showMessage('success', this.translate.instant('SUCCESS'), this.translate.instant('DELETE_SUCCESS'));

                // Get pupils data again
                this.getPupilsData();

                // Delete old image if exists
                if (result[0]['avatar_name'] && result[0]['avatar_url'] && result[0]['avatar_name'] !== '' && result[0]['avatar_url'] !== '') {
                    const avatarFolder = this.dataConfig['avatarFolder'];
                    const filePath = `${avatarFolder}/${result[0]['avatar_name']}`;
                    this.uploadService.deleteImage(filePath);
                }

            } else {
                this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            }

        } catch (e) {
            this.helperService.showMessage('error', this.translate.instant('ERROR'), this.translate.instant('SOMETHING_WENT_WRONG'));
            console.log(e);
        }

    }

    /**
     * Get again pupils data after created or updated successfully
     */
    async getPupilsData() {
        try {
            let pupils = await this.firebaseService.get('pupils');
            pupils = await this.relationService.getRelationOfPupils(pupils);
            this.helperService.dispatchToRedux(PUPILS_DATA, pupils);
        } catch (e) {
            console.log(e);
        }
    }

    redirectToPupilDetail(id: string) {
        this.router.navigate(['pupil-detail', id]);
    }

    async changeAgent() {
        if (this.selectedAgent !== '') {
            try {
                this.groupsByAgent = await this.firebaseService.getWhere('groups', 'agent', this.selectedAgent);
            } catch (e) {
                console.log(e);
            }
        }
    }
}
