import { expect } from 'chai';

import { PREFIX, ACTIONS } from '../src/constants';
import { actionTypeBuilder, actionTypeMatcher } from '../src/utils';


describe('utils', () => {
  describe('actionTypeBuilder', () => {
    it('should build the type of the REQUEST action based on data path', () => {
      const actual = actionTypeBuilder(['data', 'path', 'in', 'the', 'store'], ACTIONS.REQUEST);
      const expected = '@@redux-carrier/data/path/in/the/store/REQUEST';

      expect(actual).to.equal(expected);
    });

    it('should build the type of the FAILURE action based on data path', () => {
      const actual = actionTypeBuilder(['data', 'path', 'in', 'the', 'store'], ACTIONS.FAILURE);
      const expected = '@@redux-carrier/data/path/in/the/store/FAILURE';

      expect(actual).to.equal(expected);
    });

    it('should build the type of the SUCCESS action based on data path', () => {
      const actual = actionTypeBuilder(['data', 'path', 'in', 'the', 'store'], ACTIONS.SUCCESS);
      const expected = '@@redux-carrier/data/path/in/the/store/SUCCESS';

      expect(actual).to.equal(expected);
    });
  });

  describe('actionTypeMatcher', () => {
    it('should match the REQUEST action', () => {
      const action = actionTypeBuilder(['data', 'path'], ACTIONS.REQUEST);
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true;
    });

    it('should match the FAILURE action', () => {
      const action = actionTypeBuilder(['data', 'path'], ACTIONS.FAILURE);
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true;
    });

    it('should match the SUCCESS action', () => {
      const action = actionTypeBuilder(['data', 'path'], ACTIONS.SUCCESS);
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.true;
    });

    it('should not match the SUCCESS action when prefix differs', () => {
      const action = `some/action/${ACTIONS.SUCCESS}`;
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false;
    });

    it('should not match actions with correct prefix and incorrect postfix', () => {
      const action = `${PREFIX}/some/action`;
      const actual = actionTypeMatcher(action);

      // noinspection BadExpressionStatementJS
      expect(actual).to.be.false;
    });
  });
});
