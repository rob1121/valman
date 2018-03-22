import {SET_CAR_INFO, RESET_CAR_INFO} from './types';

export const setCarInfo = payload =>  ({ type: SET_CAR_INFO, payload });
export const resetCarInfo = payload =>  ({ type: RESET_CAR_INFO, payload });