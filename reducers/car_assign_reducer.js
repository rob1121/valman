import {
  ASSIGN_CARS,
  UPDATE_ACTIVE_CAR
} from '../actions/types';


const INITIAL_STATE = {
  has_active_task: false,
  active_task: {},
  task_list: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ASSIGN_CARS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case UPDATE_ACTIVE_CAR: {
      return {
        ...state,
        active_task: {
          ...state.active_task,
          ...action.payload,
        },
      };
    }
    default:
      return state;
  }
};
