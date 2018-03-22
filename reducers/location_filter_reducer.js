import {
  SET_SELECTED_LOCATION,
} from '../actions/types';


const INITIAL_STATE = '';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SELECTED_LOCATION: {
      return action.payload;
    }
    default:
      return state;
  }
};
