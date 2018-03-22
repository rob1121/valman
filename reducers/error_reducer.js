import {
  SET_ERRORS,
} from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ERRORS: {
      return action.payload;
    }
    default:
      return state;
  }
};
