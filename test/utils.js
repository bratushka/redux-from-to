import { expect } from 'chai';

import { PREFIX, ACTIONS } from '../src/constants';
import { actionTypeBuilder, actionTypeMatcher } from '../src/utils';


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

  describe('actionTypeMatcher', () => {
    it('should match the REQUEST action', () => {
      const action = actionTypeBuilder(['location'], ACTIONS.REQUEST);
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should match the FAILURE action', () => {
      const action = actionTypeBuilder(['location'], ACTIONS.FAILURE);
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should match the SUCCESS action', () => {
      const action = actionTypeBuilder(['location'], ACTIONS.SUCCESS);
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should not match the SUCCESS action when prefix differs', () => {
      const action = `some/action/${ACTIONS.SUCCESS}`;
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should not match actions with correct prefix and incorrect postfix', () => {
      const action = `${PREFIX}/some/action`;
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });
});
