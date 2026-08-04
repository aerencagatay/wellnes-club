# Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mevcut Serenity Retreats sitesinin görsel ve hareket katmanını, turkuaz temadan Aman Resorts sadeliğinde editorial bir sanat yönüne taşımak — altyapıya dokunmadan.

**Architecture:** Bu bir yeniden yazım değil, katman değişimidir. `src/content/`, `/api/inquiry`, i18n, SEO ve yayın-hazırlık testi aynen korunur. Değişen: `globals.css` token'ları, tipografi, tüm sunum bileşenleri, sayfa kompozisyonları ve yeni bir hareket katmanı. Bileşen **API'leri korunur** (aynı prop'lar) — böylece sayfalar tek tek kırılmadan içeri doğru değiştirilebilir ve 165 test yeşil kalır.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · next-intl 4 · `motion` (framer-motion) · `lenis` · Vitest

**Brief:** [docs/briefs/2026-08-04-editorial-redesign-brief.md](../../briefs/2026-08-04-editorial-redesign-brief.md)

## Global Constraints

Bu bölümün tamamı her görevin gereksinimlerine dahildir.

- **Next.js 16 eğitim verinizden farklıdır.** Kod yazmadan önce ilgili kılavuzu `node_modules/next/dist/docs/` altından okuyun.
- **DOKUNULMAYACAK katmanlar.** Bunlarda değişiklik yapmayın; bir görev gerektiriyorsa durup bildirin:
  `src/content/*` (veri ve seçiciler), `src/app/api/inquiry/route.ts` ve `src/lib/{security,mail,utils/validation.ts,utils/ids.ts,inquiry-client.ts}`, `src/i18n/*`, `src/lib/seo/*`, `src/content/content-readiness.test.ts`.
- **Bileşen API'leri korunur.** Bir bileşenin prop imzasını değiştirmek gerekiyorsa, o bileşenin TÜM çağrı yerlerini aynı görevde güncelleyin ve raporda listeleyin.
- **Yeni renk token'ları** (`globals.css` `@theme inline`):
  `--background: #F1EDE4` · `--surface: #E5DED2` · `--text: #1B211D` · `--muted: #5F5D57` · `--muted-soft: #77756E` · `--olive: #555D49` · `--sand: #C9B99F` · `--dark: #171B18`
- **Bağlayıcı kontrast kuralları** (ölçülmüş):
  - `text-sand` **asla metin rengi değildir** (kremde 1.65:1). Kum yalnızca dolgu, çizgi, ayırıcı.
  - `text-olive` açık zeminde metin olarak geçer (5.90 / 5.15) ama **koyu zeminde yasaktır** (2.53).
  - Koyu (`--dark`) zeminde metin `--background` (14.90) veya `--sand` (9.05) olur.
  - `--muted-soft` (#77756E) yalnızca ≥24px veya ≥18.66px bold (kremde 3.95:1).
  - Dolgu üzerine metin: zeytin dolgu → krem metin (5.90); kum dolgu → koyu metin (8.52).
- **Turkuaz, neon, mor gradyan yok.** Eski `--color-accent` ailesi tamamen kaldırılır.
- **Fontlar:** başlık **Instrument Serif**, gövde **Manrope**, `next/font/google`, `display: 'swap'`, subsets `['latin','latin-ext']` (Türkçe için `latin-ext` zorunlu).
  **Instrument Serif YALNIZCA 400 ağırlığında var** (normal + italic). Başlıklarda `font-bold`/`font-semibold` KULLANILMAZ — tarayıcı taklit-bold üretir ve zarafeti bozar. Vurgu ağırlıkla değil, boyut ve boşlukla yapılır.
- **Köşeler keskin.** Varsayılan `border-radius: 0`. İzin verilen tek istisna: 2–4px, ve yalnızca bir gerekçe varsa. `rounded-full`/`rounded-2xl` yok.
- **Hareket az ve kaliteli.** `transition: all` yok — yalnızca `opacity` ve `transform`. Her animasyon `prefers-reduced-motion: reduce` altında kapanır.
- **Hardcoded kullanıcı metni yok.** Her metin next-intl üzerinden, anahtarlar İKİ mesaj dosyasında.
- **Mekan bölümü gerçek otel fotoğraflarını kullanır** (`public/img/venue/`). Mood bölümlerinde stok serbest. Bkz. brief §6.
- **Veritabanı eklenmez.** Form mevcut `/api/inquiry` ucunu kullanır.
- Her görev `npm test` (165), `npx tsc --noEmit`, `npm run lint`, `npm run build` temiz bırakır. `CHECK_LAUNCH_READY=1 npm test` beklendiği gibi 5 hatayla kalmaya devam eder.
- **`npm run lint`** bu makinede çalışır (~8s). Çalıştırın.
- Commit önekleri: `feat:`, `fix:`, `style:`, `test:`, `chore:`.

---

## Dosya Yapısı

| Dosya | Sorumluluk | Durum |
|---|---|---|
| `src/app/globals.css` | Yeni token'lar, tipografi ölçeği, grain overlay, reduced-motion | Yeniden yazılır |
| `src/lib/fonts.ts` | Instrument Serif + Manrope | Yeniden yazılır |
| `src/lib/utils/contrast-guard.test.ts` | Yeni kontrast kurallarını makine ile uygular | Yeniden yazılır |
| `src/components/motion/smooth-scroll.tsx` | Lenis sağlayıcısı (istemci) | Yeni |
| `src/components/motion/reveal.tsx` | Scroll-reveal sarmalayıcı, staggered destekli | Yeni |
| `src/components/motion/masked-lines.tsx` | Satır-satır mask reveal (hero imza anı) | Yeni |
| `src/components/motion/marquee.tsx` | Yavaş editorial metin şeridi | Yeni |
| `src/components/motion/parallax.tsx` | Hafif parallax sarmalayıcı | Yeni |
| `src/components/ui/*` | 7 temel yapı taşı — API sabit, görünüm yeni | Yeniden stillendirilir |
| `src/components/layout/{navbar,footer,page-hero}.tsx` | Chrome | Yeniden stillendirilir |
| `src/components/home/*` | Ana sayfa bölümleri; bazıları yeni kompozisyon | Yeniden yazılır |
| `src/components/home/coming-soon.tsx` | Gelecek etkinlikler | Yeni |
| `src/components/venue/venue-lightbox.tsx` | Fullscreen galeri | Yeni |
| `src/content/future-events.ts` | Gelecek etkinlik verisi (tipli) | Yeni |
| `src/content/types.ts` | `FutureEvent` tipi eklenir | Genişletilir |
| `src/content/index.ts` | `getFutureEvents()` seçicisi eklenir | Genişletilir |

---

## Task 1: Tasarım token'ları, tipografi ve kontrast koruması

**Files:**
- Modify: `src/app/globals.css` (token bloğu + tipografi ölçeği + yardımcı sınıflar)
- Modify: `src/lib/fonts.ts`
- Modify: `src/app/[locale]/layout.tsx` (font değişken adları)
- Rewrite: `src/lib/utils/contrast-guard.test.ts`

**Interfaces:**
- Produces: Tailwind yardımcı sınıfları `bg-background`, `bg-surface`, `bg-dark`, `text-text`, `text-muted`, `text-muted-soft`, `text-olive`, `bg-olive`, `bg-sand`, `border-sand`; font değişkenleri `--font-instrument-serif`, `--font-manrope`; yardımcı sınıflar `.type-display`, `.type-title`, `.type-lede`, `.type-eyebrow`, `.section-py`, `.section-sm`, `.container-page`, `.grain`.

- [ ] **Step 1: Kontrast koruma testini yeni kurallara göre yeniden yaz (başarısız olacak)**

Bu test önce yazılır ve mevcut kod üzerinde başarısız olur — yeni token'lar henüz yok.

`src/lib/utils/contrast-guard.test.ts` içeriği tamamen değiştirilir:

```ts
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
        if (/accent|#3cc4b2|#2fa697|#1d6b61/i.test(line)) {
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
```

**Dikkat:** üçüncü test `accent` kelimesini tüm `src/` içinde arar. Mevcut kodda çok sayıda eşleşme olacak — bu beklenen RED durumudur ve Task 1'in geri kalanı bunları temizler. Eğer bir dosyada `accent` yalnızca yorum içinde kaldıysa yorumu da güncelleyin; testi zayıflatmayın.

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör**

Run: `npx vitest run src/lib/utils/contrast-guard.test.ts`
Expected: FAIL — eksik token'lar ve çok sayıda `accent` ihlali listelenir. Çıktıyı rapora kaydedin.

- [ ] **Step 3: Fontları değiştir**

`src/lib/fonts.ts`:

```ts
import { Instrument_Serif, Manrope } from 'next/font/google'

// Instrument Serif yalnızca 400 ağırlığında yayınlanıyor. Başlıklarda
// font-bold/semibold kullanmayın — tarayıcı taklit-bold üretir.
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
})

export const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-manrope',
})
```

`src/app/[locale]/layout.tsx` içinde `<body className={...}>` satırındaki değişken adlarını buna göre güncelleyin.

- [ ] **Step 4: `globals.css` token bloğunu ve tipografi ölçeğini yeniden yaz**

`@theme inline` bloğu tamamen değişir. Token adlarındaki hizalama boşlukları Step 1'in testiyle birebir eşleşmelidir:

```css
@theme inline {
  --color-background: #F1EDE4;
  --color-surface:    #E5DED2;
  --color-text:       #1B211D;
  --color-muted:      #5F5D57;
  --color-muted-soft: #77756E;
  --color-olive:      #555D49;
  --color-sand:       #C9B99F;
  --color-dark:       #171B18;

  --font-heading: var(--font-instrument-serif), Georgia, serif;
  --font-body:    var(--font-manrope), system-ui, sans-serif;
}
```

Ardından:

- `body`: `background: var(--color-background)`, `color: var(--color-text)`, `font-family: var(--font-body)`, `line-height: 1.65`.
- `@layer base` içinde `h1..h5`: `font-family: var(--font-heading)`, `font-weight: 400`, `line-height: 1.05`, `letter-spacing: -0.015em`.
- Tipografi yardımcıları **`@layer components` içinde** (bu proje daha önce bunu katmansız bırakıp Tailwind yardımcılarının ezememesi hatasını yaşadı — tekrarlamayın):
  - `.type-display` — `clamp(3rem, 8vw, 6.5rem)`, `line-height: 0.98`
  - `.type-title` — `clamp(2rem, 4vw, 3.25rem)`, `line-height: 1.08`
  - `.type-lede` — `clamp(1rem, 1.3vw, 1.15rem)`, `line-height: 1.75`, `color: var(--color-muted)`, `font-weight: 300`
  - `.type-eyebrow` — `11px`, `letter-spacing: 0.28em`, `uppercase`, `font-weight: 500`, `color: var(--color-muted)`
- `.section-py` → `clamp(96px, 14vw, 180px) 0`; `.section-sm` → `clamp(56px, 9vw, 96px) 0`; `.container-page` → `max-width: 1440px`, `padding-inline: clamp(24px, 6vw, 80px)`.
- **Keskin köşe varsayılanı:** `*, *::before, *::after { border-radius: 0 }` YAZMAYIN (Tailwind'i kırar). Bunun yerine hiçbir bileşende `rounded-*` kullanmayın; Task 3 bunu uygular.
- `.grain` yardımcısı: `position: relative` üzerine `::after` ile çok hafif noise. Inline SVG `data:` URI kullanın (dış dosya yok), `opacity: 0.035`, `pointer-events: none`, `mix-blend-mode: multiply`.
- `:focus-visible { outline: 2px solid var(--color-olive); outline-offset: 3px }`.
- `prefers-reduced-motion: reduce` bloğunu **koruyun** (mevcut hâli doğru).
- `::selection { background: var(--color-sand); color: var(--color-text) }` — kum dolgu üzerine koyu metin, 8.52:1.

- [ ] **Step 5: Eski accent kullanımlarını süpür**

`grep -rn "accent" src/` çalıştırın ve her eşleşmeyi yeni palete taşıyın:
- `text-accent-deep` → bağlama göre `text-olive` (açık zemin) veya `text-sand` (koyu zemin)
- `bg-accent` → `bg-olive` (üzerindeki metin `text-background`) veya `bg-sand` (üzerindeki metin `text-text`)
- `border-accent` → `border-olive` veya `border-sand`
- `text-coral-deep` (hata metinleri) → `text-olive` yerine **kalıcı bir hata rengi** gerekir. Yeni token eklemeyin; hata metinleri için `--color-text` + `font-medium` + `bg-sand/40` şeritli bir sunum kullanın. Gerekçe: palette kırmızı yok ve uydurmak sanat yönünü bozar; hata vurgusu renkle değil ağırlık ve zeminle yapılır.
- `text-olive-deep`, `text-body`, `text-body-deep`, `text-ink*`, `text-cream*` gibi eski adları da yeni token adlarına taşıyın.

- [ ] **Step 6: Testleri çalıştır ve geçtiğini gör**

Run: `npx vitest run src/lib/utils/contrast-guard.test.ts` → PASS (5 test)
Run: `npm test` → 165 (5 skipped). Kırılan test varsa **testi değil kodu** düzeltin.
Run: `npx tsc --noEmit` · `npm run lint` · `npm run build` → hepsi temiz.

- [ ] **Step 7: Görsel doğrulama**

`npm run dev`, ardından `/tr` ve `/en`. Bu aşamada sayfalar **stil olarak dağınık görünecek** — bu normaldir, bileşenler Task 3'te yeniden stillendirilir. Doğrulanacak: hiçbir yerde turkuaz kalmadı, zemin krem, başlıklar Instrument Serif, gövde Manrope, Türkçe karakterler (ş ğ İ ç ö ü) doğru render ediliyor, Tab odak halkası zeytin.

Headless Chrome ile ekran görüntüsü alıp rapora ekleyin.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: replace turquoise tokens with editorial palette and typography"
```

---

## Task 2: Hareket katmanı temeli

**Files:**
- Create: `src/components/motion/smooth-scroll.tsx`, `reveal.tsx`, `masked-lines.tsx`, `marquee.tsx`, `parallax.tsx`
- Create: `src/lib/hooks/use-reduced-motion.ts`
- Modify: `src/app/[locale]/(public)/layout.tsx` (SmoothScroll sarmalayıcı)
- Modify: `package.json`

**Interfaces:**
- Produces:
  ```tsx
  <SmoothScroll>{children}</SmoothScroll>           // istemci, lenis
  <Reveal delay?={number} y?={number}>{...}</Reveal> // scroll-reveal
  <RevealGroup stagger?={number}>{...}</RevealGroup>  // çocuklarını sırayla açar
  <MaskedLines lines={string[]} as?={ElementType} className?={string} />
  <Marquee items={string[]} speed?={number} />
  <Parallax amount?={number}>{...}</Parallax>
  useReducedMotion(): boolean
  ```

- [ ] **Step 1: Bağımlılıkları kur ve React 19 uyumunu doğrula**

```bash
npm install motion lenis
```

`motion`, framer-motion'un güncel paket adıdır. **Kurulumdan sonra doğrulayın:** `npm ls motion lenis` ve React 19 peer uyarısı olup olmadığını raporlayın. Peer çatışması varsa **durun ve bildirin** — sürüm düşürmeyin, kendi başınıza `--force`/`--legacy-peer-deps` kullanmayın.

- [ ] **Step 2: `useReducedMotion` kancasını yaz**

`src/lib/hooks/use-reduced-motion.ts` — `window.matchMedia('(prefers-reduced-motion: reduce)')` dinler, SSR'de `false` döner, `change` olayına abone olur ve temizler.

- [ ] **Step 3: Lenis sağlayıcısını yaz**

`src/components/motion/smooth-scroll.tsx`, `'use client'`:

```tsx
'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    // Hareket azaltma isteniyorsa lenis hiç kurulmaz: tarayıcının kendi
    // anlık scroll'u korunur.
    if (reduced) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])

  return <>{children}</>
}
```

**Kritik:** `globals.css` içinde `html { scroll-behavior: smooth }` varsa **kaldırın**. Lenis ile çakışır — bu proje daha önce bu yüzden bir yanlış-negatif yaşadı (bir CDP scroll testi bu nedenle hatalı sonuç verdi). Ayrıca skip-link ve `BackToTop` hâlâ çalışmalı; lenis kurulu olduğunda `#main` çapasına atlamanın çalıştığını gözle doğrulayın.

- [ ] **Step 4: Reveal, RevealGroup, MaskedLines, Marquee, Parallax yaz**

Hepsi `'use client'`. Kurallar:
- Yalnızca `opacity` ve `transform` animasyonu.
- `useReducedMotion()` true ise **animasyon yok, içerik son hâliyle görünür** (opacity 1, transform none). Gizli kalmamalı.
- `Reveal`: `whileInView` + `viewport={{ once: true, margin: '-10% 0px' }}`, süre 0.7s, easing yumuşak.
- `RevealGroup`: `staggerChildren` ile çocukları sırayla açar; varsayılan 0.08s.
- `MaskedLines`: her satır `overflow: hidden` bir sarmalayıcı içinde, içindeki satır `translateY(100%)` → `0`. Satır başına 0.09s gecikme. Hero'nun imza anı.
- `Marquee`: iki kopya yan yana, sonsuz yatay kayma, `speed` saniye cinsinden tam tur süresi (varsayılan 40). Hover'da durmaz (sakin kalmalı). `aria-hidden` — dekoratif.
- `Parallax`: `useScroll` + `useTransform` ile küçük `y` kayması, varsayılan `amount = 60` px. Abartma.

- [ ] **Step 5: Layout'a bağla**

`src/app/[locale]/(public)/layout.tsx` içinde `<SmoothScroll>` ile sar. **Önemli:** bu layout `async` ve `setRequestLocale` çağırıyor — statik render bu sayede çalışıyor. `SmoothScroll` bir istemci bileşeni olarak *içine* yerleştirilir; layout'un kendisi sunucu bileşeni kalır. Build sonrası rota tablosunu kontrol edip `●`/`○` işaretlerinin `ƒ`'ye dönmediğini doğrulayın.

- [ ] **Step 6: Doğrula**

Run: `npm test` (165) · `npx tsc --noEmit` · `npm run lint` · `npm run build`

Build çıktısında rota tablosunu rapora yapıştırın — Task 1 sonrası ile aynı statik/dinamik dağılım olmalı.

Headless Chrome ile gözlemleyin ve **observed/reasoned** olarak etiketleyin:
- Scroll yumuşak (lenis aktif)
- İşletim sisteminde "hareketi azalt" açıkken lenis kurulmuyor ve tüm içerik görünür kalıyor (gizli kalan bölüm yok)
- Skip link `#main`'e atlıyor

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add motion layer with lenis and reduced-motion fallbacks"
```

---

## Task 3: Temel UI bileşenleri — editorial görünüm

**Files:**
- Modify: `src/components/ui/{button,section,eyebrow,badge,chip,accordion,gallery-strip}.tsx`

**Interfaces:**
- Consumes: Task 1 token'ları
- Produces: **prop imzaları değişmez.** `Button` (`variant: 'primary'|'secondary'|'ghost'`, `size: 'md'|'lg'`, `href?`, forwards rest), `Section` (`background: 'background'|'surface'|'dark'`, `size: 'py'|'sm'`), `Eyebrow` (`className?`), `Badge` (`tone`), `Chip` (`active`), `Accordion` (`items`), `GalleryStrip` (`images`).

**Not:** `Section`'ın `background` prop değerleri eski `'cream'|'cream-2'|'cream-3'|'ink'` yerine yeni adlara geçer. Bu bir API değişikliğidir — **tüm çağrı yerlerini bu görevde güncelleyin** ve raporda listeleyin.

- [ ] **Step 1: Button'ı yeniden stillendir**

- Keskin köşe (`rounded-none`), `border-radius` yok.
- `primary`: `bg-olive text-background` (5.90:1), hover'da hafif koyulaşma.
- `secondary`: `bg-text text-background`.
- `ghost`: şeffaf zemin, `text-text`, 1px `border-text/25`, hover'da `border-text/60`.
- Tipografi: Manrope, `font-weight: 400`, `letter-spacing: 0.08em`, `uppercase`, `text-xs`.
- Dolgu: `md` → `px-8 py-4`, `lg` → `px-10 py-5`.
- Geçiş yalnızca `background-color, border-color, color`.
- **Koru:** `href` verildiğinde dış/iç bağlantı ayrımı, `...rest` yayılımı üç dalda da (bu daha önce bir hata kaynağıydı — `onClick` düşüyordu).

- [ ] **Step 2: Section'ı yeni zemin adlarına taşı**

```tsx
const BACKGROUNDS = {
  background: 'bg-background',
  surface: 'bg-surface',
  // Koyu bölümde başlık, eyebrow ve lede zorla krem yapılır: bu sınıflar
  // @layer components içinde kendi renklerini set ettiği için miras yetmez.
  dark: 'bg-dark text-background [&_:where(h1,h2,h3,h4,h5)]:text-background [&_.type-lede]:text-sand [&_.type-eyebrow]:text-sand',
} as const
```

Ardından `grep -rn "background=\"cream\|background='cream\|background=\"ink\|background='ink" src/` ile tüm çağrı yerlerini bulup güncelleyin.

- [ ] **Step 3: Eyebrow, Badge, Chip, Accordion, GalleryStrip**

- `Eyebrow`: `.type-eyebrow` sınıfını kullanır, `className` ile birleşir.
- `Badge`: dolgu tabanlı, keskin köşe. `olive` → `bg-olive text-background`; `sand` → `bg-sand text-text`; `neutral` → `border border-text/20 text-muted`. **Kırmızı/coral yok.**
- `Chip`: keskin köşe, `active` → `bg-text text-background`; pasif → `border border-text/20 text-muted`.
- `Accordion`: `<details>` tabanlı kalır (JS'siz çalışması bir gereksinim). Ayırıcı `border-sand`, `summary` başlığı Instrument Serif, ikon yerine ince bir `+`/`−` çizgi göstergesi.
- `GalleryStrip`: keskin köşe, `next/image`, `alt` zorunlu kalır. Hover'da çok hafif `scale(1.02)`.

- [ ] **Step 4: Doğrula ve commit**

Run: `npm test` · `npx tsc --noEmit` · `npm run lint` · `npm run build` — hepsi temiz.
Kontrast koruması `text-sand` ihlallerini yakalar; Badge'in `bg-sand text-text` kullanımı **dolgu** olduğu için sorun değil, ama yanlışlıkla `text-sand` yazdıysanız test söyler.

```bash
git add -A
git commit -m "style: rework base UI components for the editorial direction"
```

---

## Task 4: Chrome — navbar, footer, page-hero

**Files:**
- Modify: `src/components/layout/{navbar,footer,page-hero}.tsx`

- [ ] **Step 1: Navbar**

- Sayfa tepesinde **tamamen şeffaf**, ince, çerçevesiz. Hero'nun üzerinde yüzer.
- Scroll > 40px sonrası: `bg-background/92` + `backdrop-blur-[2px]` + alt ince `border-sand` çizgisi. Geçiş yalnızca `background-color, border-color`.
- Hero üzerindeyken metin `text-background` (koyu görsel üzerinde), scroll sonrası `text-text`. Bu iki durumu istemci tarafında bir `scrolled` state ile yönetin — mevcut bileşen zaten `'use client'`.
- Logo: Instrument Serif, `tracking-tight`.
- Menü: Manrope, `text-xs`, `uppercase`, `tracking-[0.14em]`.
- **Koru:** mobil menü odak tuzağı (odak panele taşınır, kapanışta tetikleyiciye döner), `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-controls`, `a, button:not([disabled])` seçicisi, Escape. Bunlar zorlu bir turda kazanıldı; bozmayın.

- [ ] **Step 2: Footer**

Minimal ve ferah: marka adı Instrument Serif büyük, altında ince bir `border-sand` çizgi, üç kolon (keşfet / iletişim / yasal), en altta `© {yıl}`. Kart yok, kutu yok.

- [ ] **Step 3: PageHero**

İç sayfaların editorial başlığı: geniş üst boşluk, `.type-eyebrow` + `.type-display` başlık + opsiyonel `.type-lede`. Görsel verildiğinde tam-taşma ve `Parallax` ile hafif hareket. **Başlık `MaskedLines` ile açılır.**

- [ ] **Step 4: Doğrula ve commit**

Dört komut temiz. Headless Chrome ile: navbar hero üzerinde şeffaf ve okunur, scroll sonrası krem zemine geçiyor, mobil menü hâlâ odak tuzağı yapıyor (Escape + Tab döngüsü + kapanışta odak dönüşü). **observed** olarak etiketleyin.

```bash
git add -A
git commit -m "style: rework navbar, footer and page hero"
```

---

## Task 5: Ana sayfa — hero, kamp paneli, günlük akış

**Files:**
- Modify: `src/components/home/hero-home.tsx`
- Create: `src/components/home/camp-panel.tsx`
- Modify: `src/components/camps/daily-flow.tsx`
- Modify: `src/app/[locale]/(public)/page.tsx`
- Modify: `messages/tr.json`, `messages/en.json`

- [ ] **Step 1: Hero**

- Tam ekran (`min-h-svh` — mobil tarayıcı çubuğu için `svh`, `vh` değil).
- Arka plan: `site` yapılandırmasında bir `heroVideo` yolu **varsa** `<video autoPlay muted loop playsInline preload="metadata">`, yoksa `next/image` ile `priority` bir fotoğraf. **Video dosyası uydurmayın** — şu an yok, fallback fotoğraf kullanılır. Mevcut uygun görsel: `/img/venue/hero.webp`.
- Üzerine `bg-dark/35` bindirme + `.grain`.
- İçerik: `.type-eyebrow` (`ASSOS · ÇANAKKALE`), `MaskedLines` ile iki satır başlık, alt satır, `Yoga · Pilates · Nature · Rest` etiket şeridi, tek `Button`.
- Metin `text-background`; koyu bindirme üzerinde 14.90:1.

Mesaj anahtarları (`home.hero.*`) — Türkçe ve İngilizce:
- `titleLine1` → `Daha yavaş` / `A slower`
- `titleLine2` → `bir yaşam.` / `way of living.`
- `subtitle` → `Assos'ta üç gün.` / `Three days in Assos.`
- `tags` → `Yoga · Pilates · Doğa · Dinlenme` / `Yoga · Pilates · Nature · Rest`
- `cta` → `Retreat'i keşfet` / `Discover the retreat`

Marka İngilizce sloganı iki dilde de korumak isterse `tr` değerini İngilizce yapmak tek satırlık bir mesaj düzenlemesidir; varsayılan Türkçe çeviridir.

- [ ] **Step 2: Kamp paneli**

`camp-panel.tsx` — `getUpcomingCamps(today, 1)`'in ilk kampını alır, dört bilgiyi ince dikey ayırıcılarla yatay dizer (tarih aralığı, konum, kontenjan, süre), yanında büyük `Button` → `/basvuru?kamp=<slug>`. Tarih `formatDateRange` ile, kontenjan/süre mevcut mesaj anahtarlarıyla. Yaklaşan kamp yoksa `null` döner.

- [ ] **Step 3: Günlük akış — yatay zaman çizgisi**

`daily-flow.tsx` dikey listeden **yatay zaman çizgisine** dönüşür:
- Masaüstü: yatay eksen, üstte ince `border-sand` çizgi, her madde çizgi üzerinde bir nokta + altında saat (Instrument Serif) + başlık + kısa açıklama. `overflow-x: auto` ile taşma kaydırılır.
- Mobil: dikey kalır (yatay okunmaz).
- `RevealGroup` ile maddeler sırayla açılır.
- **Koru:** `note` prop'u (opsiyonel) ve mevcut `items`/`locale` imzası — `/deneyim` sayfası bu prop'u kullanıyor.

- [ ] **Step 4: Doğrula ve commit**

Dört komut temiz. Headless Chrome ile ana sayfayı iki dilde gözlemleyin: hero tam ekran, başlık satır-satır açılıyor, kamp paneli doğru kampı gösteriyor, günlük akış masaüstünde yatay / mobilde dikey. Ekran görüntülerini rapora ekleyin.

```bash
git add -A
git commit -m "feat: rebuild homepage hero, camp panel and horizontal daily flow"
```

---

## Task 6: Ana sayfa — manifesto, mekan, eğitmenler, coming soon, kapanış

**Files:**
- Modify: `src/components/home/{manifesto,venue-preview,teachers-preview,testimonials,newsletter-cta,trust-strip,includes-list,benefit-block,benefits-section}.tsx`
- Create: `src/components/home/coming-soon.tsx`, `src/components/venue/venue-lightbox.tsx`
- Create: `src/content/future-events.ts`
- Modify: `src/content/types.ts`, `src/content/index.ts`, `src/content/content.test.ts`
- Modify: `src/app/[locale]/(public)/page.tsx`, `messages/tr.json`, `messages/en.json`

- [ ] **Step 1: `FutureEvent` tipini ve verisini ekle (TDD)**

`src/content/types.ts`'e ekleyin:

```ts
export type FutureEventKind = 'hiking' | 'camping' | 'running' | 'water-sports' | 'wildlife'

export type FutureEvent = {
  slug: string
  kind: FutureEventKind
  title: Localized
  summary: Localized
  image: string
}
```

`src/content/future-events.ts` — beş kayıt (hiking, camping, running, su sporları, ATV wildlife). `image` yolları **var olan** dosyalara işaret etmeli veya bu görev içinde eklenmeli; uydurma yol yazmayın.

`src/content/index.ts`'e `getFutureEvents(): FutureEvent[]` ekleyin (dizinin kopyasını döndürür — mevcut desen).

`src/content/content.test.ts`'e ekleyin (önce yazın, başarısız olsun): her `FutureEvent` için slug tekilliği, kebab-case, `Localized` alanların iki dilde dolu olması, `image` yolunun `/img/` ile başlaması.

- [ ] **Step 2: Manifesto — numaralı bölümler**

`01`, `02`, `03` numaralı editorial bölümler. Numara Instrument Serif, büyük, `text-sand` **değil** — `text-muted-soft` ile büyük punto (≥24px olduğu için izinli; satıra `contrast-guard-allow` yorumu ekleyin) veya `text-olive`. Her bölüm: numara + kısa başlık + iki satır metin. `RevealGroup` ile sırayla.

- [ ] **Step 3: Marquee şeridi**

`Marquee` ile yavaş kayan şerit: `Yoga · Pilates · Nature · Rest · Longevity`. `aria-hidden`, dekoratif, `border-sand` üst/alt çizgi arasında.

- [ ] **Step 4: Mekan bölümü + lightbox**

`venue-preview.tsx`: solda büyük ana fotoğraf (`Parallax` ile hafif), sağda iki küçük detay fotoğrafı, altında kısa metin ve `Button`. **Gerçek otel fotoğrafları** (`public/img/venue/`).

`venue-lightbox.tsx` (`'use client'`): fullscreen galeri.
- `role="dialog"`, `aria-modal="true"`, `aria-label`.
- Escape kapatır; odak açılışta kapatma düğmesine taşınır, kapanışta tetikleyiciye döner; Tab döngüsü panelde kalır. **Navbar'ın odak tuzağı desenini birebir izleyin** — çalıştığı kanıtlanmış tek desen o.
- Sol/sağ ok tuşlarıyla gezinme.
- Açıkken `body` kaydırması kilitlenir; lenis aktifken de kilitlendiğini doğrulayın (lenis `stop()`/`start()` gerekebilir).

- [ ] **Step 5: Eğitmenler — dergi düzeni**

Kart yok. Büyük portre + yalnızca isim (Instrument Serif) + uzmanlık (`.type-eyebrow`) + iki satır bio. Asimetrik hizalama: portreler dönüşümlü olarak farklı dikey ofsetlerde. `TeacherCard`'ın API'si korunur ama görünüm tamamen değişir; `/hocalar` ve kamp detay sayfası da bunu kullanıyor — ikisini de gözle kontrol edin.

- [ ] **Step 6: Coming soon**

`coming-soon.tsx` — `getFutureEvents()` üzerinden editorial mozaik (kalabalık grid değil): her etkinlik büyük görsel + isim + tek satır. Bölüm başlığında anlaşmalı oteller ve anlaşmalı pilates hocaları vurgusu (mesaj anahtarı ile).

- [ ] **Step 7: Kapanış CTA + yorumlar + bülten + kalan bölümler**

- Kapanış: `Section background="dark"` tam ekran hissi, `.type-display` başlık (`Your weekend away from everything.` / Türkçe karşılığı), tarih satırı, tek `Button`. Koyu zeminde metin krem/kum.
- `testimonials`: alıntılar Instrument Serif, kart yok, ince ayırıcılar. **Geliştirme uyarısı korunur** (`isPlaceholder`).
- `newsletter-cta`: mevcut `submitInquiry` bağlantısı ve `Field`/`fieldDescribedBy` kullanımı **korunur**; yalnızca görünüm değişir. Keskin köşe, ince alt çizgili input.
- `trust-strip`, `includes-list`, `benefit-block`, `benefits-section`: editorial düzene taşınır. `trust-strip`'in dört doğrulanabilir bilgisi **aynen korunur** — basın logosu, puan, uydurma sosyal kanıt eklenmez.

- [ ] **Step 8: Sayfayı birleştir ve doğrula**

`page.tsx` bölüm sırası: Hero → CampPanel → Marquee → Manifesto → DailyFlow → Includes → Benefits → Teachers → Venue → ComingSoon → Testimonials → Newsletter → DarkCTA.

Dört komut temiz. Headless Chrome ile iki dilde tüm bölümleri gözlemleyin. Lightbox'ı klavyeyle test edin: açılış odağı, Escape, Tab döngüsü, ok tuşları, kapanışta odak dönüşü — **observed** olarak, `elementFromPoint` ile örtülme kontrolü dahil.

```bash
git add -A
git commit -m "feat: rebuild homepage editorial sections with lightbox and coming-soon"
```

---

## Task 7: Kamp listesi ve kamp detay sayfası

**Files:**
- Modify: `src/components/camps/{camp-card,camp-filters,camp-detail-hero,camp-cta-card,camp-cta-bar,includes-excludes}.tsx`
- Modify: `src/app/[locale]/(public)/kamplar/page.tsx`, `kamplar/[slug]/page.tsx`

- [ ] **Step 1: CampCard — editorial**

Kart çerçevesi yok. Tam-taşma görsel + altında ince `border-sand` çizgi + tarih (`.type-eyebrow`) + başlık (Instrument Serif) + fiyat satırı. Rozet dolgu tabanlı, keskin. `getCampBadge` eşlemesi korunur; `coral` tonu artık `sand`/`neutral` olur.

- [ ] **Step 2: Filtreler**

`Chip` tabanlı kalır, URL sözleşmesi (`?program=`, `?level=`) ve `{ scroll: false }` **korunur**. Görünüm: keskin köşe, ince çizgiler.

- [ ] **Step 3: Detay sayfası**

- `camp-detail-hero`: tam-taşma görsel + `Parallax` + `MaskedLines` başlık.
- Sağ sütun `camp-cta-card` sabit (sticky) kalır; keskin köşe, `bg-surface`, ince çerçeve.
- `camp-cta-bar` mobil altta kalır. **`bottom-24 lg:bottom-5` ofsetleri `whatsapp-fab` ve `back-to-top` üzerinde korunur** — bu barın sabit kontrolleri örtmesini engelliyor.
- `includes-excludes`: iki kolon, ikon yerine ince `+`/`−` işaretleri veya `border-sand` madde çizgileri.
- **Koru:** `Event` JSON-LD, `generateStaticParams`, mutlak `og:image`, CTA durumunun `getCampBadge`'den türetilmesi, `closed` durumunda `href` verilmeden gerçek `disabled` buton.

- [ ] **Step 4: Doğrula ve commit**

Dört komut temiz. Build çıktısında `kamplar/[slug]`'ın `●` (SSG, 6 yol) kaldığını doğrulayın. Headless Chrome ile listeyi ve bir detay sayfasını iki dilde gözlemleyin; filtre tıklamasında `scrollY`'nin değişmediğini teyit edin.

```bash
git add -A
git commit -m "style: rework camps listing and detail page"
```

---

## Task 8: Hoca, mekan ve kalan içerik sayfaları

**Files:**
- Modify: `src/components/teachers/{teacher-card,teacher-bio,discipline-chips}.tsx`
- Modify: `src/components/venue/{venue-gallery,venue-highlights,venue-location}.tsx`
- Modify: `src/components/{contact-form}.tsx`, `src/components/inquiry/{field,consent-checkbox,inquiry-form}.tsx`
- Modify: `src/app/[locale]/(public)/{hocalar,hocalar/[slug],mekan,deneyim,hakkimizda,sss,iletisim,blog,blog/[slug],kvkk,gizlilik,basvuru,basvuru-alindi,not-found}` sayfaları

- [ ] **Step 1: Hoca sayfaları**

Liste dergi düzeninde, asimetrik. Profil: büyük portre + isim + uzmanlık + biyografi + sertifikalar (ince çizgili liste) + katıldığı kamplar. Instagram alanı opsiyonel kalır.

- [ ] **Step 2: Mekan sayfası**

`VenueGallery` editorial mozaik olur ve `venue-lightbox`'a bağlanır. `VenueLocation`: harita `iframe` keskin çerçeve içinde, `title` ve `loading="lazy"` **korunur**. **Oda tipi, oda fiyatı, müsaitlik geçmez** — yalnızca `accommodationNote` ile otelin sitesine yönlendirme. `PageHero` ile `VenueGallery`'nin aynı görseli iki kez göstermemesi korunur (galeri bir kaydırılmış).

- [ ] **Step 3: Formlar**

`Field`, `ConsentCheckbox`, `inquiry-form`, `contact-form`, `newsletter-cta` görünümü: ince alt çizgili input (`border-b border-text/25`, odakta `border-olive`), keskin köşe, Manrope. **Koru:** `aria-describedby`/`aria-invalid`/`role="alert"` bağlantıları, hata anahtarı çevirisi ve `generic` geri düşüşü, alan değerlerinin hata sonrası korunması, çift-gönderim koruması (`submitting` başarıda sıfırlanmaz), WhatsApp geri düşüşü. Hata metni rengi Task 1'in kararına uyar (kırmızı token yok).

- [ ] **Step 4: Kalan sayfalar**

`deneyim`, `hakkimizda`, `sss`, `iletisim`, `blog`, `blog/[slug]`, `kvkk`, `gizlilik`, `basvuru`, `basvuru-alindi`, `not-found`. Hepsi `PageHero` + `Section` + editorial düzen. **Yasal sayfaların yer tutucu uyarısı aynen korunur.** `sss` akordeonu JS'siz çalışmaya devam eder.

- [ ] **Step 5: Doğrula ve commit**

Dört komut temiz. **On dört sayfanın tamamını iki dilde açın** (28 yükleme) ve her birini rapora tek tek yazın — bu projede bir görsel kusur, doğrulama listesinin sayfaları örneklemesi yüzünden gözden kaçtı. Örnekleme yapmayın.

```bash
git add -A
git commit -m "style: rework teacher, venue, form and remaining content pages"
```

---

## Task 9: Erişilebilirlik, performans ve dokümantasyon kapanışı

**Files:**
- Modify: `src/app/globals.css` (gerekirse kontrast düzeltmeleri)
- Modify: `README.md`
- Modify: `docs/briefs/2026-08-04-editorial-redesign-brief.md` (kabul kriterlerini işaretle)

- [ ] **Step 1: Kontrast denetimi**

Gerçek Lighthouse ile **her sayfa × her dil** için Accessibility skorunu ölçün. Hedef 100. Bir düşüş varsa kaynağını bulun ve düzeltin.

Ayrıca elle kontrol edin: `bg-surface` üzerindeki her metin (`--muted` orada 4.93:1 — dar marj), koyu bölümlerdeki her metin, dolgu üzerine metinler, `::selection`.

- [ ] **Step 2: Klavye ve hareket denetimi**

Her sayfada: tek `h1`, başlık seviyesi atlaması yok, Tab sırası mantıklı, skip link çalışıyor, odak halkası her yerde görünür. Mobil menü ve lightbox odak tuzakları. `prefers-reduced-motion` açıkken hiçbir bölüm gizli kalmıyor ve lenis kurulmuyor.

- [ ] **Step 3: Performans**

`npm run build` rota tablosunu Task 1 öncesiyle karşılaştırın — statik sayfa sayısı düşmemeli. Hero görselinin `priority` olduğunu, diğerlerinin lazy olduğunu, `motion`/`lenis`'in ana sayfa bundle'ını aşırı büyütmediğini kontrol edin. Rakamları rapora yazın.

- [ ] **Step 4: README'yi güncelle**

Yeni palet ve kontrast kuralları, yeni fontlar ve Instrument Serif'in 400-ağırlık kısıtı, hareket katmanı ve `prefers-reduced-motion` davranışı, `heroVideo` yapılandırması ve şu an fallback fotoğraf kullanıldığı. **Korunan operasyonel notlar:** hız sınırının güvenilir vekil gerektirmesi, `FROM` adresinin türetilmesi, e-postanın tek dönüşüm yolu olması, `engines: node >= 22`. Yayın öncesi kontrol listesine **mekan fotoğraflarının yeniden çekilmesi/düzenlenmesi** maddesini ekleyin (brief §6 kararı).

- [ ] **Step 5: Tam doğrulama**

```bash
npm test
CHECK_LAUNCH_READY=1 npm test
npx tsc --noEmit
npm run lint
npm run build
```

İlki 165 (5 skipped) + Task 6'nın eklediği `FutureEvent` testleri. İkincisi **beklendiği gibi 5 hatayla** kalır (yer tutucu içerik) — bu kapı çalışıyor demektir. Diğer üçü temiz.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: accessibility pass, performance check and docs for the editorial redesign"
```

---

## Self-Review

**1. Brief kapsamı:**

| Brief | Görev |
|---|---|
| §1 sanat yönü | Task 3–8 (her bileşende) |
| §2 palet + kontrast | Task 1 (token + guard), Task 9 (denetim) |
| §3 tipografi | Task 1 |
| §4.1 hero | Task 5 |
| §4.2 kamp paneli | Task 5 |
| §4.3 günlük akış | Task 5 |
| §4.4 mekan + lightbox | Task 6 |
| §4.5 eğitmenler | Task 6 (ana sayfa), Task 8 (sayfalar) |
| §4.6 coming soon | Task 6 |
| §4.7 kapanış CTA | Task 6 |
| §4.8 footer | Task 4 |
| §5 hareket | Task 2 (temel), Task 4–8 (uygulama) |
| §6 görseller | Task 5, 6, 8; Task 9 README notu |
| §7 rezervasyon | Task 8 (yalnızca görünüm; API korunur) |
| §8 teknik | Global Constraints + Task 2, 9 |
| §9 içerik metinleri | Task 5, 6 |
| §10 kabul kriterleri | Task 9 Step 4 |

Kapsam boşluğu yok.

**2. Yer tutucu taraması:** "TBD"/"sonra bakılır" yok. `heroVideo` bilinçli olarak opsiyonel bırakıldı ve fallback açıkça belirtildi. `future-events.ts` görsellerinin var olan dosyalara işaret etmesi şartı yazıldı.

**3. Tip/isim tutarlılığı:**
- `Section` prop değerleri `'background'|'surface'|'dark'` — Task 3'te tanımlandı, Task 4–8'de aynı adlarla kullanıldı; eski `cream`/`ink` adlarının süpürülmesi Task 3 Step 2'de zorunlu kılındı.
- Hareket bileşenleri (`Reveal`, `RevealGroup`, `MaskedLines`, `Marquee`, `Parallax`) Task 2'de tanımlandı, sonraki görevlerde aynı adlarla çağrıldı.
- `FutureEvent`, `getFutureEvents()` Task 6'da tanımlandı ve yalnızca orada kullanıldı.
- `useReducedMotion()` Task 2'de tanımlandı; Task 2'nin tüm hareket bileşenleri ve Task 4'ün `BackToTop` davranışı buna dayanıyor.
- `--muted-soft` kullanımı `contrast-guard-allow` yorumu gerektiriyor; Task 6 Step 2 bunu açıkça söylüyor.
