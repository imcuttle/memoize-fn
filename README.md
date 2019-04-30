# memoize-fn

[![Build status](https://img.shields.io/travis/imcuttle/memoize-fn/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/memoize-fn)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/memoize-fn.svg?style=flat-square)](https://codecov.io/github/imcuttle/memoize-fn?branch=master)
[![NPM version](https://img.shields.io/npm/v/memoize-fn.svg?style=flat-square)](https://www.npmjs.com/package/memoize-fn)
[![NPM Downloads](https://img.shields.io/npm/dm/memoize-fn.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/memoize-fn)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> A memoization library that caches the result of the different arguments

## Installation

```bash
npm install memoize-fn
# or use yarn
yarn add memoize-fn
```

## Usage

```javascript
import memoizeFn from 'memoize-fn'
import { withCtx, robust } from 'memoize-fn'

let count = 1
const fn = memoizeFn(() => count++)

fn() // => 1
fn() // => 1
fn('new argument') // => 2
fn() // => 1
count // => 3
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### memoize

Memoize function that caches the result of the different arguments.

#### Parameters

- `fn` {Function}
- `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** {MemoizeOptions} (optional, default `{}`)
  - `options.once` (optional, default `false`)
  - `options.eq` (optional, default `(prevArgs,newArgs)=>shallowEqual(prevArgs,newArgs)`)
  - `options.cache` (optional, default `getDefaultCache()`)

Returns **any** memoizeFn {Function}

### withCtx

Memoize function that caches the result of the different arguments and with context

#### Parameters

- `fn` {Function}
- `opts` {MemoizeOptions}

Returns **[CtxFunction](#ctxfunction)**

### robust

Memoize function that caches the result of the different arguments and resets memoize function when catches error asynchronously.

#### Parameters

- `fn` {Function}
- `opts` {MemoizeOptions}

Returns **[CtxFunction](#ctxfunction)**

### MemoizeOptions

Type: {}

#### Parameters

- `once` {boolean} (optional, default `false`)
- `eq` {(prevArgs, newArgs) => boolean} (optional, default `shallowEqual`)
- `cache` {Map} (optional, default `newMap()`)

### CtxFunction

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

#### Parameters

- `reset` (optional, default `()=>{}`)
- `unCache` (optional, default `()=>{}`)

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
