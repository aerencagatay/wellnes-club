import { describe, expect, it } from 'vitest'
import tr from '../../messages/tr.json'
import en from '../../messages/en.json'

function flattenKeys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return [prefix]
  return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
    flattenKeys(value, prefix ? `${prefix}.${key}` : key),
  )
}

describe('mesaj dosyaları', () => {
  it('tr ve en aynı anahtar kümesine sahiptir', () => {
    const trKeys = flattenKeys(tr).sort()
    const enKeys = flattenKeys(en).sort()
    expect(enKeys).toEqual(trKeys)
  })

  it('hiçbir değer boş değildir', () => {
    for (const [name, messages] of [['tr', tr], ['en', en]] as const) {
      const walk = (obj: unknown, path: string): void => {
        if (typeof obj === 'string') {
          expect(obj.trim(), `${name}.${path} boş`).not.toBe('')
          return
        }
        if (obj && typeof obj === 'object') {
          for (const [k, v] of Object.entries(obj)) walk(v, path ? `${path}.${k}` : k)
        }
      }
      walk(messages, '')
    }
  })
})
