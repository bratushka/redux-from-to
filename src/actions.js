import { ACTIONS } from './constants';
import { actionTypeBuilder } from './utils';


/**
 * Dispatched before `from` promise is generated.
 *
 * @param {undefined} _data
 * @param {string[]} requestTarget
 * @param {string[]} errorTarget
 * @param {undefined} dataTarget
 * @return {Object}
 */
export function request(_data, requestTarget, errorTarget, dataTarget) {
  return {
    type: actionTypeBuilder(dataTarget, ACTIONS.REQUEST),
    requestTarget,
    errorTarget,
  };
}

/**
 * Dispatched if `from` promise rejects.
 *
 * @param {any} data
 * @param {string[]} requestTarget
 * @param {string[]} errorTarget
 * @param {string[]} dataTarget
 * @return {Object}
 */
export function failure(data, requestTarget, errorTarget, dataTarget) {
  return {
    type: actionTypeBuilder(dataTarget, ACTIONS.FAILURE),
    data,
    requestTarget,
    errorTarget,
    dataTarget,
  };
}

/**
 * Dispatched if `from` promise resolves.
 *
 * @param {any} data
 * @param {string[]} requestTarget
 * @param {undefined} _errorTarget
 * @param {string[]} dataTarget
 * @return {Object}
 */
export function success(data, requestTarget, _errorTarget, dataTarget) {
  return {
    type: actionTypeBuilder(dataTarget, ACTIONS.SUCCESS),
    data,
    requestTarget,
    dataTarget,
  };
}
