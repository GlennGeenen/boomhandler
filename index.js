'use strict';

const inspect = require('util').inspect;

function stringify(val) {
  const stack = val.stack;
  if (stack) {
    return String(stack);
  }

  const str = String(val);
  return str === toString.call(val)
    ? inspect(val)
    : str;
}

function logError(err, logMethod) {
  const errorString = stringify(err);
  if (typeof logMethod === 'function') {
    logMethod(errorString);
  } else {
    console.error(errorString);
  }
}

function middleware(options) {
  const shouldLog = options.log === undefined ? true : options.log;

  return function errorHandler(err, req, res) {
    if (shouldLog) {
      logError(err, options.logMethod);
    }

    // Handle Boom Errors
    if (err.isBoom) {
      return res.status(err.output.statusCode).json(err.output.payload);
    }

    // Handle statusCode
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        message: err.message,
        error: err.name,
        statusCode: err.statusCode,
      });
    }

    // Handle Mongoose Errors
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'A cast error occured.',
        error: 'Bad Request',
        statusCode: 400,
      });
    } else if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'A validation error occured.',
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    return res.status(500).json({
      message: 'An internal server error occurred',
      error: 'Internal Server Error',
      statusCode: 500,
    });
  };
}

module.exports = middleware;
