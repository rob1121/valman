import {
  SET_ACTIVE_SCREEN,
  SET_NAVIGATION,
} from './types';

export const setActiveScreen = payload => ({ type: SET_ACTIVE_SCREEN, payload });
export const setNavigation = payload => ({ type: SET_NAVIGATION, payload });
