# superagent-httpbackend

Stub out superagent requests using AngularJS' $httpBackend syntax


# Examples

## configure responses to requests

```javascript

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
  
```

## throws if an unexpected request gets fired

```javascript

    assert.throws(function() {
      superagent.get('/hello', () => {});
    }, /Unexpected request/);
  
```

## response errors

```javascript

    httpBackend.expect('GET', '/hello').error(401, 'Not Authorized', { error: 'Fail!' });
    superagent.get('/hello', (error) => {
      assert.ok(error);
      assert.equal(error.statusCode, 401);
      assert.deepEqual(error.body, { error: 'Fail!' });
    });
    httpBackend.flush();
  
```

## reset after each test

```javascript

    let response = null;
    httpBackend.expect('GET', '/hello').respond({ hello: 'world' });
    httpBackend.reset();
    assert.throws(function() {
      superagent.get('/hello', () => {});
    }, /Unexpected request/);
  
```

# API

## expect(verb, url)

```javascript

    let response = null;
    httpBackend.expect('GET', '/hello').respond({ hello: 'world' });
    superagent.get('/hello', (err, res) => {
      response = res;
    });
    assert.strictEqual(response, null);
    httpBackend.flush();
    assert.deepEqual(response.body, { hello: 'world' });
  
```

## expectGET(url)

```javascript

    let response = null;
    httpBackend.expectGET('/hello').respond({ hello: 'world' });
    superagent.get('/hello', (err, res) => {
      response = res;
    });
    assert.strictEqual(response, null);
    httpBackend.flush();
    assert.deepEqual(response.body, { hello: 'world' });
  
```

## expectPUT(url, validateBody)

```javascript

    let response = null;
    const validateBody = (body) => {
      throw new Error('Body validation failed');
    };
    httpBackend.expectPUT('/hello', validateBody).respond({ hello: 'world' });
    assert.throws(() => {
      superagent.put('/hello').send({ hello: 'world' }).end(() => {});
    }, /Body validation failed/);
  
```

## expectPOST(url, validateBody)

```javascript

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
  
```

## autoFlush option

```javascript

    let response = null;
    httpBackend.expectGET('/hello', { autoFlush: true }).
      respond({ hello: 'world' });
    superagent.get('/hello', (err, res) => {
      response = res;
    });
    assert.deepEqual(response.body, { hello: 'world' });
  
```