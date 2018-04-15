import {
  SET_ACTIVE_TASK_LIST,
} from '../actions/types';


const INITIAL_STATE = {
  task_list: [],
  selected_active_task: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ACTIVE_TASK_LIST: {
        return action.payload
    }
    default:
      return state;
  }
};
