import Immutable from 'immutable';
import { expect } from 'chai';

import { request, failure, success } from '../src/actions';
import { reducer } from '../src/reducer';


const stateMock = {
  requestReducer: Immutable.fromJS({}),
  errorReducer: Immutable.fromJS({}),
  dataReducer: Immutable.fromJS({}),
};
const dataMock = { some: 'data' };
const requestTarget = ['requestReducer', 'isRequesting'];
const errorTarget = ['errorReducer', 'error'];
const dataTarget = ['dataReducer', 'data'];
const actionArgs = [
  dataMock,
  requestTarget,
  errorTarget,
  dataTarget,
];
const requestAction = request(...actionArgs);
const failureAction = failure(...actionArgs);
const successAction = success(...actionArgs);

describe('reducer', () => {
  describe('if action is request', () => {
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
    it('should set false in the requestTarget', () => {
      const state = reducer(stateMock, failureAction);
      const actual = state[requestTarget[0]].getIn([...requestTarget.slice(1)]);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should set data in the errorTarget', () => {
      const state = reducer(stateMock, failureAction);
      const actual = state[errorTarget[0]].getIn([...errorTarget.slice(1)]);

      expect(actual).to.deep.equal(Immutable.fromJS(dataMock));
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
    it('should set false in the requestTarget', () => {
      const state = reducer(stateMock, successAction);
      const actual = state[requestTarget[0]].getIn([...requestTarget.slice(1)]);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should set data in the dataTarget', () => {
      const state = reducer(stateMock, successAction);
      const actual = state[dataTarget[0]].getIn([...dataTarget.slice(1)]);

      expect(actual).to.deep.equal(Immutable.fromJS(dataMock));
    });
  });

  describe('state changes', () => {
    const localDataMock = Immutable.fromJS({ some: 'data' });
    const localStateMock = {
      reducer: Immutable.fromJS({
        success: localDataMock,
      }),
    };

    const localActionArgs = [
      dataMock,
      ['reducer', 'request'],
      ['reducer', 'failure'],
      ['reducer', 'success'],
    ];

    it('should not be lost during executing request action', () => {
      const actual = reducer(localStateMock, request(...localActionArgs));
      const actualRequest = actual.reducer.getIn(['request']);
      const actualFailure = actual.reducer.getIn(['failure']);
      const actualSuccess = actual.reducer.getIn(['success']);

      // noinspection BadExpressionStatementJS
      expect(actualRequest).to.be.true; // eslint-disable-line no-unused-expressions
      // noinspection BadExpressionStatementJS
      expect(actualFailure).to.be.undefined; // eslint-disable-line no-unused-expressions

      expect(actualSuccess).to.equal(localDataMock);
    });

    it('should not be lost during executing failure action', () => {
      const state = reducer(localStateMock, request(...localActionArgs));
      const actual = reducer(state, failure(...localActionArgs));
      const actualRequest = actual.reducer.getIn(['request']);
      const actualFailure = actual.reducer.getIn(['failure']);
      const actualSuccess = actual.reducer.getIn(['success']);

      // noinspection BadExpressionStatementJS
      expect(actualRequest).to.be.false; // eslint-disable-line no-unused-expressions

      expect(actualFailure).to.deep.equal(localDataMock);
      // noinspection BadExpressionStatementJS
      expect(actualSuccess).to.be.undefined; // eslint-disable-line no-unused-expressions
    });

    it('should not be lost during executing success action', () => {
      const state = reducer(localStateMock, request(...localActionArgs));
      const actual = reducer(state, success(...localActionArgs));
      const actualRequest = actual.reducer.getIn(['request']);
      const actualFailure = actual.reducer.getIn(['failure']);
      const actualSuccess = actual.reducer.getIn(['success']);

      // noinspection BadExpressionStatementJS
      expect(actualRequest).to.be.false; // eslint-disable-line no-unused-expressions
      // noinspection BadExpressionStatementJS
      expect(actualFailure).to.be.undefined; // eslint-disable-line no-unused-expressions

      expect(actualSuccess).to.deep.equal(localDataMock);
    });
  });
});
