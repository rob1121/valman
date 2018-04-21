import {
  ASSIGN_CARS,
  UPDATE_ACTIVE_CAR,
  HAS_ACTIVE_CAR
} from './types';

export const assignCars = payload => ({ type: ASSIGN_CARS, payload });
export const updateActiveCar = payload => ({ type: UPDATE_ACTIVE_CAR, payload });
export const HASaCTIVEcAR = payload => ({ type: HAS_ACTIVE_CAR, payload });
