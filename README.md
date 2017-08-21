[![Build Status](https://travis-ci.org/bratushka/redux-carrier.svg?branch=master)](https://travis-ci.org/bratushka/redux-carrier)

# redux-carrier

- [Why? (which problem do we have)](#why---which-problem-do-we-have-)
- [So? (should we continue struggling)](#so---should-we-continue-struggling-)
- [How? (in which way does this library resolve the problem)](#how---in-which-way-does-this-library-resolve-the-problem-)
- [Installation](#installation)
- [API](#api)
  * [carrier(from, to, [through])](#carrier-from--to---through--)
- [Simple example](#simple-example)
  * [When resolves](#when-resolves)
  * [When rejects](#when-rejects)
- [Complex example](#complex-example)
  * [When resolves](#when-resolves-1)

## Why? (which problem do we have)

Working with REST APIs we often have to make lots of calls to the server. Each call should produce a REQUEST/SUCCESS or
 REQUEST/FAILURE pair of actions, which should be 100% covered with tests. Each of the actions should have its own case
 in the reducer, each of them should be 100% tested too. Usually these actions/reducers/tests are 90% equal, so creating
 this piece of functionality is really boring.

## So? (should we continue struggling)

This library was written to get rid of all this boring copy-paste-modify process.

## How? (in which way does this library resolve the problem)

Actions, reducer and tests are already written, just use it.

## Installation

1. Fetch the library from npm:
```sh
you@your-computer /path/to/your/project $ yarn add redux-carrier
```
2. Wrap your main reducer:
```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { wrapper } from 'redux-carrier';

import mainReducer from './mainReducer'


const store = createStore(
  wrapper(mainReducer),
  applyMiddleware(thunk),
)
```
3. You're all set!

## API

### carrier(from, to, [through])

Makes all the job for you. Dispatches REQUEST-FAILURE-SUCCESS, manages data in your store.

**Arguments:**
1. `from` (Function): a function returning a Promise. Should resolve to dispatch SUCCESS or reject for FAILURE.
 Data, returned by this Promise, will be saved in the store.
2. `to` (Object or Array<string>): target in your state, where you want to store information.

`to` as object should contain 3 properties:
 - `request` (Array<string>): target to save boolean value if `from()` did not resolve/reject yet,
 - `failure` (Array<string>): target to save returned data on reject,
 - `success` (Array<string>): target to save returned data on resolve.

If `to` is an array of strings - it will be transformed into an object:
```js
{
  request: [...to, 'isRequesting'],
  failure: [...to, 'error'],
  success: [...to, 'data'],
}
```

CAUTION: this library will work only with iterable properties of the state, created by [immutable](https://github.com/facebook/immutable-js/).

3. `[ through ]` (Object): contains adapters, which should return transformed data before saving it
 to the store. Can contain following properties:
 - `responseAdapter` (Function): will receive resolved data as the only argument,
 - `errorAdapter` (Function): will receive rejected data as the only argument.
This library was written for sing with [axios](https://github.com/mzabriskie/axios), so it has
 default adapters, which are available in `./src/carrier.js`.

## Simple example

### When resolves

State before:
```js
{
  ...otherData,
  dogs: Immutable.fromJS({}),
}
```
Dispatch `carrier`:
```js
// axios call returns {"mood": "happy"} as response body, 200 as status

dispatch(carrier(
  () => axios.get('dogs.io/good-boy'),
  ['dogs', 'goodBoy'],
));
```
State during the axios call:
```js
{
  ...otherData,
  dogs: Immutable.fromJS({
    goodBoy: {
      isRequesting: true,
    },
  }),
}
```
State after the axios call:
```js
{
  ...otherData,
  dogs: Immutable.fromJS({
    goodBoy: {
      isRequesting: false,
      data: {
        mood: 'happy',
      },
    },
  }),
}
```

### When rejects

State before:
```js
{
  ...otherData,
  dogs: Immutable.fromJS({}),
}
```
Dispatch `carrier`:
```js
// axios call returns {"not": "found"} as response body, 404 as status

dispatch(carrier(
  () => axios.get('dogs.io/bad-boy'), 
  ['dogs', 'goodBoy'],
));
```
State during the axios call:
```js
{
  ...otherData,
  dogs: Immutable.fromJS({
    badBoy: {
      isRequesting: true,
    },
  }),
}
```
State after the axios call:
```js
{
  ...otherData,
  dogs: Immutable.fromJS({
    badBoy: {
      isRequesting: false,
      error: {
        data: { not: 'found' },
        status: 404,
      },
    },
  }),
}
```

## Complex example

### When resolves

State before:
```js
{
  ...otherData,
  dogs: Immutable.fromJS({}),
  errors: Immutable.fromJS({}),
  requests: Immutable.fromJS({}),
}
```
Dispatch `carrier`:
```js
// axios call returns {results: {"mood": "happy"}} as response body, 200 as status

dispatch(carrier(
  () => axios.get('dogs.io/good-boy'),
  {
    request: ['dogs', 'goodBoy'],
    failure: ['errors', 'goodBoy'],
    success: ['requests', 'goodBoy'],
  },
  {
    errorAdapter: error => `The error is ${error}`,
    responseAdapter: response => response.data.results,
  },
));
```
State during the axios call:
```js
{
  ...otherData,
  dogs: Immutable.fromJS({}),
  errors: Immutable.fromJS({}),
  requests: Immutable.fromJS({
    goodBoy: true,
  }),
}
```
State after the axios call:
```js
{
  ...otherData,
  dogs: Immutable.fromJS({
    goodBoy: {
      mood: 'happy',
    },
  }),
  errors: Immutable.fromJS({}),
  requests: Immutable.fromJS({
    goodBoy: false,
  }),
}
```
