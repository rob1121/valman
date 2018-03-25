import {
  SET_VALIDATION_ACTIVE_TASK,
  SET_VALIDATION_LIST,
} from '../actions/types';


const INITIAL_STATE = {
  list: [],
  active_task: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_VALIDATION_ACTIVE_TASK: {
      return {
        ...state,
        active_task: action.payload ? {
          ...state.active_task,
          ...action.payload
        } : {},
      }
    }
    case SET_VALIDATION_LIST: {
      return {
        ...state,
        list: action.payload,
      }
    }
    default:
      return state;
  }
};
