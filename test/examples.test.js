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

  it('response errors', () => {
    httpBackend.expect('GET', '/hello').error(401, 'Not Authorized', { error: 'Fail!' });
    superagent.get('/hello', (error) => {
      assert.ok(error);
      assert.equal(error.statusCode, 401);
      assert.deepEqual(error.body, { error: 'Fail!' });
    });
    httpBackend.flush();
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

  it('expectPOST(url, validateBody)', () => {
    let response = null;
    const validateBody = (body) => {
      assert.deepEqual(body, { hello: 'world' });
    };
    httpBackend.expectPUT('/hello', validateBody).respond({ foo: 'bar' });
    superagent.put('/hello').send({ hello: 'world' }).end((error, res) => {
      assert.ifError(error);
      assert.deepEqual(res.body, { foo: 'bar' });
    });
    httpBackend.flush();
  });

  it('autoFlush option', () => {
    let response = null;
    httpBackend.expectGET('/hello', { autoFlush: true }).
      respond({ hello: 'world' });
    superagent.get('/hello', (err, res) => {
      response = res;
    });
    assert.deepEqual(response.body, { hello: 'world' });
  })
});
