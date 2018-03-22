import { combineReducers } from 'redux';
import user from './user_reducer';
import car_assign from './car_assign_reducer';
import selected_location from './location_filter_reducer';
import nav from './navigation_reducer';
import car from './car_info_reducer';
import error from './error_reducer';
import validation_list from './validation_list_reducer';

export default combineReducers({
  user, car, car_assign, selected_location, nav, error, validation_list
});
