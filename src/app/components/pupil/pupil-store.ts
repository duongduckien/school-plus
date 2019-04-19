import { tassign } from 'tassign';
import * as action_name from '../../common/actions';

// Interfaces
import { PupilData } from '../../interfaces/pupil.interface';

export interface PupilState {
    pupilsData: any;
    textSearchPupil: string;
    showPupilModal: boolean;
    pupilModalType: any;
    pupilsSelected: any;
    pupilVal: PupilData;
    pupilKeyEdit: string;
}

export const PUPIL_INITAL_STATE: PupilState = {
    pupilsData: [],
    textSearchPupil: '',
    showPupilModal: false,
    pupilModalType: {},
    pupilsSelected: [],
    pupilVal: {
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
        updated_at: 0.
    },
    pupilKeyEdit: ''
};

function getPupilsData(state, action) {
    return tassign(state, {
        pupilsData: action.payload
    });
}

function searchPupil(state, action) {
    return tassign(state, {
        textSearchPupil: action.payload
    });
}

function showPupilModal(state, action) {
    return tassign(state, {
        showPupilModal: action.payload
    });
}

function setPupilModalType(state, action) {
    return tassign(state, {
        pupilModalType: action.payload
    });
}

function getPupilsSelected(state, action) {
    return tassign(state, {
        pupilsSelected: action.payload
    });
}

function setPupilValue(state, action) {
    return tassign(state, {
        pupilVal: action.payload
    });
}

function setPupilKeyForEdit(state, action) {
    return tassign(state, {
        pupilKeyEdit: action.payload
    });
}


export function pupilReducer(state = PUPIL_INITAL_STATE, action): PupilState {

    switch (action.type) {
        case action_name.PUPILS_DATA: return getPupilsData(state, action);
        case action_name.PUPIL_SEARCH: return searchPupil(state, action);
        case action_name.SHOW_PUPIL_MODAL: return showPupilModal(state, action);
        case action_name.SET_PUPIL_MODAL_TYPE: return setPupilModalType(state, action);
        case action_name.PUPILS_SELECTED: return getPupilsSelected(state, action);
        case action_name.SET_PUPIL_VAL: return setPupilValue(state, action);
        case action_name.SET_PUPIL_KEY_FOR_EDIT: return setPupilKeyForEdit(state, action);
    }

    return state;

};
