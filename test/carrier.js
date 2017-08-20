import Immutable from 'immutable';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';

import { carrier } from '../src/carrier';


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

      expect(() => store.dispatch(carrier(Promise.resolve, mockTargets))).to.throw(Error);
    });

    it('failure', () => {
      const store = mockStore({
        requests: Immutable.Map(),
        failures: {},
        successes: Immutable.Map(),
      });

      expect(() => store.dispatch(carrier(Promise.resolve, mockTargets))).to.throw(Error);
    });

    it('success', () => {
      const store = mockStore({
        requests: Immutable.Map(),
        failures: Immutable.Map(),
        successes: {},
      });

      expect(() => store.dispatch(carrier(Promise.resolve, mockTargets))).to.throw(Error);
    });

    it('any', () => {
      const store = mockStore({
        data: {},
      });

      expect(() => store.dispatch(carrier(Promise.resolve, ['data']))).to.throw(Error);
    });
  });
});
