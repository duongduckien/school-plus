import { tassign } from 'tassign';
import * as action_name from './actions';

export interface CommonState {
    globalConfig: any;
    showLoading: boolean;
    message: any;
}

export const COMMON_INITAL_STATE: CommonState = {
    globalConfig: {},
    showLoading: false,
    message: []
};

function setGlobalConfig(state, action) {
    return tassign(state, {
        globalConfig: action.payload
    });
}

function showLoading(state, action) {
    return tassign(state, {
        showLoading: action.payload
    });
}

function showMessage(state, action) {
    return tassign(state, {
        message: action.payload
    });
}

export function commonReducer(state = COMMON_INITAL_STATE, action): CommonState {

    switch (action.type) {
        case action_name.GLOBAL_CONFIG: return setGlobalConfig(state, action);
        case action_name.SHOW_LOADING: return showLoading(state, action);
        case action_name.SHOW_MESSAGE: return showMessage(state, action);
    }

    return state;

};
