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

export function isRequest(actionType) {
  return actionType.slice(actionType.length - 7) === ACTIONS.REQUEST;
}

export function isFailure(actionType) {
  return actionType.slice(actionType.length - 7) === ACTIONS.FAILURE;
}

export function isSuccess(actionType) {
  return actionType.slice(actionType.length - 7) === ACTIONS.SUCCESS;
}

/**
 * Returns true is prefix and postfix of the action type match actionTypeBuilder, false otherwise.
 *
 * @param {string} actionType
 * @return {boolean}
 */
export function actionTypeMatches(actionType) {
  return actionType.indexOf(PREFIX) === 0 && (
    isRequest(actionType)
    || isFailure(actionType)
    || isSuccess(actionType)
  );
}
