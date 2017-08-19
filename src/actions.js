import { ACTIONS } from './constants';
import { actionTypeBuilder } from './utils';


/**
 * Dispatched before `from` promise is generated.
 *
 * @param {string[]} location
 * @return {Object}
 */
export function request(location) {
  return {
    type: actionTypeBuilder(location, ACTIONS.REQUEST),
    location,
  };
}

/**
 * Dispatched if `from` promise rejects.
 *
 * @param {string[]} location
 * @param {any} error
 * @return {Object}
 */
export function failure(location, error) {
  return {
    type: actionTypeBuilder(location, ACTIONS.FAILURE),
    location,
    error,
  };
}

/**
 * Dispatched if `from` promise resolves.
 *
 * @param {string[]} location
 * @param {any} data
 * @return {Object}
 */
export function success(location, data) {
  return {
    type: actionTypeBuilder(location, ACTIONS.SUCCESS),
    location,
    data,
  };
}
