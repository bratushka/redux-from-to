import { expect } from 'chai';

import { request, failure, success } from '../src/actions';
import { ACTIONS } from '../src/constants';
import { actionTypeBuilder } from '../src/utils';


const requestTargetMock = ['some', 'request'];
const errorTargetMock = ['some', 'error'];
const dataTargetMock = ['some', 'data'];
const errorMock = { some: 'error' };
const dataMock = { some: 'data' };

describe('actions', () => {
  describe('request', () => {
    it('should return expected action object', () => {
      const actual = request(undefined, requestTargetMock, errorTargetMock, dataTargetMock);
      const expected = {
        type: actionTypeBuilder(dataTargetMock, ACTIONS.REQUEST),
        requestTarget: requestTargetMock,
        errorTarget: errorTargetMock,
      };

      expect(actual).to.deep.equal(expected);
    });
  });

  describe('failure', () => {
    it('should return expected action object', () => {
      const actual = failure(errorMock, requestTargetMock, errorTargetMock, dataTargetMock);
      const expected = {
        type: actionTypeBuilder(dataTargetMock, ACTIONS.FAILURE),
        data: errorMock,
        requestTarget: requestTargetMock,
        errorTarget: errorTargetMock,
        dataTarget: dataTargetMock,
      };

      expect(actual).to.deep.equal(expected);
    });
  });

  describe('success', () => {
    it('should return expected action object', () => {
      const actual = success(dataMock, requestTargetMock, undefined, dataTargetMock);
      const expected = {
        type: actionTypeBuilder(dataTargetMock, ACTIONS.SUCCESS),
        data: dataMock,
        requestTarget: requestTargetMock,
        dataTarget: dataTargetMock,
      };

      expect(actual).to.deep.equal(expected);
    });
  });
});
