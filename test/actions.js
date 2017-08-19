import { expect } from 'chai';

import { request, failure, success } from '../src/actions';
import { ACTIONS } from '../src/constants';
import { actionTypeBuilder } from '../src/utils';


const locationMock = ['some', 'path'];
const errorMock = { some: 'error' };
const dataMock = { some: 'data' };

describe('actions', () => {
  describe('request', () => {
    it('should return expected action object', () => {
      const actual = request(locationMock);
      const expected = {
        type: actionTypeBuilder(locationMock, ACTIONS.REQUEST),
        location: locationMock,
      };

      expect(actual).to.deep.equal(expected);
    });
  });

  describe('failure', () => {
    it('should return expected action object', () => {
      const actual = failure(locationMock, errorMock);
      const expected = {
        type: actionTypeBuilder(locationMock, ACTIONS.FAILURE),
        error: errorMock,
        location: locationMock,
      };

      expect(actual).to.deep.equal(expected);
    });
  });

  describe('success', () => {
    it('should return expected action object', () => {
      const actual = success(locationMock, dataMock);
      const expected = {
        type: actionTypeBuilder(locationMock, ACTIONS.SUCCESS),
        data: dataMock,
        location: locationMock,
      };

      expect(actual).to.deep.equal(expected);
    });
  });
});
