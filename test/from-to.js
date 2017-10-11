import Immutable from 'immutable';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';

import { request, failure, success } from '../src/actions';
import { fromTo, targetTransformer } from '../src/from-to';
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
  describe('targetTransformer', () => {
    it('should transform an array into object', () => {
      const to = ['data'];
      const expected = {
        request: [...to, 'isRequesting'],
        failure: [...to, 'error'],
        success: [...to, 'data'],
      };

      expect(targetTransformer(to)).to.deep.equal(expected);
    });

    it('should leave the object as is', () => {
      const to = { some: 'stuff' };

      expect(targetTransformer(to)).to.equal(to);
    });
  });

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

  describe('should dispatch only', () => {
    it('request', () => {
      const actualStore = getStore();
      const expectedStore = getStore();
      const targets = targetTransformer(['data']);
      const targetArgs = [targets.request, targets.failure, targets.success];

      const action = fromTo(
        () => Promise.resolve('data'),
        ['data'],
        undefined,
        { action: request },
      );

      return actualStore.dispatch(action).then(() => {
        expectedStore.dispatch(request('data', ...targetArgs));

        expect(actualStore.getActions()).to.deep.equal(expectedStore.getActions());
      });
    });

    it('failure', () => {
      const actualStore = getStore();
      const expectedStore = getStore();
      const targets = targetTransformer(['data']);
      const targetArgs = [targets.request, targets.failure, targets.success];

      const action = fromTo(
        () => Promise.reject('data'),
        ['data'],
        {
          errorAdapter: x => x,
          responseAdapter: x => x,
        },
        { action: failure },
      );

      return actualStore.dispatch(action).then(() => {
        expectedStore.dispatch(failure('data', ...targetArgs));

        expect(actualStore.getActions()).to.deep.equal(expectedStore.getActions());
      });
    });

    it('success', () => {
      const actualStore = getStore();
      const expectedStore = getStore();
      const targets = targetTransformer(['data']);
      const targetArgs = [targets.request, targets.failure, targets.success];

      const action = fromTo(
        () => Promise.resolve('data'),
        ['data'],
        {
          errorAdapter: x => x,
          responseAdapter: x => x,
        },
        { action: success },
      );

      return actualStore.dispatch(action).then(() => {
        expectedStore.dispatch(success('data', ...targetArgs));

        expect(actualStore.getActions()).to.deep.equal(expectedStore.getActions());
      });
    });
  });
});
