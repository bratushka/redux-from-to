import Immutable from 'immutable';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';

import { carrier, defaultErrorAdapter, defaultDataAdapter } from '../src/carrier';
import { isRequest, isFailure, isSuccess } from '../src/utils';


const mockStore = configureStore([thunk]);
const mockTargets = {
  request: ['requests', 'isRequesting'],
  failure: ['failures', 'error'],
  success: ['successes', 'data'],
};

describe('carrier', () => {
  describe('should throw because of target', () => {
    it('request', () => {
      const store = mockStore({
        requests: {},
        failures: Immutable.Map(),
        successes: Immutable.Map(),
      });

      expect(() => store.dispatch(carrier(() => Promise.resolve(), mockTargets))).to.throw(Error);
    });

    it('failure', () => {
      const store = mockStore({
        requests: Immutable.Map(),
        failures: {},
        successes: Immutable.Map(),
      });

      expect(() => store.dispatch(carrier(() => Promise.resolve(), mockTargets))).to.throw(Error);
    });

    it('success', () => {
      const store = mockStore({
        requests: Immutable.Map(),
        failures: Immutable.Map(),
        successes: {},
      });

      expect(() => store.dispatch(carrier(() => Promise.resolve(), mockTargets))).to.throw(Error);
    });

    it('any', () => {
      const store = mockStore({
        data: {},
      });

      expect(() => store.dispatch(carrier(() => Promise.resolve(), ['data']))).to.throw(Error);
    });
  });

  describe('should dispatch', () => {
    it('REQUEST and SUCCESS on from.resolve', () => {
      const store = mockStore({ data: Immutable.Map() });

      return store.dispatch(carrier(() => Promise.resolve(), ['data'])).then(() => {
        const actions = store.getActions();

        // noinspection BadExpressionStatementJS
        expect(isRequest(actions[0])).to.be.true; // eslint-disable-line no-unused-expressions
        // noinspection BadExpressionStatementJS
        expect(isSuccess(actions[1])).to.be.true; // eslint-disable-line no-unused-expressions
      });
    });

    it('REQUEST and FAILURE on from.reject', () => {
      const store = mockStore({ data: Immutable.Map() });

      return store.dispatch(carrier(() => Promise.reject(Error()), ['data'])).then(() => {
        const actions = store.getActions();

        // noinspection BadExpressionStatementJS
        expect(isRequest(actions[0])).to.be.true; // eslint-disable-line no-unused-expressions
        // noinspection BadExpressionStatementJS
        expect(isFailure(actions[1])).to.be.true; // eslint-disable-line no-unused-expressions
      });
    });
  });
});
