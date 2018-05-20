import {ROOT_URL} from '../constants';

export const generateImagePath = path => {
  let uri = `${ROOT_URL}/`;
  uri += path;
  uri += '?random_number=' + (new Date()).getTime();

  return uri;
}