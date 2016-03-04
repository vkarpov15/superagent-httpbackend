'use strict';

const assert = require('assert');
const httpBackend = require('../');
const superagent = require('superagent');

describe('Examples', () => {
  afterEach(() => httpBackend.reset());

  it('configure responses to requests', () => {
    const httpBackend = require('../');
    const superagent = require('superagent');

    let response = null;
    httpBackend.expect('GET', '/hello').respond({ hello: 'world' });
    superagent.get('/hello', (err, res) => {
      response = res;
    });
    assert.strictEqual(response, null);
    httpBackend.flush();
    assert.deepEqual(response.body, { hello: 'world' });
  });

  it('throws if an unexpected request gets fired', () => {
    assert.throws(function() {
      superagent.get('/hello', () => {});
    }, /Unexpected request/);
  });

  it('reset after each test', () => {
    let response = null;
    httpBackend.expect('GET', '/hello').respond({ hello: 'world' });
    httpBackend.reset();
    assert.throws(function() {
      superagent.get('/hello', () => {});
    }, /Unexpected request/);
  });
});

describe('API', function() {
  afterEach(() => httpBackend.reset());

  it('expect(verb, url)', () => {
    let response = null;
    httpBackend.expect('GET', '/hello').respond({ hello: 'world' });
    superagent.get('/hello', (err, res) => {
      response = res;
    });
    assert.strictEqual(response, null);
    httpBackend.flush();
    assert.deepEqual(response.body, { hello: 'world' });
  });

  it('expectGET(url)', () => {
    let response = null;
    httpBackend.expectGET('/hello').respond({ hello: 'world' });
    superagent.get('/hello', (err, res) => {
      response = res;
    });
    assert.strictEqual(response, null);
    httpBackend.flush();
    assert.deepEqual(response.body, { hello: 'world' });
  });

  it('expectPUT(url, validateBody)', () => {
    let response = null;
    const validateBody = (body) => {
      throw new Error('Body validation failed');
    };
    httpBackend.expectPUT('/hello', validateBody).respond({ hello: 'world' });
    assert.throws(() => {
      superagent.put('/hello').send({ hello: 'world' }).end(() => {});
    }, /Body validation failed/);
  });
});
