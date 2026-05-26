import type { ZxcvbnResult } from '@zxcvbn-ts/core'

type CheckFn = (password: string, userInputs?: (string | number)[]) => ZxcvbnResult

let checkPromise: Promise<CheckFn> | null = null

// Lazy chunk: the dictionaries weigh ~150 KB gzip; we only pay that cost
// on pages where the user is actually typing a new password.
export function getZxcvbnCheck(): Promise<CheckFn> {
  if (!checkPromise) {
    checkPromise = (async () => {
      const [core, common, en] = await Promise.all([
        import('@zxcvbn-ts/core'),
        import('@zxcvbn-ts/language-common'),
        import('@zxcvbn-ts/language-en'),
      ])
      core.zxcvbnOptions.setOptions({
        dictionary: {
          ...common.dictionary,
          ...en.dictionary,
        },
        graphs: common.adjacencyGraphs,
        useLevenshteinDistance: true,
        translations: en.translations,
      })
      return core.zxcvbn
    })()
  }
  return checkPromise
}
