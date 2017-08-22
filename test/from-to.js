import Immutable from 'immutable';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';

import { fromTo } from '../src/from-to';
import { isRequest, isFailure, isSuccess } from '../src/utils';


const mockStore = configureStore([thunk]);
const mockTargets = {
  request: ['requests', 'isRequesting'],
  failure: ['failures', 'error'],
  success: ['successes', 'data'],
};
function getStore() {
  return mockStore({ data: Immutable.Map() });
}

describe('fromTo', () => {
  describe('should throw because of target', () => {
    it('request', () => {
      const store = mockStore({
        requests: {},
        failures: Immutable.Map(),
        successes: Immutable.Map(),
      });
      function actual() {
        return store.dispatch(fromTo(() => Promise.resolve({}), mockTargets));
      }

      expect(actual).to.throw(Error);
    });

    it('failure', () => {
      const store = mockStore({
        requests: Immutable.Map(),
        failures: {},
        successes: Immutable.Map(),
      });
      function actual() {
        return store.dispatch(fromTo(() => Promise.resolve({}), mockTargets));
      }

      expect(actual).to.throw(Error);
    });

    it('success', () => {
      const store = mockStore({
        requests: Immutable.Map(),
        failures: Immutable.Map(),
        successes: {},
      });
      function actual() {
        return store.dispatch(fromTo(() => Promise.resolve({}), mockTargets));
      }

      expect(actual).to.throw(Error);
    });

    it('any', () => {
      const store = mockStore({
        data: {},
      });

      expect(() => store.dispatch(fromTo(() => Promise.resolve(), ['data']))).to.throw(Error);
    });
  });

  describe('should dispatch', () => {
    it('REQUEST and SUCCESS on from.resolve', () => {
      const store = getStore();

      return store.dispatch(fromTo(() => Promise.resolve({}), ['data'])).then(() => {
        const actions = store.getActions();

        // noinspection BadExpressionStatementJS
        expect(isRequest(actions[0])).to.be.true; // eslint-disable-line no-unused-expressions
        // noinspection BadExpressionStatementJS
        expect(isSuccess(actions[1])).to.be.true; // eslint-disable-line no-unused-expressions
      });
    });

    it('REQUEST and FAILURE on from.reject', () => {
      const store = getStore();

      return store.dispatch(fromTo(() => Promise.reject(Error()), ['data'])).then(() => {
        const actions = store.getActions();

        // noinspection BadExpressionStatementJS
        expect(isRequest(actions[0])).to.be.true; // eslint-disable-line no-unused-expressions
        // noinspection BadExpressionStatementJS
        expect(isFailure(actions[1])).to.be.true; // eslint-disable-line no-unused-expressions
      });
    });
  });

  describe('should apply adapter', () => {
    it('on data', () => {
      const store = getStore();
      const action = fromTo(
        () => Promise.resolve('data'),
        ['data'],
        { responseAdapter: data => [data, data].join(' ') },
      );

      return store.dispatch(action).then(() => {
        const actions = store.getActions();

        expect(actions[1].data).to.equal('data data');
      });
    });

    it('on error', () => {
      const store = getStore();
      const action = fromTo(
        () => Promise.reject(Error('error')),
        ['data'],
        { errorAdapter: error => [error.message, error.message].join(' ') },
      );

      return store.dispatch(action).then(() => {
        const actions = store.getActions();

        expect(actions[1].error).to.equal('error error');
      });
    });
  });
});
