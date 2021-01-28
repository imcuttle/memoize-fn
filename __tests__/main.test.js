/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
import memoize from '..'
import { withCtx, robust } from '..'

const mkFn = (fn = () => {}) => {
  let mockFn = jest.fn(() => {
    let p = fn()
    if (p && typeof p.then === 'function') {
      return Promise.resolve(p).then(() => mockFn._result)
    }

    return mockFn._result
  })

  mockFn.clear = () => {
    mockFn.setResult()
    mockFn.mockClear()
  }
  mockFn.setResult = result => (mockFn._result = result)

  return mockFn
}

const sandbox = action => {
  try {
    let p = action()
    if (p && typeof p.then === 'function') {
      return p.catch(error => {
        return error
      })
    }
  } catch (e) {
    return e
  }
}

const sandboxObservable = action => {
  let p = action()

  return new Promise(resolve => {
    p.pipe(
      switchMap(x => (console.log(x), x)),
      catchError(err => {
        return of(err)
      })
    ).subscribe(resolve)
  })
}

describe('memoizeFn', function() {
  let normalFn = mkFn()
  let normalWithErrorFn = mkFn(() => {
    throw new Error('normalWithErrorFn')
  })
  let normalFnAsync = mkFn(() => {
    return new Promise(resolve => {
      resolve('hhh')
    })
  })
  let normalWithErrorFnAsync = mkFn(() => {
    return new Promise(resolve => {
      throw new Error('normalWithErrorFnAsync')
    })
  })

  beforeEach(() => {
    normalFn.clear()
    normalWithErrorFn.clear()
    normalFnAsync.clear()
    normalWithErrorFnAsync.clear()
  })

  it('should mem normal', function() {
    normalFn.setResult('666')
    expect(normalFn()).toBe('666')
    expect(normalFn()).toBe('666')

    normalFn.setResult('777')
    expect(normalFn()).toBe('777')

    const memFn = memoize(normalFn)
    expect(memFn()).toBe('777')
    normalFn.setResult('888')
    expect(memFn()).toBe('777')
    expect(normalFn()).toBe('888')
  })

  it('should mem even throw error', function() {
    normalWithErrorFn.setResult('1')
    expect(() => normalWithErrorFn()).toThrowErrorMatchingInlineSnapshot(`"normalWithErrorFn"`)
    expect(normalWithErrorFn).toBeCalledTimes(1)

    sandbox(normalWithErrorFn)
    expect(normalWithErrorFn).toBeCalledTimes(2)

    normalWithErrorFn.clear()
    expect(normalWithErrorFn).toBeCalledTimes(0)
    const memFn = memoize(normalWithErrorFn)
    expect(() => memFn()).toThrowErrorMatchingInlineSnapshot(`"normalWithErrorFn"`)
    sandbox(memFn)
    // Not work when throw error sync
    expect(normalWithErrorFn).toBeCalledTimes(2)
  })

  it('should mem normal by async', async function() {
    normalFnAsync.setResult('1')
    expect(await normalFnAsync()).toBe('1')
    normalFnAsync.setResult('123')
    expect(await normalFnAsync()).toBe('123')

    let cache = new Map()
    const memFn = memoize(normalFnAsync, { cache })
    normalFnAsync.setResult('1')
    expect(await memFn()).toBe('1')
    normalFnAsync.setResult('123')
    expect(await memFn()).toBe('1')

    // different argument
    expect(await memFn({})).toBe('123')

    expect(cache).toMatchInlineSnapshot(`
Map {
  Array [] => Object {
    "result": Promise {},
    "this": undefined,
  },
  Array [
    Object {},
  ] => Object {
    "result": Promise {},
    "this": undefined,
  },
}
`)
  })

  it('should mem with once by async', async function() {
    let cache = new Map()
    const memFn = memoize(normalFnAsync, { cache, once: true })
    normalFnAsync.setResult('1')
    expect(await memFn()).toBe('1')
    normalFnAsync.setResult('123')
    expect(await memFn()).toBe('1')

    // different argument
    expect(await memFn({})).toBe('123')
    expect(cache).toMatchInlineSnapshot(`
Map {
  Array [
    Object {},
  ] => Object {
    "result": Promise {},
    "this": undefined,
  },
}
`)
  })

  it('should mem even throw error by async', async function() {
    expect(await sandbox(normalWithErrorFnAsync)).toMatchInlineSnapshot(`[Error: normalWithErrorFnAsync]`)

    normalWithErrorFnAsync.clear()
    expect(normalWithErrorFnAsync).toBeCalledTimes(0)
    const memFn = memoize(normalWithErrorFnAsync)
    expect(await sandbox(memFn)).toMatchInlineSnapshot(`[Error: normalWithErrorFnAsync]`)
    expect(normalWithErrorFnAsync).toBeCalledTimes(1)

    expect(await sandbox(memFn)).toMatchInlineSnapshot(`[Error: normalWithErrorFnAsync]`)
    // Cached promise
    expect(normalWithErrorFnAsync).toBeCalledTimes(1)
  })

  it('should mem-withCtx normal', function() {
    const memFn = withCtx(normalFn)
    normalFn.setResult('111')
    expect(memFn(1)).toBe('111')
    normalFn.setResult('222')
    expect(memFn(1)).toBe('111')

    // Re cache
    normalFn.clear()
    memFn.reset()
    normalFn.setResult('222')
    expect(memFn(1)).toBe('222')
    normalFn.setResult('333')
    expect(memFn(1)).toBe('222')
    expect(normalFn).toBeCalledTimes(1)

    // Un cache
    normalFn.clear()
    memFn.unCache()
    normalFn.setResult('222')
    expect(memFn(1)).toBe('222')
    normalFn.setResult('333')
    expect(memFn(1)).toBe('333')
    expect(normalFn).toBeCalledTimes(2)
  })

  it('should mem-robust normal even throw error by async', async function() {
    let memFn = robust(normalWithErrorFnAsync)
    expect(await sandbox(memFn)).toMatchInlineSnapshot(`[Error: normalWithErrorFnAsync]`)
    expect(normalWithErrorFnAsync).toBeCalledTimes(1)

    // throws error Async, should reset!
    expect(await sandbox(memFn)).toMatchInlineSnapshot(`[Error: normalWithErrorFnAsync]`)
    expect(normalWithErrorFnAsync).toBeCalledTimes(2)
  })
})
