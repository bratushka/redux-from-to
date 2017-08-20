import values from 'lodash.values';

import { request, failure, success } from './actions';
import { checkTarget } from './utils';


export function defaultErrorAdapter(error) {
  return error;
}

export function defaultDataAdapter(data) {
  return data;
}

export function carrier(
  from,
  to,
  {
    _errorAdapter = defaultErrorAdapter,
    _dataAdapter = defaultDataAdapter,
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
      resolved => dispatch(success(resolved, ...targetArgs)),
      rejected => dispatch(failure(rejected, ...targetArgs)),
    );
  };
}
