import {Dimensions} from 'react-native';

export const MAIN_COLOR = '#3b5999';
export const ALL_INDEX = -1;
export const WIN_WIDTH = Dimensions.get('window').width;
export const WIN_HEIGHT = Dimensions.get('window').height;

//export const ROOT_URL = 'http://beachfrontparking.com';
//export const ROOT_URL = 'http://192.168.1.6/beach_front_parking';

export const ROOT_URL = 'http://99.122.157.77/beach_front_parking';
export const REGISTER_TOKEN_URL = `${ROOT_URL}/api/register_token.php`;
export const LOGIN_URL = `${ROOT_URL}/api/login.php`;
export const LOGOUT_URL = `${ROOT_URL}/api/logout.php`;
export const CAR_ASSIGN_URL = `${ROOT_URL}/api/car_assignment.php`;
export const PARKING_STATUS_UPDATE_URL = `${ROOT_URL}/api/parking_status_update.php`;
export const LOCATION_FILTER_URL = `${ROOT_URL}/api/location_filter.php`;
export const ADD_CAR_URL = `${ROOT_URL}/api/ramp_add_car.php`;
export const CAR_LIST_URL = `${ROOT_URL}/api/car_list.php`;
export const DEFAULT_IMG = `upload/default.png`;
export const IMG_API_URL = `${ROOT_URL}/api/upload.php`;
export const REMOVE_IMG_URL = `${ROOT_URL}/api/remove_image.php`;
export const SEARCH_TICKET_URL = `${ROOT_URL}/api/search_ticket.php`;
export const SEARCH_MONTHLY_USER_URL = `${ROOT_URL}/api/search_monthly_user.php`;
export const VALIDATION_LIST_URL = `${ROOT_URL}/api/validation_list.php`;
export const UPDATE_VALIDATION_TASK_URL = `${ROOT_URL}/api/update_validation_task.php`;
export const ACTIVE_TASK_LIST_URL = `${ROOT_URL}/api/active_task_list.php`;

export const ACTIVE_SCREEN_COLOR = '#222';
export const NOT_ACTIVE_SCREEN_COLOR = '#757575';
export const DISABLE_SCREEN_COLOR = '#cccccc';

export const HOME_NAV = 'Home';
export const LOGIN_NAV = 'Login';
export const RAMP_ADD_CAR_NAV = 'RampAddCar';
export const ACTIVE_TASK_LIST_NAV = 'ActiveTaskList';


export const VALET_ON_THE_WAY = 2;
export const ARRIVED_AT_THE_GARAGE = 3;
export const VEHICLE_ON_THE_WAY = 4;
export const REQUEST_COMPLETED = 5;
export const WAITING_DISPATCHER = 9;
