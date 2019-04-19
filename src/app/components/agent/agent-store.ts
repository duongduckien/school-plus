import { tassign } from 'tassign';
import * as action_name from '../../common/actions';

// Interfaces
import { AgentValue } from '../../interfaces/agent.interface';

export interface AgentState {
    showAgentModal: boolean;
    agentModalType: any;
    agentData: any;
    textSearchAgent: string;
    agentVal: AgentValue;
    grantAccessOfAgent: any;
}

export const AGENT_INITAL_STATE: AgentState = {
    showAgentModal: false,
    agentModalType: {},
    agentData: [],
    textSearchAgent: '',
    agentVal: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        rePassword: '',
        key: ''
    },
    grantAccessOfAgent: []
};

function showAgentModal(state, action) {
    return tassign(state, {
        showAgentModal: action.payload
    });
}

function setAgentModalType(state, action) {
    return tassign(state, {
        agentModalType: action.payload
    });
}

function getAgentsData(state, action) {
    return tassign(state, {
        agentData: action.payload
    });
}

function searchAgent(state, action) {
    return tassign(state, {
        textSearchAgent: action.payload
    });
}

function setAgentValue(state, action) {
    return tassign(state, {
        agentVal: action.payload
    });
}

function setGrantAccessOfAgent(state, action) {
    return tassign(state, {
        grantAccessOfAgent: action.payload
    });
}

export function agentReducer(state = AGENT_INITAL_STATE, action): AgentState {

    switch (action.type) {
        case action_name.SHOW_AGENT_MODAL: return showAgentModal(state, action);
        case action_name.SET_AGENT_MODAL_TYPE: return setAgentModalType(state, action);
        case action_name.AGENTS_DATA: return getAgentsData(state, action);
        case action_name.SEARCH_AGENT: return searchAgent(state, action);
        case action_name.SET_AGENT_VAL: return setAgentValue(state, action);
        case action_name.SET_GRANT_ACCESS_AGENT: return setGrantAccessOfAgent(state, action);
    }

    return state;

};
