import {
  SET_USER,
  LOGOUT_USER,
  SET_PASSWORD,
  SET_USERNAME,
} from '../actions/types';


const INITIAL_STATE = {
  username: '',
  password: '',
  name: '',
  id: -1,
  category: '',
  type: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case LOGOUT_USER: {
      return INITIAL_STATE;
    }
    case SET_USERNAME: {
      return {
        ...state,
        username: action.payload,
      };
    }
    case SET_PASSWORD: {
      return {
        ...state,
        password: action.payload,
      };
    }
    default:
      return state;
  }
};
