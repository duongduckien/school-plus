import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Redux
import { SHOW_AGENT_MODAL, SET_AGENT_MODAL_TYPE, AGENTS_DATA, SEARCH_AGENT } from '../../common/actions';

// Services
import { FirebaseService } from '../../services/firebase/firebase.service';
import { HelperService } from '../../services/helper/helper.service';

@Component({
    selector: 'app-agent',
    templateUrl: './agent.component.html',
    styleUrls: ['./agent.component.scss'],
})
export class AgentComponent implements OnInit {

    public searchText: string = '';

    constructor(
        public helperService: HelperService,
        public firebaseService: FirebaseService,
        public router: Router
    ) {

        if (!this.helperService.checkPermissionAccess('agents')) {
            this.router.navigate(['/']);
        }

    }

    ngOnInit() {
        this.helperService.showLoading();
        this.getAgents();
    }

    /**
     * Function get all agents
     */
    async getAgents() {

        try {

            const result = await this.firebaseService.get('agents');
            this.helperService.dispatchToRedux(AGENTS_DATA, result);
            this.helperService.hideLoading();

        } catch (e) {
            this.helperService.hideLoading();
            console.log(e);
        }

    }

    /**
     *  Function show or hide modal for add agent
     */
    showModalPopup() {
        this.helperService.dispatchToRedux(SHOW_AGENT_MODAL, true);
        this.helperService.dispatchToRedux(SET_AGENT_MODAL_TYPE, {
            type: 'addAgent',
            data: ''
        });
    }

    /**
     * Function search text
     */
    onChangeAgentSearch(event) {
        this.helperService.dispatchToRedux(SEARCH_AGENT, event);
    }

}
