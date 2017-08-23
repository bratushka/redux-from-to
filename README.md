[![Build Status](https://travis-ci.org/bratushka/redux-from-to.svg?branch=master)](https://travis-ci.org/bratushka/redux-from-to)

# redux-from-to

**redux-from-to** carries resources **from** APIs **to** your redux store.

Stop writing the same old action and reducer logic and [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up your redux application.

## Quick start

Install

```sh
$ npm install redux-from-to
```

or

```sh
$ yarn add redux-from-to
```

Wrap your root reducer:

```js
// store.js or wherever you create your store.

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { wrapper } from 'redux-from-to';

import rootReducer from './rootReducer'


const store = createStore(
  wrapper(rootReducer),
  applyMiddleware(thunk),
)
```

You're all set!


## API

### fromTo(from, to, [through])

_CAUTION: for now, `fromTo` works only with state stored as [Immutable](https://github.com/facebook/immutable-js/) iterables._

Makes the API call, dispatches REQUEST and FAILURE or SUCCESS actions, and populates your store with response data.

**Arguments:**

`from` (Function)

A function returning a Promise.

`to` (Array<string> or Object)

The path to the target location in your store for data returned by `from`.

If `to` is an Array, `fromTo` will automatically create

```js
{
  isRequesting: (boolean),  // true if `from` has not resolved/rejected
  error: (any),             // data returned by `from` rejecting, if any
  data: (any),              // data returned by `from` resolving, if any
}
```

at the target location.

If you want to specify different locations for these three, pass an object like

```js
{
  request: (Array<string>),
  failure: (Array<string>),
  success: (Array<string>),
}
```

`[through]` (Object)

Contains adapters to transform data returned by `from` before it is saved in the store at `to`.

Looks like

```js
{
  errorAdapter: (Function),     // transforms data returned by `from` rejecting, if any
  responseAdapter: (Function),  // transforms data returned by `from` resolving, if any
}
```

Note: This library was written for using with [axios](https://github.com/mzabriskie/axios), so the
 default adapters fit axios. You can see these in `./src/from-to.js`.

## Simple usage

Dispatch `fromTo`

```js
// axios call returns {"mood": "happy"} as response body, 200 as status

dispatch(fromTo(
  () => axios.get('dogs.io/good-boy'),
  ['dogs', 'goodBoy'],
));
```

State before

```js
{
  ...otherData,
  dogs: Immutable.fromJS({}),
}
```

State before `from` resolves/rejects

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

State if `from` rejects

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

State if `from` resolves

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

## Power usage

Dispatch `fromTo`

```js
// axios call returns {results: {"mood": "happy"}} as response body, 200 as status

dispatch(fromTo(
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

State before

```js
{
  ...otherData,
  dogs: Immutable.fromJS({}),
  errors: Immutable.fromJS({}),
  requests: Immutable.fromJS({}),
}
```

State before `from` resolves/rejects

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

State if `from` rejects

```js
{
  ...otherData,
  dogs: Immutable.fromJS({}),
  errors: Immutable.fromJS({
    goodBoy: 'The error is someError',
  }),
  requests: Immutable.fromJS({
    goodBoy: false,
  }),
}
```

State if `from` resolves

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
