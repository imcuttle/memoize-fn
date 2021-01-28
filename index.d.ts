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

export function withCtx(fn: Function, opts?: MemoizeOptions): CtxFunction<typeof fn>

export function robust(fn: Function, opts?: MemoizeOptions): CtxFunction<typeof fn>

export default function memoize(fn: Function, opts?: MemoizeOptions): typeof fn
