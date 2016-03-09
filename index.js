'use strict';

const _ = require('lodash');
const superagent = require('superagent');

const Request = superagent.Request;
let expectations = [];

Request.prototype.end = function(callback) {
  const res = _.find(expectations,
    r => r.verb === this.method && r.url === this.url);
  if (res) {
    const validateBody = _.get(res, 'options.validateBody');
    if (validateBody) {
      validateBody.call(this, this.body);
    }
    res.called = true;
    res.callback = callback;
    return this;
  }
  throw new Error(`Unexpected request ${this.method} ${this.url}`);
};

function expect(verb, url, options) {
  const config = new ResponseConfiguration(verb, url, options);
  expectations.push(config);
  return config;
}

function expectGET(url) {
  return expect('GET', url);
}

function expectPUT(url, validateBody) {
  return expect('PUT', url, { validateBody: validateBody });
}

function expectPOST(url, validateBody) {
  return expect('POST', url, { validateBody: validateBody });
}

function expectDELETE(url) {
  return expect('DELETE', url);
}

function flush() {
  const notFinished = _.find(expectations, v => !v.called);
  if (notFinished) {
    throw new Error(`Expected request: ${notFinished.verb} ${notFinished.url}`);
  }
  _.each(expectations, config => {
    if (config.callback) {
      if (config.errored) {
        const error = new Error(config.message);
        error.statusCode = config.statusCode;
        error.body = config.body;
        config.callback(error);
      } else {
        config.callback(null, new Response(config));
      }
    }
  });
  reset();
}

function reset() {
  expectations = [];
}

class ResponseConfiguration {
  constructor(verb, url, options) {
    this.verb = verb;
    this.url = url;
    this.options = options;
    this.called = false;
    this.errored = false;
    this.callback = null;
  }

  respond(body, headers) {
    this.body = body;
    this.headers = headers;
  }

  error(code, message, body) {
    this.errored = true;
    this.statusCode = code;
    this.message = message;
    this.body = body;
  }
}

class Response {
  constructor(config) {
    this.body = config.body;
    this.text = JSON.stringify(config.body);
    this.headers = config.headers;
  }
}

module.exports = {
  expect: expect,
  expectGET: expectGET,
  expectPUT: expectPUT,
  expectPOST: expectPOST,
  expectDELETE: expectDELETE,
  flush: flush,
  reset: reset
};
