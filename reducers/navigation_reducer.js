import {
  SET_ACTIVE_SCREEN,
  SET_NAVIGATION,
} from '../actions/types';


const INITIAL_STATE = {
  active_screen: 'Login',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_NAVIGATION: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case SET_ACTIVE_SCREEN: {
      return {
        ...state,
        active_screen: action.payload,
      };
    }
    default:
      return state;
  }
};
