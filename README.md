# superagent-httpbackend

Stub out superagent requests using AngularJS' $httpBackend syntax


# Examples

## It configure responses to requests

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

## It throws if an unexpected request gets fired

```javascript

    assert.throws(function() {
      superagent.get('/hello', () => {});
    }, /Unexpected request/);
  
```

## It reset after each test

```javascript

    let response = null;
    httpBackend.expect('GET', '/hello').respond({ hello: 'world' });
    httpBackend.reset();
    assert.throws(function() {
      superagent.get('/hello', () => {});
    }, /Unexpected request/);
  
```

# API

## It expect(verb, url)

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

## It expectGET(url)

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

## It expectPUT(url, validateBody)

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