import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';
import { expect, use } from 'chai';

import { request, failure, success } from '../src/actions';
import { reducer } from '../src/reducer';


use(chaiImmutable);

const stateMock = {
  requestReducer: Immutable.fromJS({}),
  errorReducer: Immutable.fromJS({}),
  dataReducer: Immutable.fromJS({}),
};
const dataMock = { some: 'data' };
const requestTarget = ['requestReducer', 'isRequesting'];
const errorTarget = ['errorReducer', 'error'];
const dataTarget = ['dataReducer', 'data'];
const requestAction = request(
  undefined,
  requestTarget,
  errorTarget,
  dataTarget,
);
const failureAction = failure(
  dataMock,
  requestTarget,
  errorTarget,
  dataTarget,
);
const successAction = success(
  dataMock,
  requestTarget,
  undefined,
  dataTarget,
);

describe('reducer', () => {
  describe('if action is request', () => {
    it('should throw on request if state[requestTarget[0]] is not immutable', () => {
      function actual() {
        reducer({ carrier: {} }, request(undefined, ['carrier'], ['carrier'], ['carrier']));
      }

      expect(actual).to.throw(Error);
    });

    it('should throw on request if state[errorTarget[0]] is not immutable', () => {
      function actual() {
        reducer({ carrier: {} }, request(undefined, ['carrier'], ['carrier'], ['carrier']));
      }

      expect(actual).to.throw(Error);
    });

    it('should set true in the requestTarget', () => {
      const state = reducer(stateMock, requestAction);
      const actual = state[requestTarget[0]].getIn([...requestTarget.slice(1)]);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should remove errorTarget', () => {
      const initialState = {
        ...stateMock,
        errorReducer: stateMock[errorTarget[0]].setIn([...errorTarget.slice(1)], 'some data'),
      };
      const state = reducer(initialState, requestAction);
      const actual = state[errorTarget[0]].getIn([...errorTarget.slice(1)]);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.undefined; // eslint-disable-line no-unused-expressions
    });
  });

  describe('if action is failure', () => {
    it('should throw on failure if state[requestTarget[0]] is not immutable', () => {
      function actual() {
        reducer({ carrier: {} }, failure('someError', ['carrier'], ['carrier'], ['carrier']));
      }

      expect(actual).to.throw(Error);
    });

    it('should throw on failure if state[errorTarget[0]] is not immutable', () => {
      function actual() {
        reducer({ carrier: {} }, failure('someError', ['carrier'], ['carrier'], ['carrier']));
      }

      expect(actual).to.throw(Error);
    });

    it('should throw on failure if state[dataTarget[0]] is not immutable', () => {
      function actual() {
        reducer({ carrier: {} }, failure('someError', ['carrier'], ['carrier'], ['carrier']));
      }

      expect(actual).to.throw(Error);
    });

    it('should set false in the requestTarget', () => {
      const state = reducer(stateMock, failureAction);
      const actual = state[requestTarget[0]].getIn([...requestTarget.slice(1)]);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should set data in the errorTarget', () => {
      const state = reducer(stateMock, failureAction);
      const actual = state[errorTarget[0]].getIn([...errorTarget.slice(1)]);

      expect(actual).to.equal(Immutable.fromJS(dataMock));
    });

    it('should remove dataTarget', () => {
      const initialState = {
        ...stateMock,
        dataReducer: stateMock[dataTarget[0]].setIn([...dataTarget.slice(1)], 'some data'),
      };
      const state = reducer(initialState, failureAction);
      const actual = state[dataTarget[0]].getIn([...dataTarget.slice(1)]);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.undefined; // eslint-disable-line no-unused-expressions
    });
  });

  describe('if action is success', () => {
    it('should throw on success if state[requestTarget[0]] is not immutable', () => {
      function actual() {
        reducer({ carrier: {} }, success('someError', ['carrier'], undefined, ['carrier']));
      }

      expect(actual).to.throw(Error);
    });

    it('should throw on success if state[dataTarget[0]] is not immutable', () => {
      function actual() {
        reducer({ carrier: {} }, success('someError', ['carrier'], undefined, ['carrier']));
      }

      expect(actual).to.throw(Error);
    });

    it('should set false in the requestTarget', () => {
      const state = reducer(stateMock, successAction);
      const actual = state[requestTarget[0]].getIn([...requestTarget.slice(1)]);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should set data in the dataTarget', () => {
      const state = reducer(stateMock, successAction);
      const actual = state[dataTarget[0]].getIn([...dataTarget.slice(1)]);

      expect(actual).to.equal(Immutable.fromJS(dataMock));
    });
  });
});
