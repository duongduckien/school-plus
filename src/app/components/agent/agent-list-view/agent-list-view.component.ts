import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Redux
import { select } from '@angular-redux/store';
import { SET_AGENT_MODAL_TYPE, SHOW_AGENT_MODAL, SET_AGENT_VAL, SET_GRANT_ACCESS_AGENT, AGENTS_DATA } from '../../../common/actions';

// Interfaces
import { AgentData, AgentValue } from '../../../interfaces/agent.interface';

// Services
import { HelperService } from '../../../services/helper/helper.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';

@Component({
    selector: 'app-agent-list-view',
    templateUrl: './agent-list-view.component.html',
    styleUrls: ['./agent-list-view.component.scss']
})
export class AgentListViewComponent implements OnInit {

    @select() agent;

    public agents: AgentData[] = [];
    public searchText: string = '';
    public fieldsort: string = '';
    public isDesc: boolean = false;
    public direction: number;

    constructor(
        public translate: TranslateService,
        public helperService: HelperService,
        public firebaseService: FirebaseService
    ) {

        this.agent.subscribe(data => {
            this.agents = data.agentData;
            this.searchText = data.textSearchAgent;
        });

    }

    ngOnInit() {
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
     * Function edit agent
     */
    editAgent(key: string) {

        this.helperService.dispatchToRedux(SHOW_AGENT_MODAL, true);
        this.helperService.dispatchToRedux(SET_AGENT_MODAL_TYPE, {
            type: 'editAgent',
            data: key
        });

        const agent = this.helperService.findObjectInArray(this.agents, '$key', key);

        if (agent) {
            const agentVal: AgentValue = {
                firstName: agent['first_name'],
                lastName: agent['last_name'],
                email: agent['email'],
                phoneNumber: agent['phone_number'],
                password: agent['password'],
                rePassword: agent['password'],
                key: agent['$key']
            }

            if (agent['grant_access'] && agent['grant_access'] !== '') {
                const grantAccessArr = this.helperService.convertGrantAccess('get', agent['grant_access']);
                this.helperService.dispatchToRedux(SET_GRANT_ACCESS_AGENT, grantAccessArr);
            } else {
                this.helperService.dispatchToRedux(SET_GRANT_ACCESS_AGENT, []);
            }

            this.helperService.dispatchToRedux(SET_AGENT_VAL, agentVal);
        }

    }

    /**
     * Function delete agent
     */
    async deleteAgent(key: string) {

        try {

            if (confirm(this.translate.instant('CONFIRM_DELETE_AGENT'))) {

                // Get agent for delete
                const agent = this.helperService.findObjectInArray(this.agents, '$key', key);

                // Delete account in firebase
                const resultDeleteAccount = await this.firebaseService.deleteAccount(agent['email'], agent['password']);

                if (resultDeleteAccount) {
                    this.firebaseService.deleteWhereKey('agents', agent['$key']);
                }

                // Get agents data after insert success
                const agentsData = await this.firebaseService.get('agents');
                this.helperService.dispatchToRedux(AGENTS_DATA, agentsData);

            }

        } catch (e) {
            console.log(e);
        }

    }

}
