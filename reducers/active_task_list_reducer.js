import {
  SET_SELECTED_ACTIVE_TASK,
  SET_ACTIVE_TASK_LIST,
} from '../actions/types';


const INITIAL_STATE = {
  task_list: [],
  selected_active_task: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SELECTED_ACTIVE_TASK: {
      return {
        ...state,
        active_task: action.payload ? {
          ...state.active_task,
          ...action.payload
        } : {},
      }
    }
    case SET_ACTIVE_TASK_LIST: {
      return {
        ...state,
        list: action.payload,
      }
    }
    default:
      return state;
  }
};
