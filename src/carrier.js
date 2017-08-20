import Immutable from 'immutable';
import values from 'lodash.values';

import { request, failure, success } from './actions';
import { checkTarget } from './utils';


/**
 * Error adapter suiting axios library.
 *
 * @param {Error} error
 * @return {Object}
 */
export function defaultErrorAdapter(error) {
  return Immutable.fromJS({
    status: error.response ? error.response.status : 'panic',
    data: error.response ? error.response.data : String(error),
  });
}

/**
 * Data adapter suiting axios library.
 *
 * @param {Object} response
 * @return {any}
 */
export function defaultDataAdapter(response) {
  return Immutable.fromJS(response.data);
}

/**
 * Action creator to be dispatched. Waits for info from `from`, stores to `to` through `through`.
 *
 * @param {function(): Promise} from
 * @param {Object|string[]} to
 * @param {?Object} through
 * @param {?function} through.errorAdapter
 * @param {?function} through.dataAdapter
 * @return {?function(dispatch: function, getState: function): Promise}
 * @throws {Error}
 */
export function carrier(
  from,
  to,
  {
    errorAdapter = defaultErrorAdapter,
    dataAdapter = defaultDataAdapter,
  } = {},
) {
  const targets = Array.isArray(to) ? {
    request: [...to, 'isRequesting'],
    error: [...to, 'error'],
    success: [...to, 'data'],
  } : to;

  return (dispatch, getState) => {
    values(targets).forEach(target => checkTarget(getState(), target));

    const targetArgs = [targets.request, targets.failure, targets.success];
    dispatch(request(undefined, ...targetArgs));

    return from().then(
      resolved => dispatch(success(dataAdapter(resolved), ...targetArgs)),
      rejected => dispatch(failure(errorAdapter(rejected), ...targetArgs)),
    );
  };
}
