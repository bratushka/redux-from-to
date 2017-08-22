import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { createStore, applyMiddleware } from 'redux';

import { fromTo } from '../src/from-to';
import { wrapper } from '../src/wrapper';

const initialState = {
  mutable: 'unchanged',
  immutable: Immutable.Map(),
};
const UNRELATED_ACTION_TYPE = 'UNRELATED_ACTION_TYPE';
function defaultReducer(state = initialState, action) {
  return action.type === UNRELATED_ACTION_TYPE ? {
    ...state,
    mutable: 'changed',
  } : state;
}
function getStore() {
  return createStore(
    wrapper(defaultReducer),
    applyMiddleware(thunk),
  );
}

describe('wrapper', () => {
  it('should return reducer, which catches related actions', () => {
    const store = getStore();
    const action = fromTo(
      () => Promise.resolve({ data: 'some data' }),
      ['immutable'],
    );

    return store.dispatch(action).then(() => {
      const state = store.getState();

      expect(state.immutable.get('data')).to.equal('some data');
      expect(state.mutable).to.equal('unchanged');
    });
  });

  it('should return reducer, which ignores unrelated actions', () => {
    const store = getStore();
    const action = { type: UNRELATED_ACTION_TYPE };
    store.dispatch(action);
    const state = store.getState();

    expect(state.mutable).to.equal('changed');
    // noinspection BadExpressionStatementJS
    expect(state.immutable.isEmpty()).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
