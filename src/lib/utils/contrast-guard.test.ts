import { readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { glob } from 'node:fs/promises'

const ROOT = join(import.meta.dirname, '../../..')

// Bu dosyanın kendisi kural ihlali metinlerini (regex örnekleri, mesaj dizeleri)
// literal olarak içerir, bu yüzden kendi kendini tarayıp yanlış pozitif üretmemesi
// için sourceFiles() taramadan kendisini hariç tutar.
const SELF = join(import.meta.dirname, 'contrast-guard.test.ts')

async function sourceFiles(): Promise<string[]> {
  const found: string[] = []
  for await (const entry of glob('src/**/*.{ts,tsx,css}', { cwd: ROOT })) {
    const absolute = join(ROOT, entry)
    if (absolute === SELF) continue
    found.push(absolute)
  }
  return found
}

describe('kontrast koruması', () => {
  it('hiçbir dosyada text-accent veya text-body-muted yardımcı sınıfı kullanılmaz', async () => {
    const offenders: string[] = []
    for (const file of await sourceFiles()) {
      const source = readFileSync(file, 'utf8')
      // text-accent-deep izinlidir; text-accent tek başına değildir.
      for (const [index, line] of source.split('\n').entries()) {
        if (/\btext-accent(?!-deep)\b/.test(line)) {
          offenders.push(`${relative(ROOT, file)}:${index + 1} — text-accent (metin için text-accent-deep kullanın)`)
        }
        if (/\btext-body-muted\b/.test(line) && !line.includes('contrast-guard-allow')) {
          offenders.push(`${relative(ROOT, file)}:${index + 1} — text-body-muted (yalnızca ≥24px metinde, satıra "contrast-guard-allow" yorumu ekleyin)`)
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('globals.css üç turkuaz token\'ının tümünü tanımlar', () => {
    const css = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8')
    expect(css).toContain('--color-accent:       #3cc4b2')
    expect(css).toContain('--color-accent-hover: #2fa697')
    expect(css).toContain('--color-accent-deep:  #1d6b61')
  })

  it('globals.css gövde metnini #6f6f6f olarak tanımlar', () => {
    const css = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8')
    expect(css).toContain('--color-body:         #6f6f6f')
  })
})
