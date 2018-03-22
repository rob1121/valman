import {
  SET_USER,
  LOGOUT_USER,
  SET_PASSWORD,
  SET_USERNAME,
} from './types';

export const setUser = payload => ({ type: SET_USER, payload });
export const logoutUser = payload => ({ type: LOGOUT_USER, payload });
export const setPassword = payload => ({ type: SET_PASSWORD, payload });
export const setUsername = payload => ({ type: SET_USERNAME, payload });
