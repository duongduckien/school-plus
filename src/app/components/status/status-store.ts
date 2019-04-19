import { tassign } from 'tassign';
import * as action_name from '../../common/actions';

export interface StatusState {
    logsData: any;
    logsHeader: any;
    logsExcelData: any;
    logsExcelHeader: any;
}

export const STATUS_INITAL_STATE: StatusState = {
    logsData: [],
    logsHeader: [],
    logsExcelData: [],
    logsExcelHeader: []
};

function getLogsData(state, action) {
    return tassign(state, {
        logsData: action.payload
    });
}

function getLogsHeader(state, action) {
    return tassign(state, {
        logsHeader: action.payload
    });
}

function getLogsExcelData(state, action) {
    return tassign(state, {
        logsExcelData: action.payload
    });
}

function getLogsExcelHeader(state, action) {
    return tassign(state, {
        logsExcelHeader: action.payload
    });
}

export function statusReducer(state = STATUS_INITAL_STATE, action): StatusState {

    switch (action.type) {
        case action_name.LOGS_DATA: return getLogsData(state, action);
        case action_name.LOGS_HEADER: return getLogsHeader(state, action);
        case action_name.LOGS_EXCEL_DATA: return getLogsExcelData(state, action);
        case action_name.LOGS_EXCEL_HEADER: return getLogsExcelHeader(state, action);
    }

    return state;

};
