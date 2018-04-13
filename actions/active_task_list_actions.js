import {
  SET_SELECTED_ACTIVE_TASK,
  SET_ACTIVE_TASK_LIST,
} from './types';


export const setSelectedActiveTask = payload => ({type: SET_SELECTED_ACTIVE_TASK, payload});
export const setActiveTaskList = payload => ({type: SET_ACTIVE_TASK_LIST, payload});
