'use strict';

const assert = require('assert');
const boom = require('boom');

function CustomError(type) {
  this.message = 'ErrorMessage';
  this.name = type || 'CustomError';
}
CustomError.prototype = Error.prototype;

describe('Test response', function onTestResponse() {
  const errorHandler = require('..')({ log: false });

  it('should throw default error', function onDefaultError() {
    const res = {};

    function status(number) {
      assert(number === 500);
      return res;
    }

    function json(object) {
      assert(object.statusCode === 500);
      assert(object.message === 'An internal server error occurred');
      assert(object.error === 'Internal Server Error');
    }

    res.json = json;
    res.status = status;

    errorHandler(new Error('Not this'), null, res);
  });

  it('should throw cast error', function onCastError() {
    const res = {};

    function status(number) {
      assert(number === 400);
      return res;
    }

    function json(object) {
      assert(object.statusCode === 400);
      assert(object.message === 'A cast error occured.');
      assert(object.error === 'Bad Request');
    }

    res.json = json;
    res.status = status;

    errorHandler(new CustomError('CastError'), null, res);
  });

  it('should throw validation error', function onValidationError() {
    const res = {};

    function status(number) {
      assert(number === 400);
      return res;
    }

    function json(object) {
      assert(object.statusCode === 400);
      assert(object.message === 'A validation error occured.');
      assert(object.error === 'Bad Request');
    }

    res.json = json;
    res.status = status;

    errorHandler(new CustomError('ValidationError'), null, res);
  });

  it('should throw boom error', function onBoomError() {
    const res = {};

    function status(number) {
      assert(number === 401);
      return res;
    }

    function json(object) {
      assert(object.statusCode === 401);
      assert(object.message === 'invalid password');
      assert(object.error === 'Unauthorized');
    }

    res.json = json;
    res.status = status;

    errorHandler(boom.unauthorized('invalid password'), null, res);
  });
});

describe('Test logging', function onTestLogging() {
  const res = {
    status: function() {
      return this;
    },
    json: function() {
      return this;
    }
  };

  it('should log default error', function onDefaultError() {
    function callLog(str) {
      assert(str.includes('Error: MyMessage'));
    }

    const errorHandler = require('..')({ logMethod: callLog });
    errorHandler(new Error('MyMessage'), null, res);
  });

  it('should log custom error', function onCustomError() {
    function callLog(str) {
      assert(str.includes('ValidationError: ErrorMessage'));
    }

    const errorHandler = require('..')({ logMethod: callLog });
    errorHandler(new CustomError('ValidationError'), null, res);
  });
});
