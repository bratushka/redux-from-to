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

/**
 * Checks if action.type finishes with REQUEST.
 *
 * @param {Object} action
 * @return {boolean}
 */
export function isRequest(action) {
  return action.type.slice(action.type.length - 7) === ACTIONS.REQUEST;
}

/**
 * Checks if action.type finishes with FAILURE.
 *
 * @param {Object} action
 * @return {boolean}
 */
export function isFailure(action) {
  return action.type.slice(action.type.length - 7) === ACTIONS.FAILURE;
}

/**
 * Checks if action.type finishes with SUCCESS.
 *
 * @param {Object} action
 * @return {boolean}
 */
export function isSuccess(action) {
  return action.type.slice(action.type.length - 7) === ACTIONS.SUCCESS;
}

/**
 * Returns true is prefix of the action type matches action.typeBuilder, false otherwise.
 *
 * @param {Object} action
 * @return {boolean}
 */
export function actionTypeMatches(action) {
  return action.type.indexOf(PREFIX) === 0;
}

/**
 * Throws if state[target[0]] is not an immutable structure.
 * Target can also be undefined.
 *
 * @param {Object} state
 * @param {string[]} target
 * @throws {Error}
 */
export function checkTarget(state, target) {
  if (target !== undefined && !Immutable.Iterable.isIterable(state[target[0]])) {
    throw new Error(`"state['${target[0]}']" should be an immutable structure.`);
  }
}
