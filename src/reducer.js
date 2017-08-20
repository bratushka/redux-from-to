import Immutable from 'immutable';

import { isRequest, isFailure, isSuccess } from './utils';


function checkTarget(state, target) {
  if (!Immutable.Iterable.isIterable(state[target[0]])) {
    throw new Error(`"state['${target[0]}']" should be an immutable structure.`);
  }
}

export function reducer(state = {}, action) {
  if (isRequest(action.type)) {
    checkTarget(state, action.requestTarget);
    checkTarget(state, action.errorTarget);

    const newState = { ...state };
    newState[action.requestTarget[0]] = state[action.requestTarget[0]].setIn(
      action.requestTarget.slice(1),
      true,
    );
    newState[action.errorTarget[0]] = state[action.errorTarget[0]].deleteIn(
      action.errorTarget.slice(1),
    );

    return newState;
  } else if (isFailure(action.type)) {
    checkTarget(state, action.requestTarget);
    checkTarget(state, action.errorTarget);
    checkTarget(state, action.dataTarget);

    const newState = { ...state };
    newState[action.requestTarget[0]] = state[action.requestTarget[0]].setIn(
      action.requestTarget.slice(1),
      false,
    );
    newState[action.errorTarget[0]] = state[action.errorTarget[0]].setIn(
      action.errorTarget.slice(1),
      Immutable.fromJS(action.data),
    );
    newState[action.dataTarget[0]] = state[action.dataTarget[0]].deleteIn(
      action.dataTarget.slice(1),
    );

    return newState;
  } else if (isSuccess(action.type)) {
    checkTarget(state, action.requestTarget);
    checkTarget(state, action.dataTarget);

    const newState = { ...state };
    newState[action.requestTarget[0]] = state[action.requestTarget[0]].setIn(
      action.requestTarget.slice(1),
      false,
    );
    newState[action.dataTarget[0]] = state[action.dataTarget[0]].setIn(
      action.dataTarget.slice(1),
      Immutable.fromJS(action.data),
    );

    return newState;
  }

  return state;
}
