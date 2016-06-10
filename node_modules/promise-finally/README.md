# Promise Finally

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Simple wrapper to run promise "finally" logic.

## Installation

```
npm install promise-finally --save
```

## Usage

Uses [`any-promise`](https://github.com/kevinbeaty/any-promise) internally.

```js
import promiseFinally from 'promise-finally'

const p = Promise.resolve('something')

promiseFinally(p, () => ...)
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/promise-finally.svg?style=flat
[npm-url]: https://npmjs.org/package/promise-finally
[downloads-image]: https://img.shields.io/npm/dm/promise-finally.svg?style=flat
[downloads-url]: https://npmjs.org/package/promise-finally
[travis-image]: https://img.shields.io/travis/blakeembrey/promise-finally.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/promise-finally
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/promise-finally.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/promise-finally?branch=master
