import { ACTIONS } from './constants';
import { actionTypeBuilder } from './utils';


export function request(location) {
  return {
    type: actionTypeBuilder(location, ACTIONS.REQUEST),
    location,
  };
}

export function failure(location, error) {
  return {
    type: actionTypeBuilder(location, ACTIONS.FAILURE),
    location,
    error,
  };
}

export function success(location, data) {
  return {
    type: actionTypeBuilder(location, ACTIONS.SUCCESS),
    location,
    data,
  };
}
