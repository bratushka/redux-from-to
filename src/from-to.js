import Immutable from 'immutable';
import values from 'lodash.values';

import { request, failure, success } from './actions';
import { checkTarget } from './utils';


/**
 * Error adapter suiting axios library.
 *
 * @param {Error} error
 * @param {Object} _state
 * @return {Object}
 */
export function defaultErrorAdapter(error, _state) {
  return Immutable.fromJS({
    status: error.response ? error.response.status : 'panic',
    data: error.response ? error.response.data : String(error),
  });
}

/**
 * Data adapter suiting axios library.
 *
 * @param {Object} response
 * @param {Object} _state
 * @return {any}
 */
export function defaultResponseAdapter(response, _state) {
  return Immutable.fromJS(response.data);
}

/**
 * Transforms `to` argument into object suitable for `fromTo`.
 *
 * @param {Object|string[]} to
 * @return {Object}
 */
export function targetTransformer(to) {
  return Array.isArray(to) ? {
    request: [...to, 'isRequesting'],
    failure: [...to, 'error'],
    success: [...to, 'data'],
  } : to;
}

/**
 * Action creator to be dispatched. Waits for info from `from`, stores to `to` through `through`.
 *
 * @param {function(): Promise} from
 * @param {Object|string[]} to
 * @param {?Object} through
 * @param {?function} through.errorAdapter
 * @param {?function} through.responseAdapter
 * @param {?Object} options
 * @param {?function} options.action - the only action to be dispatched
 * @return {?function(dispatch: function, getState: function): Promise}
 * @throws {Error}
 */
export function fromTo(
  from,
  to,
  {
    errorAdapter = defaultErrorAdapter,
    responseAdapter = defaultResponseAdapter,
  } = {},
  {
    action,
  } = {},
) {
  const targets = targetTransformer(to);

  return (dispatch, getState) => {
    const state = getState();
    values(targets).forEach(target => checkTarget(state, target));

    const targetArgs = [targets.request, targets.failure, targets.success];

    if (action === undefined || action === request) {
      dispatch(request(undefined, ...targetArgs));
    }

    return from().then(
      resolved => {
        if (action === undefined || action === success) {
          return dispatch(success(responseAdapter(resolved, state), ...targetArgs));
        }
      },
      rejected => {
        if (action === undefined || action === failure) {
          return dispatch(failure(errorAdapter(rejected, state), ...targetArgs));
        }
      },
    );
  };
}
