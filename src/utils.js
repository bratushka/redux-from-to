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
 * Returns true is prefix and postfix of the action type match actionTypeBuilder, false otherwise.
 *
 * @param {string} actionType
 * @return {boolean}
 */
export function actionTypeMatcher(actionType) {
  return actionType.indexOf(PREFIX) === 0
    && Object.keys(ACTIONS).includes(actionType.slice(actionType.length - 7))
  ;
}
