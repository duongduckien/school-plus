import { combineReducers } from 'redux';
import { CommonState, COMMON_INITAL_STATE, commonReducer } from './common/store';
import { AgentState, AGENT_INITAL_STATE, agentReducer } from './components/agent/agent-store';
import { VacationsState, VACATIONS_INITAL_STATE, vacationsReducer } from './components/vacations/vacations-store';
import { PupilState, PUPIL_INITAL_STATE, pupilReducer } from './components/pupil/pupil-store';
import { StatusState, STATUS_INITAL_STATE, statusReducer } from './components/status/status-store';

export interface IAppState {
    common: CommonState;
    agent: AgentState;
    vacations: VacationsState;
    pupil: PupilState;
    statusStore: StatusState;
}

export const INITIAL_STATE: IAppState = {
    common: COMMON_INITAL_STATE,
    agent: AGENT_INITAL_STATE,
    vacations: VACATIONS_INITAL_STATE,
    pupil: PUPIL_INITAL_STATE,
    statusStore: STATUS_INITAL_STATE
};

export const rootReducer = combineReducers<IAppState>({
    common: commonReducer,
    agent: agentReducer,
    vacations: vacationsReducer,
    pupil: pupilReducer,
    statusStore: statusReducer
});

