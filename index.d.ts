export type CtxFunction<F extends Function> = F & {
  fn: F
  mfn: F
  reset: () => void
  unCache: () => void
}

export type MemoizeOptions = {
  once?: boolean
  eq?: (prevArgs: any[], nextArgs: []) => boolean
  cache?: Map<any[], { result: any; this: any }>
  skipEqualThis?: boolean
}

export function withCtx<T extends Function>(fn: T, opts?: MemoizeOptions): CtxFunction<T>

export function robust<T extends Function>(fn: T, opts?: MemoizeOptions): CtxFunction<T>

export default function memoize<T extends Function>(fn: T, opts?: MemoizeOptions): T
