import {
  SET_IMAGES,
} from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_IMAGES: {
      return action.payload;
    }
    default:
      return state;
  }
};
