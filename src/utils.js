import Immutable from 'immutable';

import { PREFIX, ACTIONS } from './constants';


/**
 * Builds the type of action from the prefix, data path and postfix.
 *
 * @param {string[]} dataPath
 * @param {string} postfix
 * @return {string}
 */
export function actionTypeBuilder(dataPath, postfix) {
  return [PREFIX, ...dataPath, postfix].join('/');
}

export function isRequest(action) {
  return action.type.slice(action.type.length - 7) === ACTIONS.REQUEST;
}

export function isFailure(action) {
  return action.type.slice(action.type.length - 7) === ACTIONS.FAILURE;
}

export function isSuccess(action) {
  return action.type.slice(action.type.length - 7) === ACTIONS.SUCCESS;
}

/**
 * Returns true is prefix and postfix of the action type match action.typeBuilder, false otherwise.
 *
 * @param {Object} action
 * @return {boolean}
 */
export function actionTypeMatches(action) {
  return action.type.indexOf(PREFIX) === 0;
}

/**
 * Throws if state[target[0]] is not an immutable structure.
 *
 * @param {Object} state
 * @param {string[]} target
 * @throws {Error}
 */
export function checkTarget(state, target) {
  if (!Immutable.Iterable.isIterable(state[target[0]])) {
    throw new Error(`"state['${target[0]}']" should be an immutable structure.`);
  }
}
