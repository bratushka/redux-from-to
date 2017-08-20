import Immutable from 'immutable';
import { expect } from 'chai';

import { ACTIONS } from '../src/constants';
import {
  actionTypeBuilder,
  actionTypeMatches,
  isRequest,
  isFailure,
  isSuccess, checkTarget,
} from '../src/utils';


describe('utils', () => {
  describe('actionTypeBuilder', () => {
    it('should build the type of the REQUEST action based on location', () => {
      const actual = actionTypeBuilder(['location', 'in', 'the', 'store'], ACTIONS.REQUEST);
      const expected = '@@redux-carrier/location/in/the/store/REQUEST';

      expect(actual).to.equal(expected);
    });

    it('should build the type of the FAILURE action based on location', () => {
      const actual = actionTypeBuilder(['location', 'in', 'the', 'store'], ACTIONS.FAILURE);
      const expected = '@@redux-carrier/location/in/the/store/FAILURE';

      expect(actual).to.equal(expected);
    });

    it('should build the type of the SUCCESS action based on location', () => {
      const actual = actionTypeBuilder(['location', 'in', 'the', 'store'], ACTIONS.SUCCESS);
      const expected = '@@redux-carrier/location/in/the/store/SUCCESS';

      expect(actual).to.equal(expected);
    });
  });

  describe('isRequest', () => {
    it('should return true when action ends with REQUEST', () => {
      const actual = isRequest({ type: 'some/REQUEST'});

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return false when action doesn\'t end with REQUEST', () => {
      const actual = isRequest({ type: 'some/REQUESTS'});

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe('isFailure', () => {
    it('should return true when action ends with FAILURE', () => {
      const actual = isFailure({ type: 'some/FAILURE'});

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return false when action doesn\'t end with FAILURE', () => {
      const actual = isFailure({ type: 'some/FAILURES'});

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe('isSuccess', () => {
    it('should return true when action ends with SUCCESS', () => {
      const actual = isSuccess({ type: 'some/SUCCESS'});

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return false when action doesn\'t end with SUCCESS', () => {
      const actual = isSuccess({ type: 'some/SUCCESSES'});

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe('actionTypeMatches', () => {
    it('should match the SUCCESS action', () => {
      const actionType = actionTypeBuilder(['location'], ACTIONS.SUCCESS);
      const actual = actionTypeMatches({ type: actionType });

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should not match the SUCCESS action when prefix differs', () => {
      const actionType = `some/action/${ACTIONS.SUCCESS}`;
      const actual = actionTypeMatches({ type: actionType });

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe('checkTarget', () => {
    it('should throw when state[target[0]] is not immutable structure', () => {
      function actual() {
        checkTarget({ request: {} }, ['request', 1]);
      }

      expect(actual).to.throw(Error);
    });

    it('should not throw when state[target[0]] is immutable structure', () => {
      function actual() {
        checkTarget({ request: Immutable.Map() }, ['request', 1]);
      }

      expect(actual).not.to.throw(Error);
    });
  });
});
