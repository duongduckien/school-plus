import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Redux
import { select } from '@angular-redux/store';
import { SHOW_PUPIL_MODAL, PUPILS_DATA, SET_PUPIL_KEY_FOR_EDIT, SET_PUPIL_VAL } from '../../../common/actions';

// Services
import { HelperService } from '../../../services/helper/helper.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { UploadService } from '../../../services/upload/upload.service';
import { RelationService } from '../../../services/relation/relation.service';

// Interfaces
import { PupilData } from '../../../interfaces/pupil.interface';

@Component({
    selector: 'app-pupil-modal',
    templateUrl: './pupil-modal.component.html',
    styleUrls: ['./pupil-modal.component.scss']
})
export class PupilModalComponent implements OnInit {

    @select() pupil;
    @select() common;

    public dataConfig: any;
    public showPupilModal: boolean;
    public pupilModalType: any;
    public errorMsg: string = '';
    public successMsg: string = '';
    public addAvatar: any;
    public bloodGroup: any = [];
    public sex: any = [];
    public meals: any = [];
    public listGroups: any = [];
    public pupilKeyForEdit: string = '';
    public pupilVal: PupilData = {
        id: '',
        first_name: '',
        last_name: '',
        avatar_name: '',
        avatar_url: '',
        father_mobile: '',
        mother_mobile: '',
        date_of_birth: '',
        home_address: '',
        allergies: '',
        blood_group: '',
        group_class: '',
        meal: '',
        tutor: '',
        sex: '',
        status: 1,
        created_at: 0,
        updated_at: 0
    }

    constructor(
        public helperService: HelperService,
        public translate: TranslateService,
        public firebaseService: FirebaseService,
        public uploadService: UploadService,
        public relationService: RelationService
    ) {

        this.pupil.subscribe(data => {
            this.showPupilModal = data.showPupilModal;
            this.pupilModalType = data.pupilModalType;
            this.pupilVal = data.pupilVal;
            this.pupilKeyForEdit = data.pupilKeyEdit;
        });

        this.common.subscribe(data => {
            this.dataConfig = data['globalConfig'];
            this.bloodGroup = data['globalConfig']['bloodGroup'];
            this.sex = data['globalConfig']['sex'];
            this.meals = data['globalConfig']['meals'];
        });

    }

    ngOnInit() {
        this.setListGroups();
    }

    /**
     * Function set list groups
     */
    async setListGroups() {

        try {

            const result = await this.firebaseService.get('groups');

            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    this.listGroups.push({
                        label: result[i]['group_name'],
                        value: result[i]['$key']
                    });
                }
            }

        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Function validate pupil
     */
    validatePupil() {

        this.errorMsg = '';
        this.successMsg = '';

        if (this.pupilVal.id.toString().trim() === '') {
            this.errorMsg = this.translate.instant('ID_REQUIRED');
        } else if (this.helperService.isNumber(this.pupilVal.id.toString().trim())) {
            this.errorMsg = this.translate.instant('ID_NUMBER');
        } else if (this.pupilVal.first_name.trim() === '') {
            this.errorMsg = this.translate.instant('FIRSTNAME_REQUIRED');
        } else if (this.pupilVal.last_name.trim() === '') {
            this.errorMsg = this.translate.instant('LASTNAME_REQUIRED');
        } else if (this.pupilVal.group_class.trim() === '') {
            this.errorMsg = this.translate.instant('GROUP_CLASS_REQUIRED');
        } else {

            switch (this.pupilModalType['type']) {
                case 'addPupil': {
                    this.addPupil();
                    break;
                }
                case 'editPupil': {
                    this.editPupil();
                    break;
                }
                default:
                    break;
            }

        }

    }

    /**
     * Function add pupil
     */
    async addPupil() {

        try {

            const idExist = await this.checkIdDuplicated();

            if (!idExist) {

                // If user selected avatar
                if (this.addAvatar) {

                    const nameOfFile = this.helperService.getFileName(this.addAvatar);

                    // Upload avatar
                    const resultUpload = await this.uploadService.uploadAvatar(this.addAvatar, nameOfFile);

                    // Upload avatar success
                    if (resultUpload['status'] === 'Success') {

                        this.pupilVal.avatar_name = nameOfFile;
                        this.pupilVal.avatar_url = resultUpload['url'];
                        this.pupilVal.created_at = new Date().getTime();
                        await this.firebaseService.insert('pupils', this.pupilVal);
                        this.successMsg = this.translate.instant('ADD_SUCCESS');
                        this.resetData();

                        // Get pupils data again
                        this.getPupilsData();

                    } else {
                        this.errorMsg = this.translate.instant('SOMETHING_WENT_WRONG');
                    }

                } else {

                    // Create new pupil without avatar
                    this.pupilVal.created_at = new Date().getTime();
                    await this.firebaseService.insert('pupils', this.pupilVal);
                    this.successMsg = this.translate.instant('ADD_SUCCESS');
                    this.resetData();

                    // Get pupils data again
                    this.getPupilsData();

                }

            } else {
                this.errorMsg = this.translate.instant('ID_DUPLICATED');
            }

        } catch (e) {
            this.errorMsg = this.translate.instant('SOMETHING_WENT_WRONG');
            console.log(e);
        }

    }

    /**
     * Function edit pupil
     */
    async editPupil() {

        try {

            // If user selected avatar
            if (this.addAvatar) {

                const nameOfFile = this.helperService.getFileName(this.addAvatar);

                // Upload avatar
                const resultUpload = await this.uploadService.uploadAvatar(this.addAvatar, nameOfFile);

                // Upload avatar success
                if (resultUpload['status'] === 'Success') {

                    // Delete old image if exists
                    if (this.pupilVal['avatar_name'] !== '' && this.pupilVal['avatar_url'] !== '') {
                        const avatarFolder = this.dataConfig['avatarFolder'];
                        const filePath = `${avatarFolder}/${this.pupilVal['avatar_name']}`;
                        this.uploadService.deleteImage(filePath);
                    }

                    // Update pupil with avatar
                    await this.firebaseService.updateWhereKey('pupils', this.pupilKeyForEdit, {
                        allergies: this.pupilVal['allergies'],
                        blood_group: this.pupilVal['blood_group'],
                        created_at: (this.pupilVal.created_at) ? this.pupilVal.created_at : new Date().getTime(), // If this record wasn't having 'created_at' field. It only use for old data
                        date_of_birth: this.pupilVal['date_of_birth'],
                        father_mobile: this.pupilVal['father_mobile'],
                        first_name: this.pupilVal['first_name'],
                        group_class: this.pupilVal['group_class'],
                        home_address: this.pupilVal['home_address'],
                        last_name: this.pupilVal['last_name'],
                        sex: this.pupilVal['sex'],
                        meal: this.pupilVal['meal'],
                        mother_mobile: this.pupilVal['mother_mobile'],
                        tutor: this.pupilVal['tutor'],
                        updated_at: new Date().getTime(),
                        avatar_name: nameOfFile,
                        avatar_url: resultUpload['url']
                    });

                    this.successMsg = this.translate.instant('UPDATE_SUCCESS');
                    this.resetData();

                    // Get pupils data again
                    this.getPupilsData();

                } else {
                    this.errorMsg = this.translate.instant('SOMETHING_WENT_WRONG');
                }

            } else {

                // Update pupil without avatar
                await this.firebaseService.updateWhereKey('pupils', this.pupilKeyForEdit, {
                    allergies: this.pupilVal['allergies'],
                    blood_group: this.pupilVal['blood_group'],
                    created_at: (this.pupilVal.created_at) ? this.pupilVal.created_at : new Date().getTime(), // If this record wasn't having created_at. It only use for old data
                    date_of_birth: this.pupilVal['date_of_birth'],
                    father_mobile: this.pupilVal['father_mobile'],
                    first_name: this.pupilVal['first_name'],
                    group_class: this.pupilVal['group_class'],
                    home_address: this.pupilVal['home_address'],
                    last_name: this.pupilVal['last_name'],
                    sex: this.pupilVal['sex'],
                    meal: this.pupilVal['meal'],
                    mother_mobile: this.pupilVal['mother_mobile'],
                    tutor: this.pupilVal['tutor'],
                    updated_at: new Date().getTime()
                });

                this.successMsg = this.translate.instant('UPDATE_SUCCESS');
                this.resetData();

                // Get pupils data again
                this.getPupilsData();

            }

        } catch (e) {
            this.errorMsg = this.translate.instant('SOMETHING_WENT_WRONG');
            console.log(e);
        }

    }

    /**
     * Function check ID duplicate
     */
    async checkIdDuplicated() {

        let idExist: boolean = false;

        try {

            const pupilsData = await this.firebaseService.get('pupils');

            // Check id exist
            if (pupilsData.length > 0) {
                for (let i = 0; i < pupilsData.length; i++) {
                    if (pupilsData[i].id === this.pupilVal.id.trim()) {
                        idExist = true;
                        break;
                    }
                }
            }

        } catch (e) {
            console.log(e);
        } finally {
            return idExist;
        }

    }

    /**
     * Function upload avatar
     */
    uploadAvatar($event) {

        const input = $event.target;

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.pupilVal.avatar_url = reader.result;
            }
            reader.readAsDataURL(input.files[0]);
        }

        this.addAvatar = $event.target.files[0];

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

    /**
     * Function hide modal
     */
    cancelModal() {
        this.helperService.dispatchToRedux(SHOW_PUPIL_MODAL, false);
        this.resetForm();
    }

    /**
     * Function reset form
     */
    resetForm() {
        this.addAvatar = null;
        this.errorMsg = '';
        this.successMsg = '';
        this.helperService.dispatchToRedux(SET_PUPIL_KEY_FOR_EDIT, '');
        this.helperService.dispatchToRedux(SET_PUPIL_VAL, {
            id: '',
            first_name: '',
            last_name: '',
            avatar_name: '',
            avatar_url: '',
            father_mobile: '',
            mother_mobile: '',
            date_of_birth: '',
            home_address: '',
            allergies: '',
            blood_group: '',
            group_class: '',
            meal: '',
            tutor: '',
            sex: '',
            status: 1,
            created_at: 0,
            updated_at: 0
        });
    }

    /**
     * Function reset data
     */
    resetData() {
        setTimeout(() => {
            this.cancelModal();
            this.resetForm();
        }, 1500);
    }

}
