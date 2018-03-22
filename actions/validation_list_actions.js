import {
  SET_VALIDATION_ACTIVE_TASK,
  SET_VALIDATION_LIST,
} from '../actions/types';


export const setValidationActiveTask = payload => ({ type: SET_VALIDATION_ACTIVE_TASK, payload });
export const setValidationList = payload => ({ type: SET_VALIDATION_LIST, payload });