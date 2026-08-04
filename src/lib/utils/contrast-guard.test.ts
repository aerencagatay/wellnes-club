import { readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { glob } from 'node:fs/promises'

const ROOT = join(import.meta.dirname, '../../..')
const SELF = join(ROOT, 'src/lib/utils/contrast-guard.test.ts')

async function sourceFiles(): Promise<string[]> {
  const found: string[] = []
  for await (const entry of glob('src/**/*.{ts,tsx,css}', { cwd: ROOT })) {
    const abs = join(ROOT, entry)
    if (abs !== SELF) found.push(abs) // guard kendi kaynağını taramaz
  }
  return found
}

describe('kontrast koruması', () => {
  it('kum asla metin rengi olarak kullanılmaz', async () => {
    const offenders: string[] = []
    for (const file of await sourceFiles()) {
      for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
        if (/\btext-sand\b/.test(line)) {
          offenders.push(`${relative(ROOT, file)}:${i + 1} — text-sand (kremde 1.65:1; kum yalnızca dolgu/çizgi)`)
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('muted-soft yalnızca izin işaretli satırlarda kullanılır', async () => {
    const offenders: string[] = []
    for (const file of await sourceFiles()) {
      for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
        if (/\btext-muted-soft\b/.test(line) && !line.includes('contrast-guard-allow')) {
          offenders.push(`${relative(ROOT, file)}:${i + 1} — text-muted-soft (yalnızca ≥24px; satıra "contrast-guard-allow" ekleyin)`)
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('eski turkuaz token ailesi tamamen kaldırılmıştır', async () => {
    const offenders: string[] = []
    for (const file of await sourceFiles()) {
      for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
        if (/--color-accent|\btext-accent\b|\bbg-accent\b|\bborder-accent\b|accent-deep|accent-hover|#3cc4b2|#2fa697|#1d6b61/i.test(line)) {
          offenders.push(`${relative(ROOT, file)}:${i + 1} — eski accent token'ı`)
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('globals.css yeni token değerlerini tanımlar', () => {
    const css = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8')
    for (const token of [
      '--color-background: #F1EDE4',
      '--color-surface:    #E5DED2',
      '--color-text:       #1B211D',
      '--color-muted:      #5F5D57',
      '--color-muted-soft: #77756E',
      '--color-olive:      #555D49',
      '--color-sand:       #C9B99F',
      '--color-dark:       #171B18',
    ]) {
      expect(css, `eksik token: ${token}`).toContain(token)
    }
  })

  it('globals.css prefers-reduced-motion bloğunu korur', () => {
    const css = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8')
    expect(css).toContain('prefers-reduced-motion: reduce')
  })
})
