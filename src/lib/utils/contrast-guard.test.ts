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

// Kum'u metin rengi olarak kullanmanın üç yazılışı da yakalanır: çıplak
// yardımcı sınıf (`text-sand`, `hover:text-sand` gibi önekliler dahil —
// `\b` sınırı önek ayracının (`:`) hemen ardından da tetiklenir), rastgele
// değer olarak CSS değişkeni (`text-[var(--color-sand)]`) ve ham hex
// (`text-[#C9B99F]`). İkinci ve üçüncü biçim, `text-sand` yardımcı adını
// hiç yazmadan aynı rengi üretmenin bir yolu olduğu için ayrıca
// kontrol edilmezse guard'ı komple atlatır.
const SAND_TEXT_RE = /\btext-(?:sand\b|\[[^\]]*(?:--color-sand|#d9cbb8)[^\]]*\])/i

const ORANGE_TEXT_RE = /\btext-(?:orange(?!-deep)\b|\[[^\]]*(?:--color-orange(?!-deep)|#e8792b)[^\]]*\])/i

describe('kontrast koruması', () => {
  it('kum asla metin rengi olarak kullanılmaz (hiçbir yazılışla)', async () => {
    const offenders: string[] = []
    for (const file of await sourceFiles()) {
      for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
        if (SAND_TEXT_RE.test(line) && !line.includes('contrast-guard-allow')) {
          offenders.push(
            `${relative(ROOT, file)}:${i + 1} — kum metin olarak kullanılıyor (kremde 1.65:1; kum yalnızca dolgu/çizgi, ya da koyu zeminde satıra "contrast-guard-allow" ekleyin)`,
          )
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

  /**
   * Poster turuncusu (`--color-orange`, #E8792B) krem zemin üzerinde 2.47:1
   * verir — AA'nın çok altında. DEKORATİF bir renktir: güneş, doodle, ayraç,
   * kolaj lekesi. Metin rengi olarak kullanıldığı an okunmaz hâle gelir.
   *
   * Metin/CTA için AYRI bir token vardır: `--color-orange-deep` (#B4501A),
   * üzerine beyaz metinle 5.12:1. Bu yüzden desen `orange-deep`i KASITLI
   * olarak dışarıda bırakır (`(?!-deep)`), yoksa doğru kullanımı da yakalardı.
   */
  it('poster turuncusu metin rengi olarak kullanılmaz', async () => {
    const offenders: string[] = []
    for (const file of await sourceFiles()) {
      for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
        if (ORANGE_TEXT_RE.test(line) && !line.includes('contrast-guard-allow')) {
          offenders.push(
            `${relative(ROOT, file)}:${i + 1} — poster turuncusu metin olarak kullanılıyor (kremde 2.47:1; metin/CTA için text-orange-deep kullanın)`,
          )
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('globals.css yeni token değerlerini tanımlar', () => {
    const css = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8')
    for (const token of [
      '--color-background: #F2EBE6',
      '--color-surface:    #E8DFD6',
      '--color-text:       #141414',
      '--color-muted:      #55514C',
      '--color-muted-soft: #6E6960',
      '--color-olive:      #4A5A3B',
      '--color-forest:     #5A6B47',
      '--color-indigo:     #160572',
      '--color-orange:      #E8792B',
      '--color-orange-deep: #B4501A',
      '--color-yellow:     #F2C94C',
      '--color-sand:       #D9CBB8',
      '--color-dark:       #14180F',
    ]) {
      expect(css, `eksik token: ${token}`).toContain(token)
    }
  })

  it('globals.css prefers-reduced-motion bloğunu korur', () => {
    const css = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8')
    expect(css).toContain('prefers-reduced-motion: reduce')
  })
})
