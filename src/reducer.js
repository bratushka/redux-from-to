import Immutable from 'immutable';

import { isRequest, isFailure, isSuccess } from './utils';


/**
 * Reducer to be used when related action is dispatched.
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
export function reducer(state = {}, action) {
  if (isRequest(action)) {
    const newState = { ...state };
    newState[action.requestTarget[0]] = state[action.requestTarget[0]].setIn(
      action.requestTarget.slice(1),
      true,
    );
    newState[action.errorTarget[0]] = newState[action.errorTarget[0]].deleteIn(
      action.errorTarget.slice(1),
    );

    return newState;
  } else if (isFailure(action)) {
    const newState = { ...state };
    newState[action.requestTarget[0]] = state[action.requestTarget[0]].setIn(
      action.requestTarget.slice(1),
      false,
    );
    newState[action.errorTarget[0]] = newState[action.errorTarget[0]].setIn(
      action.errorTarget.slice(1),
      Immutable.fromJS(action.error),
    );
    newState[action.dataTarget[0]] = newState[action.dataTarget[0]].deleteIn(
      action.dataTarget.slice(1),
    );

    return newState;
  } else if (isSuccess(action)) {
    const newState = { ...state };
    newState[action.requestTarget[0]] = state[action.requestTarget[0]].setIn(
      action.requestTarget.slice(1),
      false,
    );
    newState[action.dataTarget[0]] = newState[action.dataTarget[0]].setIn(
      action.dataTarget.slice(1),
      Immutable.fromJS(action.data),
    );

    return newState;
  }

  return state;
}
