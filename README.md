[![Build Status](https://travis-ci.org/GlennGeenen/boomhandler.svg?branch=master)](https://travis-ci.org/GlennGeenen/boomhandler)

# Errorhandler for Express.js

Express.js errorhandler that handles boom errors and mongoose errors.

## require('boomhandler')(options)

### Options

- log (boolean) - default true
- logMethod (Function) - default console.error

## Output

Normal error objects return status code 500, Internal Server Error.

Boom objects or error object containing a statusCode will return corresponding status code and message.

Mongoose validation error and cast error return status code 400.

```
{
  message: 'An internal server error occurred',
  error: 'Internal Server Error',
  statusCode: 500,
}
```

## Usage

```
var express = require('express');
var Boom = require('boom');
var boomhandler = require('boomhandler');

var app = express();

// Load Routes
app.get('/errOne', function(request, response, next) {
  next(Boom.badRequest('message goes here'));
});

app.get('/errTwo', function(request, response, next) {
  next(new Error('results in 500 Internal Server Error'));
});

app.use(boomhandler());
```