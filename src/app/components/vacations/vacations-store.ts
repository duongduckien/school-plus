import { tassign } from 'tassign';
import * as action_name from '../../common/actions';

export interface VacationsState {
    vacationsData: any;
}

export const VACATIONS_INITAL_STATE: VacationsState = {
    vacationsData: []
};

function getVacationsData(state, action) {
    return tassign(state, {
        vacationsData: action.payload
    });
}

export function vacationsReducer(state = VACATIONS_INITAL_STATE, action): VacationsState {

    switch (action.type) {
        case action_name.VACATIONS_DATA: return getVacationsData(state, action);
    }

    return state;

};
