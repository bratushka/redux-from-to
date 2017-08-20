import values from 'lodash.values';

import { checkTarget } from './utils';


export function carrier(
  _from,
  to,
  {
    _errorAdapter = x => x,
    _dataAdapter = x => x,
  } = {},
) {
  const targets = Array.isArray(to) ? {
    request: [...to, 'isRequesting'],
    error: [...to, 'error'],
    success: [...to, 'data'],
  } : to;

  return (_dispatch, getState) => {
    values(targets).forEach(target => checkTarget(getState(), target));
  };
}
