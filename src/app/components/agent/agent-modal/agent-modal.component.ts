import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Redux
import { select } from '@angular-redux/store';
import { SHOW_AGENT_MODAL, AGENTS_DATA, SET_GRANT_ACCESS_AGENT, SET_AGENT_VAL } from '../../../common/actions';

// Services
import { HelperService } from '../../../services/helper/helper.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';

// Interfaces
import { AgentData, AgentValue } from '../../../interfaces/agent.interface';

@Component({
    selector: 'app-agent-modal',
    templateUrl: './agent-modal.component.html',
    styleUrls: ['./agent-modal.component.scss']
})
export class AgentModalComponent implements OnInit {

    @select() agent;
    @select() common;

    public dataConfig: any;
    public showAgentModal: boolean;
    public errorMsg: string = '';
    public successMsg: string = '';
    public agentModalType: any;
    public grantAccess: any = [];
    public grantValues: string[] = [];
    public agentVal: AgentValue = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        rePassword: '',
        key: ''
    };
    public typePassword: string = '';
    public typeRePassword: string = '';
    private minLengthPassword: number;
    private agentsData: any[] = [];

    constructor(
        public helperService: HelperService,
        public translate: TranslateService,
        public firebaseService: FirebaseService
    ) {

        this.agent.subscribe(data => {
            this.showAgentModal = data.showAgentModal;
            this.agentModalType = data.agentModalType;
            this.agentVal = data.agentVal;
            this.grantValues = data.grantAccessOfAgent;
            this.agentsData = data.agentData;
        });

        this.common.subscribe(data => {
            this.dataConfig = data['globalConfig'];
        });

    }

    ngOnInit() {
        this.typePassword = 'password';
        this.typeRePassword = 'password';
        this.getGrantAccess();
    }

    /**
     * Function get list all roles
     */
    async getGrantAccess() {
        try {
            this.grantAccess = await this.firebaseService.get('access');
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Function hide modal
     */
    cancelModal() {
        this.helperService.dispatchToRedux(SHOW_AGENT_MODAL, false);
        this.resetForm();
    }

    /**
     * Function validate agent
     */
    validateAgent() {

        this.errorMsg = '';
        this.successMsg = '';
        this.minLengthPassword = this.dataConfig['validate']['minLengthPassword'];

        if (this.agentVal.firstName.trim() === '') {
            this.errorMsg = this.translate.instant('FIRSTNAME_REQUIRED');
        } else if (this.agentVal.lastName.trim() === '') {
            this.errorMsg = this.translate.instant('LASTNAME_REQUIRED');
        } else if (this.agentVal.email.trim() === '') {
            this.errorMsg = this.translate.instant('EMAIL_REQUIRED');
        } else if (!this.helperService.isEmail(this.agentVal.email.trim())) {
            this.errorMsg = this.translate.instant('EMAIL_INVALID');
        } else if (this.agentVal.phoneNumber.trim() === '') {
            this.errorMsg = this.translate.instant('PHONE_NUMBER_REQUIRED');
        } else if (this.helperService.isPhoneNumber(this.agentVal.phoneNumber.trim())) {
            this.errorMsg = this.translate.instant('PHONE_NUMBER_MUST_NUMBER');
        } else if (this.agentVal.password.trim() === '') {
            this.errorMsg = this.translate.instant('PASSWORD_REQUIRED');
        } else if (this.agentVal.password.trim().length < this.minLengthPassword) {
            this.errorMsg = this.translate.instant('PASSWORD_MIN_LENGTH', { number: this.minLengthPassword });
        } else if (this.agentVal.password.trim() !== this.agentVal.rePassword.trim()) {
            this.errorMsg = this.translate.instant('PASSWORD_NOT_MATCH');
        } else {

            switch (this.agentModalType['type']) {
                case 'addAgent': {
                    this.addAgent();
                    break;
                }
                case 'editAgent': {
                    this.editAgent();
                    break;
                }
                default:
                    break;
            }

        }

    }

    /**
     * Function add agent
     */
    async addAgent() {

        try {

            const emails = await this.firebaseService.get('agents');
            let emailExist: boolean = false;

            // Check email exist
            if (emails.length > 0) {
                for (let i = 0; i < emails.length; i++) {
                    if (emails[i].email === this.agentVal.email.trim()) {
                        this.errorMsg = this.translate.instant('EMAIL_EXIST');
                        emailExist = true;
                        break;
                    }
                }
            }

            // Add agent
            if (!emailExist) {

                const agent: AgentData = {
                    create_at: new Date().getTime(),
                    first_name: this.agentVal.firstName.trim(),
                    last_name: this.agentVal.lastName.trim(),
                    email: this.agentVal.email.trim(),
                    phone_number: this.agentVal.phoneNumber.trim(),
                    password: this.agentVal.password.trim(),
                    role: 1,
                    status: 1,
                    update_at: 0,
                    grant_access: this.helperService.convertGrantAccess('insert', this.grantValues)
                }

                const result = await this.firebaseService.createAccount(this.agentVal.email.trim(), this.agentVal.password.trim());

                if (result === 'Success') {

                    await this.firebaseService.insert('agents', agent);
                    this.successMsg = this.translate.instant('ADD_SUCCESS');

                    // Get agents data after insert success
                    const agentsData = await this.firebaseService.get('agents');
                    this.helperService.dispatchToRedux(AGENTS_DATA, agentsData);

                    setTimeout(() => {
                        this.cancelModal();
                        this.resetForm();
                    }, 1500);

                } else {
                    this.errorMsg = this.translate.instant('SOMETHING_WENT_WRONG');
                }

            }

        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Function edit agent
     */
    async editAgent() {

        try {

            this.helperService.dispatchToRedux(SET_GRANT_ACCESS_AGENT, this.grantValues);

            const keyOfAgent = this.agentVal['key'];

            // Get old value of agent
            const oldValueAgent = this.helperService.findObjectInArray(this.agentsData, '$key', keyOfAgent);
            const oldEmail = oldValueAgent['email'];
            const oldPassword = oldValueAgent['password'];

            // Update new password
            if (oldPassword !== this.agentVal.password.trim()) {
                await this.firebaseService.updatePasswordForAccount(oldEmail, oldPassword, this.agentVal.password.trim());
            }

            const dataForUpdate = {
                create_at: new Date().getTime(),
                first_name: this.agentVal.firstName.trim(),
                last_name: this.agentVal.lastName.trim(),
                phone_number: this.agentVal.phoneNumber.trim(),
                password: this.agentVal.password.trim(),
                update_at: new Date().getTime(),
                grant_access: this.helperService.convertGrantAccess('insert', this.grantValues)
            }
            await this.firebaseService.updateWhereKey('agents', keyOfAgent, dataForUpdate);
            this.successMsg = this.translate.instant('UPDATE_SUCCESS');

            // Get agents data after insert success
            const agentsData = await this.firebaseService.get('agents');
            this.helperService.dispatchToRedux(AGENTS_DATA, agentsData);

            setTimeout(() => {
                this.cancelModal();
                this.resetForm();
            }, 1500);

        } catch (e) {
            this.errorMsg = this.translate.instant('SOMETHING_WENT_WRONG');
            console.log(e);
        }

    }

    /**
     * Function reset form
     */
    resetForm() {
        this.agentVal.firstName = '';
        this.agentVal.lastName = '';
        this.agentVal.email = '';
        this.agentVal.phoneNumber = '';
        this.agentVal.password = '';
        this.agentVal.rePassword = '';
        this.agentVal.key = '';
        this.errorMsg = '';
        this.successMsg = '';
        this.helperService.dispatchToRedux(SET_GRANT_ACCESS_AGENT, []);
        this.helperService.dispatchToRedux(SET_AGENT_VAL, this.agentVal);
    }

    /**
     * Function show value of input password
     */
    showPassword(type: string) {
        switch (type) {
            case 'password': {
                this.typePassword = 'text';
                setTimeout(() => {
                    this.typePassword = 'password'
                }, 500);
                break;
            }
            case 're-password': {
                this.typeRePassword = 'text';
                setTimeout(() => {
                    this.typeRePassword = 'password'
                }, 500);
                break;
            }
            default: {
                break;
            }
        }
    }

    /**
     * Function create data for grant access
     */
    createDataForGrantAccess() {

        const arrGrantAccess = [
            {
                id: 1,
                name: 'ATTENDANTS_REPORT'
            },
            {
                id: 2,
                name: 'PUPIL_MANAGEMENT'
            },
            {
                id: 3,
                name: 'PRE_AFTER_SCHOOL_REPORT'
            },
            {
                id: 4,
                name: 'MASTER_CODE'
            },
            {
                id: 5,
                name: 'AGENT_MANAGEMENT'
            }
        ];

        for (let i = 0; i < arrGrantAccess.length; i++) {
            this.firebaseService.insert('access', arrGrantAccess[i]);
        }

    }

}
