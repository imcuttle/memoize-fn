/* eslint-disable prefer-rest-params */
/**
 * A memoization library that caches the result of the different arguments
 * @author imcuttle
 */
import shallowEqual from 'shallowequal'

/**
 * Memoize function that caches the result of the different arguments.
 * @public
 * @param fn {Function}
 * @param options {MemoizeOptions}
 * @return memoizeFn {Function}
 */
export default function memoize(
  fn,
  { once = false, eq = (prevArgs, newArgs) => shallowEqual(prevArgs, newArgs), cache = new Map() } = {}
) {
  function memoizeFn() {
    let curKey = [].slice.apply(arguments)
    let isContainsKey = false
    let containsKey
    for (let key of cache.keys()) {
      if (cache.get(key).this === this && eq(curKey, key)) {
        isContainsKey = true
        containsKey = key
        break
      }
    }

    if (isContainsKey && containsKey) {
      return cache.get(containsKey).result
    }

    // Only cache once like [memoize-one](https://github.com/alexreardon/memoize-one)
    if (once) {
      cache.clear()
    }
    const result = fn.apply(this, arguments)
    cache.set(curKey, { result, this: this })
    return result
  }

  return memoizeFn
}

/**
 * Memoize function that caches the result of the different arguments and with context
 * @public
 * @param fn {Function}
 * @param opts {MemoizeOptions}
 * @return {CtxFunction}
 */
export function withCtx(fn, opts) {
  let ctx
  function wrapFn() {
    return ctx.mfn.apply(this, arguments)
  }

  ctx = Object.assign(wrapFn, {
    fn,
    mfn: fn,
    reset: () => {
      ctx.mfn = memoize(ctx.fn, opts)
    },
    unCache: () => {
      ctx.mfn = ctx.fn
    }
  })
  ctx.reset()

  return ctx
}

/**
 * Memoize function that caches the result of the different arguments and resets memoize function when catches error asynchronously.
 * @public
 * @param fn {Function}
 * @param opts {MemoizeOptions}
 * @return {CtxFunction}
 */
export function robust(fn, opts) {
  let ctx = withCtx(fn, opts)

  function wrapFn() {
    let rlt = ctx.apply(this, arguments)
    if (rlt && typeof rlt.then === 'function' && typeof rlt.catch === 'function') {
      return rlt.catch(err => {
        ctx.reset()
        throw err
      })
    }
    return rlt
  }

  return Object.assign(wrapFn, ctx)
}

/**
 * @public
 * @name MemoizeOptions
 * @type {{}}
 * @param [once=false] {boolean} - Only cache once like [memoize-one](https://github.com/alexreardon/memoize-one)
 * @param [eq=shallowEqual] {(prevArgs, newArgs) => boolean}
 * @param [cache=new Map()] {Map}
 */

/**
 * @public
 * @name CtxFunction
 * @type {Function}
 * @param reset {Function} - Resets cache
 * @param unCache {Function} - Disables cache
 */
