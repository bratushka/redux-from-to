import { reducer } from './reducer';
import { actionTypeMatches } from './utils';


/**
 * Wrapper for the main reducer.
 *
 * @param {function(state: Object, action: Object): Object} mainReducer
 * @return {function(state: Object, action: Object): Object}
 */
export function wrapper(mainReducer) {
  return (state, action) => {
    if (actionTypeMatches(action)) {
      return reducer(state, action);
    }

    return mainReducer(state, action);
  };
}
