import { expect } from 'chai';

import { PREFIX, ACTIONS } from '../src/constants';
import {
  actionTypeBuilder,
  isRequest,
  isFailure,
  isSuccess,
  actionTypeMatches,
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
      const actual = isRequest('some/REQUEST');

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return false when action doesn\'t end with REQUEST', () => {
      const actual = isRequest('some/REQUESTS');

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe('isFailure', () => {
    it('should return true when action ends with FAILURE', () => {
      const actual = isFailure('some/FAILURE');

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return false when action doesn\'t end with FAILURE', () => {
      const actual = isFailure('some/FAILURES');

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe('isSuccess', () => {
    it('should return true when action ends with SUCCESS', () => {
      const actual = isSuccess('some/SUCCESS');

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return false when action doesn\'t end with SUCCESS', () => {
      const actual = isSuccess('some/SUCCESSES');

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe('actionTypeMatches', () => {
    it('should match the REQUEST action', () => {
      const action = actionTypeBuilder(['location'], ACTIONS.REQUEST);
      const actual = actionTypeMatches(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should match the FAILURE action', () => {
      const action = actionTypeBuilder(['location'], ACTIONS.FAILURE);
      const actual = actionTypeMatches(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should match the SUCCESS action', () => {
      const action = actionTypeBuilder(['location'], ACTIONS.SUCCESS);
      const actual = actionTypeMatches(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should not match the SUCCESS action when prefix differs', () => {
      const action = `some/action/${ACTIONS.SUCCESS}`;
      const actual = actionTypeMatches(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should not match actions with correct prefix and incorrect postfix', () => {
      const action = `${PREFIX}/some/action`;
      const actual = actionTypeMatches(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });
});
