# Errorhandler for Express.js

Express.js errorhandler that handles boom errors and mongoose errors.

## require('boomhandler')(options)

### Options

- log (boolean) - default true
- logMethod (Function) - default console.error

## Usage

```
var express = require('express');
var boomhandler = require('boomhandler');

var app = express();

// Load Routes

app.use(boomhandler());
```