# Serenity Retreats Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Yoga/pilates kampı organizasyonu Serenity Retreats için, kamp dönemlerini tanıtan ve talep toplayan iki dilli (TR/EN) bir tanıtım sitesi kurmak.

**Architecture:** Next.js 16 App Router uygulaması. İçerik veritabanı yerine `src/content/` altında tipli TypeScript modüllerinde tutulur ve yalnızca `src/content/index.ts` seçicileri üzerinden okunur. Sayfalar varsayılan olarak sunucu bileşenidir; etkileşim gerektiren beş bileşen istemci tarafındadır. Talep toplama tek bir `/api/inquiry` ucunda, zod ayrık birleşimiyle üç form türüne hizmet eder; kalıcı depolama yok, sonuç e-posta olarak gönderilir.

**Tech Stack:** Next.js 16.2.3 · React 19.2.4 · TypeScript 5 · Tailwind CSS v4 (`@tailwindcss/postcss`) · next-intl 4 · zod 4 · lucide-react · Resend · Vitest

**Spec:** [docs/superpowers/specs/2026-07-31-serenity-retreats-design.md](../specs/2026-07-31-serenity-retreats-design.md)

## Global Constraints

Bu bölümün tamamı her görevin gereksinimlerine dahildir.

- **Next.js 16 eğitim verinizden farklıdır.** Kod yazmadan önce ilgili kılavuzu `node_modules/next/dist/docs/` altından okuyun. Kullanımdan kaldırma (deprecation) uyarılarını dikkate alın.
- Bağımlılık sürüm tabanları: `next@16.2.3`, `react@19.2.4`, `react-dom@19.2.4`, `next-intl@^4.13.1`, `zod@^4.3.6`, `lucide-react@^1.8.0`, `resend@^6.10.0`, `@upstash/ratelimit@^2.0.8`, `@upstash/redis@^1.38.0`, `@marsidev/react-turnstile@^1.5.3`, `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `vitest`, `typescript@^5`.
- **`date-fns` KULLANILMAZ.** Tarih biçimleme `Intl.DateTimeFormat` ile yapılır.
- **Testler DOM gerektirmez.** `jsdom` ve `@testing-library/*` kurulmaz. Tüm testler saf fonksiyonlar veya kaynak dosya taramaları üzerinedir.
- Varsayılan dil `tr`. Dil öneki **her zaman görünür** (`/tr/...`, `/en/...`) — next-intl `localePrefix: 'always'`.
- Tek segment seti (Türkçe). next-intl `pathnames` çeviri katmanı **eklenmez**.
- Renk token'ları bu değerlerin dışına çıkmaz: `--color-cream: #faf6f2`, `--color-cream-2: #f0ece9`, `--color-cream-3: #ebe7e4`, `--color-ink: #221c25`, `--color-ink-2: #1a151c`, `--color-ink-3: #423c45`, `--color-body: #6f6f6f`, `--color-body-muted: #7a7a7a`, `--color-body-light: #a4a4a4`, `--color-border: #e5e5e5`, `--color-accent: #3cc4b2`, `--color-accent-hover: #2fa697`, `--color-accent-deep: #1d6b61`, `--color-coral: #f56c6d`, `--color-olive: #5e844b`, `--color-amber: #e9aa35`.
- **`--color-accent` asla metin rengi değildir.** Tailwind'in `text-accent` yardımcı sınıfı hiçbir dosyada kullanılmaz. Turkuaz metin gerektiğinde `text-accent-deep`; turkuaz zemin üzerindeki metin `text-ink`.
- **Gövde metni `--color-body` (#6f6f6f).** `--color-body-muted` yalnızca ≥24px veya ≥18.66px bold metinde kullanılabilir.
- Fontlar: başlık **PT Serif**, gövde **Mulish**; `next/font/google`, `display: 'swap'`, alt kümeler `['latin', 'latin-ext']` (Türkçe karakterler için `latin-ext` zorunlu).
- Arayüz metinleri `messages/tr.json` · `messages/en.json`'da. İçerik metinleri `src/content/` içinde `{ tr, en }` alanlarında. **İki yerde birden tutulmaz.**
- `program`, `level`, `status` değerleri yalnızca anahtardır; kullanıcıya görünen etiketler `messages/*.json`'da. İçerik dosyaları insan okunabilir etiket taşımaz.
- **Basın logosu (Vogue, Condé Nast, The Times vb.) eklenmez.** Sahip olunmayan basın referansı yanıltıcıdır.
- Örnek katılımcı yorumları `isPlaceholder: true` taşır ve `testimonials.ts` başında büyük harfli uyarı yorumu bulunur.
- Mekan sayfasında **oda tipi, oda fiyatı veya müsaitlik geçmez.**
- İçerik seçicileri içinde `Date.now()` veya argümansız `new Date()` **çağrılmaz**; "bugün" değeri parametre olarak geçirilir.
- Sunucu bileşeni varsayılandır. `'use client'` yalnızca şu bileşenlerde: `camp-filters`, `inquiry-form`, `language-switcher`, `navbar`, `testimonials`, `back-to-top`.
- **Opsiyonel env değişkeni eksikse ilgili özellik zarifçe devre dışı kalır**, build veya çalışma zamanı çökmez. Opsiyonel olanlar: `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
- Her görev kendi testleriyle biter ve commit atılır. Commit mesajları Türkçe olmayan konvansiyonel önekler kullanır: `feat:`, `test:`, `chore:`, `fix:`, `style:`.

---

## Dosya Yapısı

Görevlere geçmeden önce hangi dosyanın neden sorumlu olduğu:

| Dosya | Sorumluluk |
|---|---|
| `src/app/globals.css` | Tasarım token'ları, temel stiller, tipografi ölçeği, yardımcı sınıflar |
| `src/app/layout.tsx` | Kök layout; font değişkenlerini `<html>`'e bağlar |
| `src/lib/fonts.ts` | PT Serif + Mulish yüklemesi, CSS değişken adları |
| `src/i18n/routing.ts` | Dil listesi, varsayılan dil, önek politikası |
| `src/i18n/request.ts` | İstek başına mesaj yükleme |
| `src/i18n/navigation.ts` | Dil farkında `Link`, `redirect`, `usePathname` |
| `src/middleware.ts` | Dil yönlendirmesi |
| `src/content/types.ts` | Tüm içerik tipleri — başka hiçbir dosya tip tanımlamaz |
| `src/content/camps.ts` | Kamp dönemi verisi (veri, mantık yok) |
| `src/content/teachers.ts` | Hoca verisi |
| `src/content/venues.ts` | Mekan verisi |
| `src/content/faq.ts` | SSS verisi |
| `src/content/testimonials.ts` | Yorum verisi (örnek, işaretli) |
| `src/content/posts.ts` | Blog yazısı verisi (v1'de boş) |
| `src/content/index.ts` | **Tek okuma arayüzü** — tüm seçiciler burada |
| `src/lib/utils/dates.ts` | Tarih aralığı biçimleme |
| `src/lib/utils/camp-status.ts` | Kamp rozeti türetme, filtreleme |
| `src/lib/utils/validation.ts` | zod şemaları |
| `src/lib/utils/ids.ts` | `referenceId` üretimi |
| `src/lib/config/site.ts` | Marka adı, iletişim, sosyal medya, domain |
| `src/lib/config/whatsapp.ts` | WhatsApp bağlantı kurucu |
| `src/lib/security/rate-limit.ts` | Hız sınırı (Upstash veya in-memory) |
| `src/lib/security/turnstile.ts` | Turnstile doğrulaması (opsiyonel) |
| `src/lib/mail/` | Resend istemcisi + e-posta şablonları |
| `src/lib/seo/jsonld.ts` | JSON-LD kurucuları |
| `src/components/ui/` | Marka bilmeyen temel yapı taşları |
| `src/components/layout/` | Navbar, footer, dil değiştirici, FAB |
| `src/components/home/` | Ana sayfa bölümleri |
| `src/components/camps/` | Kamp kartı, filtreler, detay bölümleri |
| `src/components/teachers/` `venue/` `inquiry/` | Alan bileşenleri |
| `src/app/api/inquiry/route.ts` | Talep formu ucu |

---

## Task 1: Proje iskeleti, tasarım token'ları ve i18n

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `eslint.config.mjs`, `.gitignore`, `.env.example`
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/lib/fonts.ts`
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/middleware.ts`
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/(public)/layout.tsx`, `src/app/[locale]/(public)/page.tsx`
- Create: `messages/tr.json`, `messages/en.json`
- Test: `src/i18n/messages.test.ts`

**Interfaces:**
- Consumes: hiçbir şey (ilk görev)
- Produces:
  - `src/lib/fonts.ts` → `export const ptSerif` (CSS değişkeni `--font-pt-serif`), `export const mulish` (CSS değişkeni `--font-mulish`)
  - `src/i18n/routing.ts` → `export const routing` (`locales: ['tr','en']`, `defaultLocale: 'tr'`, `localePrefix: 'always'`), `export type AppLocale = 'tr' | 'en'`
  - `src/i18n/navigation.ts` → `export const { Link, redirect, usePathname, useRouter, getPathname }`
  - `globals.css` token'ları Tailwind yardımcı sınıfları olarak: `bg-cream`, `text-ink`, `text-body`, `text-accent-deep`, `bg-accent`, `border-border` vb.

- [ ] **Step 1: Projeyi kur ve Next.js 16 kılavuzunu oku**

```bash
npm init -y
npm install next@16.2.3 react@19.2.4 react-dom@19.2.4 next-intl@^4.13.1 zod@^4.3.6 lucide-react@^1.8.0
npm install -D typescript@^5 @types/node@^20 @types/react@^19 @types/react-dom@^19 \
  tailwindcss@^4 @tailwindcss/postcss@^4 vitest eslint@^9 eslint-config-next@16.2.3
ls node_modules/next/dist/docs/
```

`node_modules/next/dist/docs/` altındaki App Router, `layout`, `middleware` ve `metadata` kılavuzlarını okuyun. Bu sürümün API'si eğitim verinizden farklı olabilir.

- [ ] **Step 2: Yapılandırma dosyalarını yaz**

`package.json` içindeki `scripts`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

`next.config.ts`:

```ts
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
}

export default withNextIntl(nextConfig)
```

`postcss.config.mjs`:

```js
export default { plugins: { '@tailwindcss/postcss': {} } }
```

`vitest.config.ts` — DOM ortamı yok, kasıtlı:

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})
```

`tsconfig.json` — `"paths": { "@/*": ["./src/*"] }`, `"strict": true`, `"jsx": "preserve"`, `"moduleResolution": "bundler"`, `"plugins": [{ "name": "next" }]`.

`.env.example`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=
INQUIRY_TO_EMAIL=
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

- [ ] **Step 3: Tasarım token'larını yaz**

`src/app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  /* Zeminler — sıcak krem ailesi */
  --color-cream:        #faf6f2;
  --color-cream-2:      #f0ece9;
  --color-cream-3:      #ebe7e4;

  /* Metin ve koyu yüzeyler — derin erik-siyah */
  --color-ink:          #221c25;
  --color-ink-2:        #1a151c;
  --color-ink-3:        #423c45;

  /* Gövde metni. --color-body-muted YALNIZCA büyük metinde (≥24px). */
  --color-body:         #6f6f6f;
  --color-body-muted:   #7a7a7a;
  --color-body-light:   #a4a4a4;
  --color-border:       #e5e5e5;

  /* Vurgu. --color-accent ASLA metin rengi değildir; metin için -deep. */
  --color-accent:       #3cc4b2;
  --color-accent-hover: #2fa697;
  --color-accent-deep:  #1d6b61;

  --color-coral:        #f56c6d;
  --color-olive:        #5e844b;
  --color-amber:        #e9aa35;

  --font-heading: var(--font-pt-serif), Georgia, serif;
  --font-body:    var(--font-mulish), system-ui, sans-serif;
}

:root {
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 999px;
  --shadow-soft: 0 1px 2px rgba(34,28,37,.05), 0 8px 28px rgba(34,28,37,.07);
  --shadow-lift: 0 2px 6px rgba(34,28,37,.06), 0 16px 48px rgba(34,28,37,.12);
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  color: var(--color-body);
  background: var(--color-cream);
  line-height: 1.7;
  overflow-x: hidden;
  font-feature-settings: "kern" 1, "liga" 1;
}

/* @layer base içinde: Tailwind text-* yardımcıları başlık rengini ezebilsin */
@layer base {
  h1, h2, h3, h4, h5 {
    font-family: var(--font-heading);
    color: var(--color-ink);
    line-height: 1.25;
  }
}

:focus-visible {
  outline: 2px solid var(--color-accent-deep);
  outline-offset: 2px;
}

/* ===== TİPOGRAFİ ÖLÇEĞİ ===== */
.type-display {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  font-weight: 400;
}
.type-section-title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3.2vw, 2.65rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
}
.type-lede {
  font-size: clamp(1rem, 1.35vw, 1.125rem);
  line-height: 1.75;
  color: var(--color-body);
}
.eyebrow {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--color-accent-deep);
  margin-bottom: 12px;
}

/* ===== RİTİM ===== */
.section-py { padding: clamp(72px, 12vw, 112px) 0; }
.section-sm { padding: clamp(48px, 8vw, 80px) 0; }
.container-page { width: 100%; max-width: 1240px; margin-inline: auto; padding-inline: clamp(20px, 5vw, 48px); }

/* ===== HAREKET TERCİHİ ===== */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Fontları ve kök layout'u yaz**

`src/lib/fonts.ts`:

```ts
import { PT_Serif, Mulish } from 'next/font/google'

export const ptSerif = PT_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-pt-serif',
})

export const mulish = Mulish({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-mulish',
})
```

`src/app/layout.tsx` — kök layout yalnızca `<html>`/`<body>` ve font değişkenlerini kurar; dil `[locale]/layout.tsx`'te belirlenir:

```tsx
import type { ReactNode } from 'react'
import { mulish, ptSerif } from '@/lib/fonts'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${ptSerif.variable} ${mulish.variable}`}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: i18n yapılandırmasını yaz**

`src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  localePrefix: 'always',
})

export type AppLocale = (typeof routing.locales)[number]
```

`src/i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default }
})
```

`src/i18n/navigation.ts`:

```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
```

`src/middleware.ts`:

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
```

- [ ] **Step 6: Dil layout'unu ve geçici ana sayfayı yaz**

`src/app/[locale]/layout.tsx`:

```tsx
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>
}
```

`src/app/[locale]/(public)/layout.tsx` — Task 5'te navbar/footer eklenecek, şimdilik geçiş:

```tsx
import type { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>
}
```

`src/app/[locale]/(public)/page.tsx` — token doğrulaması için geçici:

```tsx
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')
  return (
    <section className="section-py container-page">
      <span className="eyebrow">{t('eyebrow')}</span>
      <h1 className="type-display">{t('heroTitle')}</h1>
      <p className="type-lede mt-6 max-w-2xl">{t('heroLede')}</p>
    </section>
  )
}
```

- [ ] **Step 7: Mesaj dosyalarını yaz**

`messages/tr.json`:

```json
{
  "home": {
    "eyebrow": "ASSOS · ÇANAKKALE",
    "heroTitle": "Bedenini eğit, ruhunu keşfet",
    "heroLede": "Assos'un taş mimarisinde, küçük gruplar halinde yoga ve pilates kampları."
  }
}
```

`messages/en.json`:

```json
{
  "home": {
    "eyebrow": "ASSOS · ÇANAKKALE",
    "heroTitle": "Train your body, explore your soul",
    "heroLede": "Yoga and pilates retreats in small groups, set in the stone architecture of Assos."
  }
}
```

- [ ] **Step 8: Mesaj anahtarı eşitlik testini yaz (başarısız olacak)**

Bu test iki dil dosyasının anahtar kümelerinin ayrışmasını yakalar — iki dilli sitede en sık yapılan hata.

`src/i18n/messages.test.ts`:

```ts
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
```

`tsconfig.json`'a `"resolveJsonModule": true` eklenmesi gerekir.

- [ ] **Step 9: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test`
Expected: `resolveJsonModule` eksikse derleme hatası; eklendikten sonra testler geçer. Testin *gerçekten* çalıştığını doğrulamak için `messages/en.json`'dan `heroLede` anahtarını geçici olarak silin.

Expected: FAIL — `expected [ 'home.eyebrow', 'home.heroTitle' ] to deeply equal [ 'home.eyebrow', 'home.heroLede', 'home.heroTitle' ]`

Anahtarı geri ekleyin.

- [ ] **Step 10: Testleri çalıştır ve geçtiğini gör**

Run: `npm test`
Expected: PASS — 2 test

- [ ] **Step 11: Geliştirme sunucusunu görsel olarak doğrula**

Run: `npm run dev`

`http://localhost:3000/` → `/tr` adresine yönlenmeli. `/tr` ve `/en` açılmalı. Doğrulanacaklar:
- Zemin krem (`#faf6f2`), başlık serif (PT Serif), gövde sans (Mulish)
- Türkçe karakterler (`ş`, `ğ`, `İ`, `ç`) doğru görünüyor — `latin-ext` alt kümesi çalışıyor
- Tab tuşuna basıldığında odak halkası koyu turkuaz

- [ ] **Step 12: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js app with design tokens and i18n"
```

---

## Task 2: İçerik katmanı — tipler, veri ve seçiciler

**Files:**
- Create: `src/content/types.ts`, `src/content/camps.ts`, `src/content/teachers.ts`, `src/content/venues.ts`, `src/content/faq.ts`, `src/content/testimonials.ts`, `src/content/posts.ts`, `src/content/index.ts`
- Test: `src/content/content.test.ts`

**Interfaces:**
- Consumes: Task 1 → `AppLocale`
- Produces: `src/content/index.ts` şu imzaları dışa açar:
  ```ts
  getAllCamps(): CampSession[]                          // startDate artan
  getUpcomingCamps(today: string, limit?: number): CampSession[]  // endDate >= today, artan
  getPastCamps(today: string): CampSession[]            // endDate < today, azalan
  getCampBySlug(slug: string): CampSession | undefined
  getFeaturedCamps(): CampSession[]
  getAllTeachers(): Teacher[]
  getTeacherBySlug(slug: string): Teacher | undefined
  getTeachersForCamp(camp: CampSession): Teacher[]
  getCampsForTeacher(teacherSlug: string): CampSession[]
  getAllVenues(): Venue[]
  getVenueBySlug(slug: string): Venue | undefined
  getVenueForCamp(camp: CampSession): Venue            // bulunamazsa throw
  getFaq(): FaqItem[]
  getTestimonials(): Testimonial[]
  getAllPosts(): BlogPost[]
  getPostBySlug(slug: string): BlogPost | undefined
  ```
  Ayrıca `src/content/types.ts` tüm tipleri dışa açar: `Locale`, `Localized`, `LocalizedList`, `Program`, `Level`, `CampStatus`, `CampSession`, `Teacher`, `Venue`, `FaqItem`, `Testimonial`, `BlogPost`.

- [ ] **Step 1: Tipleri yaz**

`src/content/types.ts`:

```ts
export type Locale = 'tr' | 'en'
export type Localized = Record<Locale, string>
export type LocalizedList = Record<Locale, string[]>

/** Anahtar değerlerdir; kullanıcıya görünen etiketler messages/*.json'da. */
export type Program = 'yoga' | 'pilates' | 'yoga-pilates'
export type Level = 'baslangic' | 'tum-seviyeler' | 'ileri'
export type CampStatus = 'open' | 'waitlist' | 'closed'

export type DailyFlowItem = {
  time: string // 'HH:MM'
  title: Localized
  desc: Localized
}

export type CampSession = {
  slug: string
  program: Program
  title: Localized
  summary: Localized
  startDate: string // 'YYYY-MM-DD'
  endDate: string // 'YYYY-MM-DD'
  nights: number
  venueSlug: string
  teacherSlugs: string[]
  capacity: number
  spotsLeft: number
  priceFrom: number // kişi başı, paylaşımlı oda
  currency: 'TRY'
  level: Level
  status: CampStatus
  heroImage: string
  gallery: string[]
  includes: LocalizedList
  excludes: LocalizedList
  dailyFlow: DailyFlowItem[]
  featured: boolean
}

export type Teacher = {
  slug: string
  name: string
  title: Localized
  disciplines: Program[]
  bio: Localized
  certifications: LocalizedList
  photo: string
  instagram?: string
}

export type Venue = {
  slug: string
  name: string
  shortDescription: Localized
  location: Localized
  highlights: LocalizedList
  gallery: string[]
  mapEmbedUrl: string
  websiteUrl: string
  coordinates: { lat: number; lng: number }
}

export type FaqItem = {
  id: string
  question: Localized
  answer: Localized
}

export type Testimonial = {
  id: string
  author: string
  campSlug?: string
  quote: Localized
  /** ÖRNEK veri mi? true ise yayına almadan önce değiştirilmeli. */
  isPlaceholder: boolean
}

export type BlogPost = {
  slug: string
  title: Localized
  excerpt: Localized
  body: Localized // Markdown
  publishedAt: string // 'YYYY-MM-DD'
  coverImage: string
  tags: string[]
}
```

- [ ] **Step 2: Mekan ve hoca verisini yaz**

`src/content/venues.ts` — görseller otel repo'sundaki `img/` klasöründen alınır ve `public/img/venue/` altına kopyalanır:

```ts
import type { Venue } from './types'

export const venues: Venue[] = [
  {
    slug: 'karadut-tas-otel',
    name: 'Assos Karadut Taş Otel',
    shortDescription: {
      tr: 'Büyükhusun köyünde, yerel taştan örülmüş butik bir otel. Assos\'un sakinliği, zeytinlikler ve Ege ışığı.',
      en: 'A boutique hotel built from local stone in Büyükhusun village. The calm of Assos, olive groves and Aegean light.',
    },
    location: { tr: 'Büyükhusun, Ayvacık / Çanakkale', en: 'Büyükhusun, Ayvacık / Çanakkale' },
    highlights: {
      tr: ['Assos antik kentine 7 dakika', 'Kadırga Koyu\'na 5 km', 'Yerel taş mimari', 'Havuz ve bahçe', 'Otel restoranı'],
      en: ['7 minutes to ancient Assos', '5 km to Kadırga Bay', 'Local stone architecture', 'Pool and garden', 'On-site restaurant'],
    },
    gallery: [
      '/img/venue/hero.jpg',
      '/img/venue/dis-cephe.jpg',
      '/img/venue/havuz.webp',
      '/img/venue/bahce.webp',
      '/img/venue/balkon.jpg',
      '/img/venue/kusbakisi.jpg',
    ],
    mapEmbedUrl: 'https://www.google.com/maps?q=39.4869,26.3389&output=embed',
    websiteUrl: 'https://www.karaduttasotel.com/',
    coordinates: { lat: 39.4869, lng: 26.3389 },
  },
]
```

`src/content/teachers.ts` — üç yer tutucu hoca. Dosya başına uyarı:

```ts
import type { Teacher } from './types'

/**
 * YER TUTUCU VERİ — yayına almadan önce gerçek hoca bilgileriyle değiştirin.
 * Fotoğraflar public/img/teachers/ altına konur.
 */
export const teachers: Teacher[] = [
  {
    slug: 'elif-demir',
    name: 'Elif Demir',
    title: { tr: 'Yoga ve Nefes Eğitmeni', en: 'Yoga & Breathwork Teacher' },
    disciplines: ['yoga'],
    bio: {
      tr: 'On yılı aşkın süredir vinyasa ve hatha yoga çalışıyor. Derslerinde nefesi hareketin merkezine alır; her seviyeye açık, yarışmasız bir pratik kurar.',
      en: 'She has practised vinyasa and hatha yoga for over a decade. Her classes place breath at the centre of movement, building a non-competitive practice open to every level.',
    },
    certifications: {
      tr: ['Yoga Alliance RYT-500', 'Nefes Terapisi Sertifikası'],
      en: ['Yoga Alliance RYT-500', 'Breathwork Therapy Certificate'],
    },
    photo: '/img/teachers/elif-demir.jpg',
    instagram: 'https://instagram.com/',
  },
  {
    slug: 'can-yilmaz',
    name: 'Can Yılmaz',
    title: { tr: 'Pilates ve Mobilite Eğitmeni', en: 'Pilates & Mobility Coach' },
    disciplines: ['pilates'],
    bio: {
      tr: 'Mat pilates ve fonksiyonel mobilite üzerine çalışıyor. Masa başı çalışanların sırt ve kalça kısıtlarını çözmeye odaklanan bir yaklaşımı var.',
      en: 'He works on mat pilates and functional mobility, with an approach focused on releasing the back and hip restrictions of desk-bound bodies.',
    },
    certifications: {
      tr: ['BASI Pilates Mat Sertifikası', 'FRC Mobility Specialist'],
      en: ['BASI Pilates Mat Certificate', 'FRC Mobility Specialist'],
    },
    photo: '/img/teachers/can-yilmaz.jpg',
  },
  {
    slug: 'zeynep-arslan',
    name: 'Zeynep Arslan',
    title: { tr: 'Yin Yoga ve Meditasyon Rehberi', en: 'Yin Yoga & Meditation Guide' },
    disciplines: ['yoga', 'yoga-pilates'],
    bio: {
      tr: 'Yin yoga ve farkındalık meditasyonu çalışıyor. Akşam seanslarında uzun tutuşlar ve sessizlik üzerine kurulu bir dinlenme pratiği yönetiyor.',
      en: 'She practises yin yoga and mindfulness meditation, leading evening sessions built on long holds and stillness.',
    },
    certifications: {
      tr: ['Yin Yoga 300 Saat', 'MBSR Uygulayıcı Eğitimi'],
      en: ['Yin Yoga 300 Hours', 'MBSR Practitioner Training'],
    },
    photo: '/img/teachers/zeynep-arslan.jpg',
  },
]
```

- [ ] **Step 3: Kamp, SSS, yorum ve blog verisini yaz**

`src/content/camps.ts` — üç dönem; biri `waitlist`, biri geçmiş tarihli (geçmiş kamplar bölümü doğrulanabilsin). Her kampın `dailyFlow` dizisi en az 6 kayıt taşır.

```ts
import type { CampSession } from './types'

/** YER TUTUCU VERİ — gerçek tarih, fiyat ve kontenjanla değiştirin. */
export const camps: CampSession[] = [
  {
    slug: 'yoga-nefes-ekim-2026',
    program: 'yoga',
    title: { tr: '5 Günlük Yoga ve Nefes Kampı', en: '5-Day Yoga & Breathwork Retreat' },
    summary: {
      tr: 'Sabah vinyasa, akşam yin. Beş gün boyunca telefonlardan uzakta, zeytinliklerin arasında nefesine dönüyorsun.',
      en: 'Vinyasa in the morning, yin in the evening. Five days away from screens, returning to your breath among olive groves.',
    },
    startDate: '2026-10-12',
    endDate: '2026-10-16',
    nights: 4,
    venueSlug: 'karadut-tas-otel',
    teacherSlugs: ['elif-demir', 'zeynep-arslan'],
    capacity: 16,
    spotsLeft: 9,
    priceFrom: 24500,
    currency: 'TRY',
    level: 'tum-seviyeler',
    status: 'open',
    heroImage: '/img/camps/yoga-ekim-hero.jpg',
    gallery: ['/img/camps/yoga-ekim-1.jpg', '/img/camps/yoga-ekim-2.jpg', '/img/camps/yoga-ekim-3.jpg'],
    includes: {
      tr: ['4 gece konaklama (paylaşımlı oda)', 'Günde iki yoga seansı', 'Üç öğün vejetaryen beslenme', 'Nefes ve meditasyon atölyeleri', 'Kadırga Koyu yürüyüşü', 'Yoga matı ve ekipman'],
      en: ['4 nights accommodation (shared room)', 'Two yoga sessions daily', 'Three vegetarian meals a day', 'Breathwork and meditation workshops', 'Walk to Kadırga Bay', 'Mat and props provided'],
    },
    excludes: {
      tr: ['Ulaşım', 'Alkollü içecekler', 'Kişisel masaj ve terapiler', 'Seyahat sigortası'],
      en: ['Transport', 'Alcoholic drinks', 'Personal massage and therapies', 'Travel insurance'],
    },
    dailyFlow: [
      { time: '07:00', title: { tr: 'Sessiz uyanış', en: 'Silent wake-up' }, desc: { tr: 'Bahçede bitki çayı, konuşmasız yirmi dakika.', en: 'Herbal tea in the garden, twenty wordless minutes.' } },
      { time: '07:30', title: { tr: 'Sabah vinyasa', en: 'Morning vinyasa' }, desc: { tr: 'Doksan dakikalık akış pratiği, nefes odaklı.', en: 'A ninety-minute breath-led flow practice.' } },
      { time: '09:30', title: { tr: 'Kahvaltı', en: 'Breakfast' }, desc: { tr: 'Köy kahvaltısı; yerel zeytinyağı, ev peyniri, mevsim meyveleri.', en: 'Village breakfast: local olive oil, homemade cheese, seasonal fruit.' } },
      { time: '11:00', title: { tr: 'Atölye', en: 'Workshop' }, desc: { tr: 'Nefes teknikleri veya anatomi üzerine oturum.', en: 'A session on breath technique or anatomy.' } },
      { time: '13:00', title: { tr: 'Öğle ve serbest zaman', en: 'Lunch and free time' }, desc: { tr: 'Havuz, kitap, uyku ya da koya yürüyüş.', en: 'Pool, a book, a nap, or a walk to the bay.' } },
      { time: '17:30', title: { tr: 'Akşam yin', en: 'Evening yin' }, desc: { tr: 'Uzun tutuşlar, destekli pozlar, kapanış meditasyonu.', en: 'Long holds, supported poses, closing meditation.' } },
      { time: '19:30', title: { tr: 'Akşam yemeği', en: 'Dinner' }, desc: { tr: 'Taş terasta ortak masa.', en: 'A shared table on the stone terrace.' } },
    ],
    featured: true,
  },
  {
    slug: 'pilates-mobilite-kasim-2026',
    program: 'pilates',
    title: { tr: '4 Günlük Pilates ve Mobilite Kampı', en: '4-Day Pilates & Mobility Retreat' },
    summary: {
      tr: 'Masa başında sertleşmiş bir bedeni açmak için tasarlandı. Günde iki mat seansı, mobilite atölyeleri ve bol dinlenme.',
      en: 'Designed to open a body stiffened by desk work. Two mat sessions a day, mobility workshops and plenty of rest.',
    },
    startDate: '2026-11-05',
    endDate: '2026-11-08',
    nights: 3,
    venueSlug: 'karadut-tas-otel',
    teacherSlugs: ['can-yilmaz'],
    capacity: 12,
    spotsLeft: 3,
    priceFrom: 19800,
    currency: 'TRY',
    level: 'baslangic',
    status: 'open',
    heroImage: '/img/camps/pilates-kasim-hero.jpg',
    gallery: ['/img/camps/pilates-kasim-1.jpg', '/img/camps/pilates-kasim-2.jpg'],
    includes: {
      tr: ['3 gece konaklama (paylaşımlı oda)', 'Günde iki mat pilates seansı', 'Üç öğün beslenme', 'Mobilite atölyesi', 'Duruş değerlendirmesi', 'Ekipman'],
      en: ['3 nights accommodation (shared room)', 'Two mat pilates sessions daily', 'Three meals a day', 'Mobility workshop', 'Posture assessment', 'Equipment provided'],
    },
    excludes: {
      tr: ['Ulaşım', 'Alkollü içecekler', 'Kişisel terapiler', 'Seyahat sigortası'],
      en: ['Transport', 'Alcoholic drinks', 'Personal therapies', 'Travel insurance'],
    },
    dailyFlow: [
      { time: '08:00', title: { tr: 'Uyanış hareketi', en: 'Wake-up movement' }, desc: { tr: 'Yirmi dakikalık eklem hazırlığı.', en: 'Twenty minutes of joint preparation.' } },
      { time: '08:30', title: { tr: 'Kahvaltı', en: 'Breakfast' }, desc: { tr: 'Protein ağırlıklı köy kahvaltısı.', en: 'A protein-forward village breakfast.' } },
      { time: '10:00', title: { tr: 'Mat pilates', en: 'Mat pilates' }, desc: { tr: 'Merkez kuvveti ve kontrol üzerine altmış dakika.', en: 'Sixty minutes on core strength and control.' } },
      { time: '12:30', title: { tr: 'Öğle', en: 'Lunch' }, desc: { tr: 'Hafif, mevsimlik menü.', en: 'A light, seasonal menu.' } },
      { time: '15:00', title: { tr: 'Mobilite atölyesi', en: 'Mobility workshop' }, desc: { tr: 'Kalça ve omuz kısıtlarına yönelik çalışma.', en: 'Work targeting hip and shoulder restrictions.' } },
      { time: '18:00', title: { tr: 'Onarıcı seans', en: 'Restorative session' }, desc: { tr: 'Yavaş tempolu kapanış, gevşeme.', en: 'A slow-paced closing and release.' } },
      { time: '19:30', title: { tr: 'Akşam yemeği', en: 'Dinner' }, desc: { tr: 'Ortak masa, sohbet.', en: 'A shared table and conversation.' } },
    ],
    featured: true,
  },
  {
    slug: 'yoga-pilates-nisan-2026',
    program: 'yoga-pilates',
    title: { tr: 'Bahar Yoga ve Pilates Kampı', en: 'Spring Yoga & Pilates Retreat' },
    summary: {
      tr: 'Sabah pilates, akşam yoga. Baharın ilk sıcak günlerinde Assos.',
      en: 'Pilates in the morning, yoga in the evening. Assos in the first warm days of spring.',
    },
    startDate: '2026-04-18',
    endDate: '2026-04-21',
    nights: 3,
    venueSlug: 'karadut-tas-otel',
    teacherSlugs: ['elif-demir', 'can-yilmaz'],
    capacity: 14,
    spotsLeft: 0,
    priceFrom: 18500,
    currency: 'TRY',
    level: 'tum-seviyeler',
    status: 'waitlist',
    heroImage: '/img/camps/bahar-hero.jpg',
    gallery: ['/img/camps/bahar-1.jpg'],
    includes: {
      tr: ['3 gece konaklama (paylaşımlı oda)', 'Sabah pilates, akşam yoga', 'Üç öğün beslenme', 'Assos antik kent gezisi', 'Ekipman'],
      en: ['3 nights accommodation (shared room)', 'Morning pilates, evening yoga', 'Three meals a day', 'Visit to ancient Assos', 'Equipment provided'],
    },
    excludes: {
      tr: ['Ulaşım', 'Alkollü içecekler', 'Müze giriş ücretleri', 'Seyahat sigortası'],
      en: ['Transport', 'Alcoholic drinks', 'Museum entrance fees', 'Travel insurance'],
    },
    dailyFlow: [
      { time: '07:30', title: { tr: 'Sabah pilates', en: 'Morning pilates' }, desc: { tr: 'Merkez ve duruş çalışması.', en: 'Core and posture work.' } },
      { time: '09:00', title: { tr: 'Kahvaltı', en: 'Breakfast' }, desc: { tr: 'Bahçede uzun kahvaltı.', en: 'A long breakfast in the garden.' } },
      { time: '11:00', title: { tr: 'Assos gezisi', en: 'Assos excursion' }, desc: { tr: 'Antik kent ve Athena Tapınağı.', en: 'The ancient city and Temple of Athena.' } },
      { time: '14:00', title: { tr: 'Öğle ve dinlenme', en: 'Lunch and rest' }, desc: { tr: 'Serbest zaman.', en: 'Free time.' } },
      { time: '17:30', title: { tr: 'Akşam yoga', en: 'Evening yoga' }, desc: { tr: 'Gün batımında hatha akışı.', en: 'A hatha flow at sunset.' } },
      { time: '19:30', title: { tr: 'Akşam yemeği', en: 'Dinner' }, desc: { tr: 'Terasta ortak masa.', en: 'A shared table on the terrace.' } },
    ],
    featured: false,
  },
]
```

`src/content/faq.ts` — sekiz kayıt: seviye gereksinimi, ne getirmeli, ulaşım, beslenme, oda paylaşımı, iptal, ödeme, tek başına katılım. Her biri `{ id, question: {tr,en}, answer: {tr,en} }` biçiminde.

`src/content/testimonials.ts`:

```ts
import type { Testimonial } from './types'

/**
 * ============================================================
 * DİKKAT: BU YORUMLAR ÖRNEKTİR. GERÇEK KİŞİLERE AİT DEĞİLDİR.
 * SİTEYİ YAYINA ALMADAN ÖNCE GERÇEK KATILIMCI YORUMLARIYLA
 * DEĞİŞTİRİLMELİ VEYA BÖLÜM TAMAMEN KALDIRILMALIDIR.
 * ============================================================
 */
export const testimonials: Testimonial[] = [
  {
    id: 'ornek-1',
    author: 'Örnek Katılımcı',
    campSlug: 'yoga-nefes-ekim-2026',
    quote: {
      tr: 'Beş günün sonunda omuzlarımın yıllardır ilk kez aşağıda olduğunu fark ettim.',
      en: 'By the end of the five days I noticed my shoulders had dropped for the first time in years.',
    },
    isPlaceholder: true,
  },
  // ... iki kayıt daha, aynı biçimde, isPlaceholder: true
]
```

`src/content/posts.ts`:

```ts
import type { BlogPost } from './types'

/** v1'de blog içeriği yok. Altyapı hazır; yazılar buraya eklenir. */
export const posts: BlogPost[] = []
```

- [ ] **Step 4: Bütünlük testlerini yaz (başarısız olacak)**

`src/content/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  getAllCamps, getAllTeachers, getAllVenues, getCampBySlug, getCampsForTeacher,
  getFeaturedCamps, getPastCamps, getTeachersForCamp, getUpcomingCamps, getVenueForCamp,
} from './index'
import type { Localized, LocalizedList } from './types'

const camps = getAllCamps()
const teachers = getAllTeachers()
const venues = getAllVenues()

function expectLocalized(value: Localized, label: string) {
  expect(value.tr?.trim(), `${label}.tr boş`).toBeTruthy()
  expect(value.en?.trim(), `${label}.en boş`).toBeTruthy()
}

function expectLocalizedList(value: LocalizedList, label: string) {
  expect(value.tr.length, `${label}.tr boş dizi`).toBeGreaterThan(0)
  expect(value.en.length, `${label}.en uzunluğu tr ile eşleşmiyor`).toBe(value.tr.length)
}

describe('içerik bütünlüğü', () => {
  it('en az bir kamp, hoca ve mekan vardır', () => {
    expect(camps.length).toBeGreaterThan(0)
    expect(teachers.length).toBeGreaterThan(0)
    expect(venues.length).toBeGreaterThan(0)
  })

  it('tüm slug değerleri tekildir', () => {
    for (const [label, items] of [['camps', camps], ['teachers', teachers], ['venues', venues]] as const) {
      const slugs = items.map((i) => i.slug)
      expect(new Set(slugs).size, `${label} içinde yinelenen slug`).toBe(slugs.length)
    }
  })

  it('slug değerleri kebab-case biçimindedir', () => {
    for (const item of [...camps, ...teachers, ...venues]) {
      expect(item.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('her kampın venueSlug değeri çözülür', () => {
    for (const camp of camps) expect(() => getVenueForCamp(camp)).not.toThrow()
  })

  it('her kampın tüm teacherSlugs değerleri çözülür', () => {
    for (const camp of camps) {
      expect(camp.teacherSlugs.length, `${camp.slug} hocasız`).toBeGreaterThan(0)
      expect(getTeachersForCamp(camp)).toHaveLength(camp.teacherSlugs.length)
    }
  })

  it('tarihler geçerli ve tutarlıdır', () => {
    for (const camp of camps) {
      expect(camp.startDate, `${camp.slug} startDate biçimi`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(camp.endDate, `${camp.slug} endDate biçimi`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(camp.endDate >= camp.startDate, `${camp.slug} endDate < startDate`).toBe(true)
      const days = Math.round(
        (Date.parse(camp.endDate) - Date.parse(camp.startDate)) / 86_400_000,
      )
      expect(camp.nights, `${camp.slug} nights tarih aralığıyla uyuşmuyor`).toBe(days)
    }
  })

  it('kontenjan ve fiyat değerleri tutarlıdır', () => {
    for (const camp of camps) {
      expect(camp.capacity).toBeGreaterThan(0)
      expect(camp.spotsLeft).toBeGreaterThanOrEqual(0)
      expect(camp.spotsLeft, `${camp.slug} spotsLeft > capacity`).toBeLessThanOrEqual(camp.capacity)
      expect(camp.priceFrom).toBeGreaterThan(0)
    }
  })

  it('waitlist durumundaki kampta boş yer yoktur', () => {
    for (const camp of camps) {
      if (camp.status === 'waitlist') expect(camp.spotsLeft, `${camp.slug}`).toBe(0)
    }
  })

  it('tüm çok dilli alanlar iki dilde doludur', () => {
    for (const camp of camps) {
      expectLocalized(camp.title, `${camp.slug}.title`)
      expectLocalized(camp.summary, `${camp.slug}.summary`)
      expectLocalizedList(camp.includes, `${camp.slug}.includes`)
      expectLocalizedList(camp.excludes, `${camp.slug}.excludes`)
      expect(camp.dailyFlow.length, `${camp.slug} dailyFlow kısa`).toBeGreaterThanOrEqual(6)
      for (const [i, item] of camp.dailyFlow.entries()) {
        expect(item.time).toMatch(/^\d{2}:\d{2}$/)
        expectLocalized(item.title, `${camp.slug}.dailyFlow[${i}].title`)
        expectLocalized(item.desc, `${camp.slug}.dailyFlow[${i}].desc`)
      }
    }
    for (const t of teachers) {
      expectLocalized(t.title, `${t.slug}.title`)
      expectLocalized(t.bio, `${t.slug}.bio`)
      expectLocalizedList(t.certifications, `${t.slug}.certifications`)
    }
    for (const v of venues) {
      expectLocalized(v.shortDescription, `${v.slug}.shortDescription`)
      expectLocalized(v.location, `${v.slug}.location`)
      expectLocalizedList(v.highlights, `${v.slug}.highlights`)
      expect(v.gallery.length, `${v.slug} galeri kısa`).toBeGreaterThanOrEqual(4)
    }
  })

  it('görsel yolları /img/ ile başlar', () => {
    const paths = [
      ...camps.flatMap((c) => [c.heroImage, ...c.gallery]),
      ...teachers.map((t) => t.photo),
      ...venues.flatMap((v) => v.gallery),
    ]
    for (const p of paths) expect(p).toMatch(/^\/img\//)
  })
})

describe('içerik seçicileri', () => {
  const TODAY = '2026-08-01'

  it('getAllCamps startDate\'e göre artan sıralar', () => {
    const dates = getAllCamps().map((c) => c.startDate)
    expect(dates).toEqual([...dates].sort())
  })

  it('getUpcomingCamps geçmiş kampları dışlar ve artan sıralar', () => {
    const upcoming = getUpcomingCamps(TODAY)
    expect(upcoming.length).toBeGreaterThan(0)
    for (const c of upcoming) expect(c.endDate >= TODAY).toBe(true)
    const dates = upcoming.map((c) => c.startDate)
    expect(dates).toEqual([...dates].sort())
  })

  it('getUpcomingCamps limit parametresine uyar', () => {
    expect(getUpcomingCamps(TODAY, 1)).toHaveLength(1)
  })

  it('getPastCamps yalnızca bitmiş kampları azalan sırada döner', () => {
    const past = getPastCamps(TODAY)
    for (const c of past) expect(c.endDate < TODAY).toBe(true)
    const dates = past.map((c) => c.startDate)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it('upcoming ve past birlikte tüm kampları kapsar, örtüşmez', () => {
    expect(getUpcomingCamps(TODAY).length + getPastCamps(TODAY).length).toBe(camps.length)
  })

  it('getCampBySlug bilinmeyen slug için undefined döner', () => {
    expect(getCampBySlug('yok-boyle-bir-kamp')).toBeUndefined()
    expect(getCampBySlug(camps[0].slug)?.slug).toBe(camps[0].slug)
  })

  it('getFeaturedCamps yalnızca featured kampları döner', () => {
    const featured = getFeaturedCamps()
    expect(featured.length).toBeGreaterThan(0)
    for (const c of featured) expect(c.featured).toBe(true)
  })

  it('getCampsForTeacher ters ilişkiyi doğru kurar', () => {
    for (const t of teachers) {
      const found = getCampsForTeacher(t.slug)
      for (const c of found) expect(c.teacherSlugs).toContain(t.slug)
      const expected = camps.filter((c) => c.teacherSlugs.includes(t.slug)).length
      expect(found).toHaveLength(expected)
    }
    expect(getCampsForTeacher('olmayan-hoca')).toEqual([])
  })

  it('getVenueForCamp bilinmeyen mekan için açıklayıcı hata verir', () => {
    const broken = { ...camps[0], venueSlug: 'olmayan-mekan' }
    expect(() => getVenueForCamp(broken)).toThrow(/olmayan-mekan/)
  })
})
```

- [ ] **Step 5: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/content/content.test.ts`
Expected: FAIL — `Failed to resolve import "./index"`

- [ ] **Step 6: Seçicileri yaz**

`src/content/index.ts` — bileşenler ham dizilere erişmez, yalnızca bu fonksiyonlara:

```ts
import { camps } from './camps'
import { faq } from './faq'
import { posts } from './posts'
import { teachers } from './teachers'
import { testimonials } from './testimonials'
import { venues } from './venues'
import type { BlogPost, CampSession, FaqItem, Teacher, Testimonial, Venue } from './types'

export * from './types'

const byStartDateAsc = (a: CampSession, b: CampSession) => a.startDate.localeCompare(b.startDate)

export function getAllCamps(): CampSession[] {
  return [...camps].sort(byStartDateAsc)
}

/** `today` çağıran tarafından verilir — seçiciler saat okumaz, test edilebilir kalır. */
export function getUpcomingCamps(today: string, limit?: number): CampSession[] {
  const upcoming = getAllCamps().filter((c) => c.endDate >= today)
  return limit === undefined ? upcoming : upcoming.slice(0, limit)
}

export function getPastCamps(today: string): CampSession[] {
  return getAllCamps()
    .filter((c) => c.endDate < today)
    .reverse()
}

export function getCampBySlug(slug: string): CampSession | undefined {
  return camps.find((c) => c.slug === slug)
}

export function getFeaturedCamps(): CampSession[] {
  return getAllCamps().filter((c) => c.featured)
}

export function getAllTeachers(): Teacher[] {
  return teachers
}

export function getTeacherBySlug(slug: string): Teacher | undefined {
  return teachers.find((t) => t.slug === slug)
}

export function getTeachersForCamp(camp: CampSession): Teacher[] {
  return camp.teacherSlugs
    .map((slug) => getTeacherBySlug(slug))
    .filter((t): t is Teacher => t !== undefined)
}

export function getCampsForTeacher(teacherSlug: string): CampSession[] {
  return getAllCamps().filter((c) => c.teacherSlugs.includes(teacherSlug))
}

export function getAllVenues(): Venue[] {
  return venues
}

export function getVenueBySlug(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug)
}

export function getVenueForCamp(camp: CampSession): Venue {
  const venue = getVenueBySlug(camp.venueSlug)
  if (!venue) {
    throw new Error(
      `İçerik hatası: "${camp.slug}" kampı "${camp.venueSlug}" mekanına işaret ediyor ama venues.ts'te böyle bir kayıt yok.`,
    )
  }
  return venue
}

export function getFaq(): FaqItem[] {
  return faq
}

export function getTestimonials(): Testimonial[] {
  return testimonials
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
```

- [ ] **Step 7: Testleri çalıştır ve geçtiğini gör**

Run: `npm test`
Expected: PASS — Task 1 testleri + içerik testleri

Bir test başarısızsa **testi değil veriyi düzeltin** — testler spec §6'nın uygulanmasıdır.

- [ ] **Step 8: Görselleri yerleştir**

Otel repo'sundaki `img/` klasöründen mekan fotoğraflarını `public/img/venue/` altına kopyalayın (`venues.ts`'teki adlarla eşleşecek şekilde). Kamp ve hoca görselleri için `public/img/camps/` ve `public/img/teachers/` klasörlerini oluşturup geçici görseller koyun. `görüntü yolları` testi bu dosyaların *varlığını* denetlemez, yalnızca yol biçimini denetler — eksik dosya geliştirme sırasında kırık görsel olarak görünür.

- [ ] **Step 9: Commit**

```bash
git add src/content public/img
git commit -m "feat: add typed content layer with integrity tests"
```

---

## Task 3: Tarih biçimleme yardımcısı

**Files:**
- Create: `src/lib/utils/dates.ts`
- Test: `src/lib/utils/dates.test.ts`

**Interfaces:**
- Consumes: Task 1 → `AppLocale`
- Produces:
  ```ts
  formatDateRange(startDate: string, endDate: string, locale: AppLocale): string
  formatDateLong(date: string, locale: AppLocale): string
  ```

- [ ] **Step 1: Testi yaz (başarısız olacak)**

Ay ve yıl taşan aralıklar bu bileşenin bütün zorluğudur.

`src/lib/utils/dates.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { formatDateLong, formatDateRange } from './dates'

describe('formatDateRange', () => {
  it('aynı ay içindeki aralıkta ayı bir kez yazar', () => {
    expect(formatDateRange('2026-10-12', '2026-10-16', 'tr')).toBe('12–16 Ekim 2026')
    expect(formatDateRange('2026-10-12', '2026-10-16', 'en')).toBe('12–16 October 2026')
  })

  it('ay taşan aralıkta iki ayı da yazar', () => {
    expect(formatDateRange('2026-09-28', '2026-10-02', 'tr')).toBe('28 Eylül – 2 Ekim 2026')
    expect(formatDateRange('2026-09-28', '2026-10-02', 'en')).toBe('28 September – 2 October 2026')
  })

  it('yıl taşan aralıkta iki yılı da yazar', () => {
    expect(formatDateRange('2026-12-29', '2027-01-03', 'tr')).toBe('29 Aralık 2026 – 3 Ocak 2027')
    expect(formatDateRange('2026-12-29', '2027-01-03', 'en')).toBe('29 December 2026 – 3 January 2027')
  })

  it('tek günlük aralığı tek tarih olarak yazar', () => {
    expect(formatDateRange('2026-10-12', '2026-10-12', 'tr')).toBe('12 Ekim 2026')
  })
})

describe('formatDateLong', () => {
  it('tek tarihi uzun biçimde yazar', () => {
    expect(formatDateLong('2026-04-18', 'tr')).toBe('18 Nisan 2026')
    expect(formatDateLong('2026-04-18', 'en')).toBe('18 April 2026')
  })
})
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/lib/utils/dates.test.ts`
Expected: FAIL — `Failed to resolve import "./dates"`

- [ ] **Step 3: Uygulamayı yaz**

`src/lib/utils/dates.ts`:

```ts
import type { AppLocale } from '@/i18n/routing'

const INTL_LOCALE: Record<AppLocale, string> = { tr: 'tr-TR', en: 'en-GB' }
const EN_DASH = '–'

/** 'YYYY-MM-DD' dizesini yerel saat diliminden bağımsız olarak parçalar. */
function parts(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day }
}

function monthName(date: string, locale: AppLocale): string {
  const { year, month, day } = parts(date)
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, day)),
  )
}

export function formatDateLong(date: string, locale: AppLocale): string {
  const { day, year } = parts(date)
  return `${day} ${monthName(date, locale)} ${year}`
}

export function formatDateRange(startDate: string, endDate: string, locale: AppLocale): string {
  const start = parts(startDate)
  const end = parts(endDate)

  if (startDate === endDate) return formatDateLong(startDate, locale)

  if (start.year !== end.year) {
    return `${formatDateLong(startDate, locale)} ${EN_DASH} ${formatDateLong(endDate, locale)}`
  }

  if (start.month !== end.month) {
    return `${start.day} ${monthName(startDate, locale)} ${EN_DASH} ${end.day} ${monthName(endDate, locale)} ${end.year}`
  }

  // Aynı ay: ayı bir kez yaz, gün aralığını boşluksuz en-dash ile bağla
  return `${start.day}${EN_DASH}${end.day} ${monthName(startDate, locale)} ${end.year}`
}
```

- [ ] **Step 4: Testleri çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/utils/dates.test.ts`
Expected: PASS — 5 test

`tr-TR` ay adları büyük harfle başlar (`Ekim`), `en-GB` de (`October`). Test başarısız olursa Node'un ICU verisinin tam olduğunu doğrulayın: `node -e "console.log(new Intl.DateTimeFormat('tr-TR',{month:'long'}).format(new Date(Date.UTC(2026,9,12))))"` → `Ekim`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/dates.ts src/lib/utils/dates.test.ts
git commit -m "feat: add locale-aware date range formatting"
```

---

## Task 4: Kamp durum mantığı ve filtreleme

**Files:**
- Create: `src/lib/utils/camp-status.ts`
- Test: `src/lib/utils/camp-status.test.ts`

**Interfaces:**
- Consumes: Task 2 → `CampSession`, `Program`, `Level`
- Produces:
  ```ts
  const LAST_SPOTS_THRESHOLD = 4
  type CampBadge = 'closed' | 'waitlist' | 'last-spots' | 'open'
  getCampBadge(camp: CampSession): CampBadge
  type CampFilter = { program?: Program | 'all'; level?: Level | 'all' }
  filterCamps(camps: CampSession[], filter: CampFilter): CampSession[]
  ```
  Rozet renk eşlemesi (bileşenlerin kullanacağı): `closed` → nötr, `waitlist` → `amber`, `last-spots` → `coral`, `open` → `olive`.

- [ ] **Step 1: Testi yaz (başarısız olacak)**

`src/lib/utils/camp-status.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getAllCamps } from '@/content'
import type { CampSession } from '@/content'
import { filterCamps, getCampBadge, LAST_SPOTS_THRESHOLD } from './camp-status'

const base = getAllCamps()[0]
const camp = (patch: Partial<CampSession>): CampSession => ({ ...base, ...patch })

describe('getCampBadge', () => {
  it('closed durumu her şeyi ezer', () => {
    expect(getCampBadge(camp({ status: 'closed', spotsLeft: 10 }))).toBe('closed')
  })

  it('waitlist durumu son yerler rozetini ezer', () => {
    expect(getCampBadge(camp({ status: 'waitlist', spotsLeft: 0 }))).toBe('waitlist')
  })

  it('eşik ve altındaki boş yer sayısı son yerler rozeti verir', () => {
    expect(getCampBadge(camp({ status: 'open', spotsLeft: LAST_SPOTS_THRESHOLD }))).toBe('last-spots')
    expect(getCampBadge(camp({ status: 'open', spotsLeft: 1 }))).toBe('last-spots')
  })

  it('eşiğin üstündeki boş yer sayısı açık rozeti verir', () => {
    expect(getCampBadge(camp({ status: 'open', spotsLeft: LAST_SPOTS_THRESHOLD + 1 }))).toBe('open')
  })

  it('open durumda sıfır boş yer son yerler değil, waitlist gibi davranmaz — closed sayılır', () => {
    expect(getCampBadge(camp({ status: 'open', spotsLeft: 0 }))).toBe('closed')
  })
})

describe('filterCamps', () => {
  const items = [
    camp({ slug: 'a', program: 'yoga', level: 'baslangic' }),
    camp({ slug: 'b', program: 'pilates', level: 'tum-seviyeler' }),
    camp({ slug: 'c', program: 'yoga-pilates', level: 'baslangic' }),
  ]

  it('filtre yoksa hepsini döner', () => {
    expect(filterCamps(items, {})).toHaveLength(3)
    expect(filterCamps(items, { program: 'all', level: 'all' })).toHaveLength(3)
  })

  it('programa göre filtreler', () => {
    expect(filterCamps(items, { program: 'yoga' }).map((c) => c.slug)).toEqual(['a'])
  })

  it('seviyeye göre filtreler', () => {
    expect(filterCamps(items, { level: 'baslangic' }).map((c) => c.slug)).toEqual(['a', 'c'])
  })

  it('program ve seviyeyi birlikte uygular', () => {
    expect(filterCamps(items, { program: 'yoga-pilates', level: 'baslangic' }).map((c) => c.slug)).toEqual(['c'])
    expect(filterCamps(items, { program: 'yoga', level: 'tum-seviyeler' })).toEqual([])
  })

  it('girdi dizisini değiştirmez', () => {
    const copy = [...items]
    filterCamps(items, { program: 'yoga' })
    expect(items).toEqual(copy)
  })
})
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/lib/utils/camp-status.test.ts`
Expected: FAIL — `Failed to resolve import "./camp-status"`

- [ ] **Step 3: Uygulamayı yaz**

`src/lib/utils/camp-status.ts`:

```ts
import type { CampSession, Level, Program } from '@/content'

/** Bu sayı ve altındaki boş yer "son yerler" uyarısını tetikler. */
export const LAST_SPOTS_THRESHOLD = 4

export type CampBadge = 'closed' | 'waitlist' | 'last-spots' | 'open'

export function getCampBadge(camp: CampSession): CampBadge {
  if (camp.status === 'closed') return 'closed'
  if (camp.status === 'waitlist') return 'waitlist'
  if (camp.spotsLeft === 0) return 'closed'
  if (camp.spotsLeft <= LAST_SPOTS_THRESHOLD) return 'last-spots'
  return 'open'
}

export type CampFilter = {
  program?: Program | 'all'
  level?: Level | 'all'
}

export function filterCamps(camps: CampSession[], filter: CampFilter): CampSession[] {
  return camps.filter((camp) => {
    if (filter.program && filter.program !== 'all' && camp.program !== filter.program) return false
    if (filter.level && filter.level !== 'all' && camp.level !== filter.level) return false
    return true
  })
}
```

- [ ] **Step 4: Testleri çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/utils/camp-status.test.ts`
Expected: PASS — 10 test

- [ ] **Step 5: Rozet etiketlerini mesaj dosyalarına ekle**

`messages/tr.json` ve `messages/en.json`'a `camp` bölümü ekleyin. Anahtar adları enum değerleriyle birebir eşleşir:

```json
{
  "camp": {
    "badge": {
      "open": "Kayıtlar açık",
      "last-spots": "Son yerler",
      "waitlist": "Yedek liste",
      "closed": "Kayıtlar kapandı"
    },
    "program": { "yoga": "Yoga", "pilates": "Pilates", "yoga-pilates": "Yoga & Pilates" },
    "level": { "baslangic": "Başlangıç", "tum-seviyeler": "Tüm seviyeler", "ileri": "İleri" }
  }
}
```

İngilizce karşılıkları: `Spots open`, `Last spots`, `Waitlist`, `Registration closed`; `Beginner`, `All levels`, `Advanced`.

- [ ] **Step 6: Mesaj testinin hâlâ geçtiğini doğrula**

Run: `npm test`
Expected: PASS — anahtar eşitlik testi iki dosyaya da aynı anahtarları eklediğinizi doğrular

- [ ] **Step 7: Commit**

```bash
git add src/lib/utils/camp-status.ts src/lib/utils/camp-status.test.ts messages
git commit -m "feat: add camp badge derivation and filtering"
```

---

## Task 5: Temel UI bileşenleri ve kontrast koruması

**Files:**
- Create: `src/components/ui/button.tsx`, `section.tsx`, `eyebrow.tsx`, `badge.tsx`, `chip.tsx`, `accordion.tsx`, `gallery-strip.tsx`
- Test: `src/lib/utils/contrast-guard.test.ts`

**Interfaces:**
- Consumes: Task 1 → token yardımcı sınıfları; Task 4 → `CampBadge`
- Produces:
  ```tsx
  <Button variant="primary" | "secondary" | "ghost" size="md" | "lg" href?={string} />
  <Section as?="section" background="cream" | "cream-2" | "ink" size="py" | "sm" />
  <Eyebrow>{children}</Eyebrow>
  <Badge tone="olive" | "coral" | "amber" | "neutral">{children}</Badge>
  <Chip active={boolean} as="button" | "span" />
  <Accordion items={{ id, question, answer }[]} />
  <GalleryStrip images={{ src, alt }[]} />
  ```

- [ ] **Step 1: Kontrast koruma testini yaz (başarısız olacak)**

Bu test spec §5.2'nin birinci kuralını makine tarafından uygulanabilir hale getirir: turkuaz asla metin rengi olmaz.

`src/lib/utils/contrast-guard.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { glob } from 'node:fs/promises'

const ROOT = join(import.meta.dirname, '../../..')

async function sourceFiles(): Promise<string[]> {
  const found: string[] = []
  for await (const entry of glob('src/**/*.{ts,tsx,css}', { cwd: ROOT })) {
    found.push(join(ROOT, entry))
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
```

- [ ] **Step 2: Testi çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/utils/contrast-guard.test.ts`
Expected: PASS — henüz bileşen yok, ihlal de yok. Testin gerçekten çalıştığını doğrulamak için `src/app/[locale]/(public)/page.tsx` içindeki bir sınıfa geçici olarak `text-accent` ekleyin.

Expected: FAIL — `src/app/[locale]/(public)/page.tsx:8 — text-accent (metin için text-accent-deep kullanın)`

Geçici değişikliği geri alın.

- [ ] **Step 3: Button ve Section bileşenlerini yaz**

`src/components/ui/button.tsx` — turkuaz zemin üzerindeki metin `text-ink`:

```tsx
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  // Turkuaz zemin + koyu metin = 7.72:1
  primary: 'bg-accent text-ink hover:bg-accent-hover',
  secondary: 'bg-ink text-cream hover:bg-ink-2',
  ghost: 'bg-transparent text-ink border border-ink/20 hover:border-ink/50',
}

const SIZES: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'

type Props = {
  variant?: Variant
  size?: Size
  href?: string
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className'>

export function Button({ variant = 'primary', size = 'md', href, children, className = '', ...rest }: Props) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  if (href) {
    const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
    if (external) {
      return (
        <a className={classes} href={href} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      )
    }
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
```

`src/components/ui/section.tsx`:

```tsx
import type { ElementType, ReactNode } from 'react'

const BACKGROUNDS = {
  cream: 'bg-cream',
  'cream-2': 'bg-cream-2',
  'cream-3': 'bg-cream-3',
  ink: 'bg-ink text-cream',
} as const

export function Section({
  as: Tag = 'section',
  background = 'cream',
  size = 'py',
  className = '',
  children,
}: {
  as?: ElementType
  background?: keyof typeof BACKGROUNDS
  size?: 'py' | 'sm'
  className?: string
  children: ReactNode
}) {
  return (
    <Tag className={`${BACKGROUNDS[background]} ${size === 'py' ? 'section-py' : 'section-sm'}`}>
      <div className={`container-page ${className}`}>{children}</div>
    </Tag>
  )
}
```

- [ ] **Step 4: Eyebrow, Badge ve Chip bileşenlerini yaz**

`src/components/ui/eyebrow.tsx`:

```tsx
import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>
}
```

`src/components/ui/badge.tsx` — tonlar Task 4'ün `CampBadge` eşlemesine karşılık gelir:

```tsx
import type { ReactNode } from 'react'

const TONES = {
  olive: 'bg-olive/12 text-olive',
  coral: 'bg-coral/14 text-coral',
  amber: 'bg-amber/16 text-ink-3',
  neutral: 'bg-ink/8 text-ink-3',
} as const

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
```

`#5e844b` (olive) ve `#f56c6d` (coral) doygun tonlardır ve krem üzerinde metin olarak kullanıldıklarında düşük opaklıklı bir zeminle birlikte gelir — bu kombinasyon 4.5:1'i geçer. `amber` metin olarak kullanılmaz; zemin olarak kalır, metni `text-ink-3` olur.

`src/components/ui/chip.tsx`:

```tsx
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

const BASE = 'inline-flex items-center rounded-full border px-4 py-2 text-sm transition-colors duration-200'

export function Chip({
  active = false,
  children,
  ...rest
}: { active?: boolean; children: ReactNode } & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      aria-pressed={active}
      className={`${BASE} ${active ? 'border-accent bg-accent text-ink font-semibold' : 'border-border text-ink-3 hover:border-ink/40'}`}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 5: Accordion ve GalleryStrip bileşenlerini yaz**

`src/components/ui/accordion.tsx` — `<details>` tabanlı, JavaScript gerektirmez, bu yüzden sunucu bileşeni kalabilir:

```tsx
import { Plus } from 'lucide-react'

export type AccordionItem = { id: string; question: string; answer: string }

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details className="group py-5" key={item.id}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
            <span className="font-heading text-lg text-ink">{item.question}</span>
            <Plus
              aria-hidden
              className="size-5 shrink-0 text-accent-deep transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="mt-4 max-w-3xl pr-12">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
```

`src/components/ui/gallery-strip.tsx`:

```tsx
import Image from 'next/image'

export function GalleryStrip({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((image, index) => (
        <li className="relative aspect-4/3 overflow-hidden rounded-md" key={image.src}>
          <Image
            alt={image.alt}
            className="object-cover transition-transform duration-500 hover:scale-105"
            fill
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 50vw, 33vw"
            src={image.src}
          />
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 6: Testleri çalıştır ve geçtiğini gör**

Run: `npm test`
Expected: PASS — kontrast koruması dahil tüm testler. `text-accent` ihlali varsa test dosya ve satır numarasıyla söyler.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui src/lib/utils/contrast-guard.test.ts
git commit -m "feat: add base UI components with contrast guard test"
```

---

## Task 6: Site yapılandırması, WhatsApp bağlantısı ve genel yerleşim

**Files:**
- Create: `src/lib/config/site.ts`, `src/lib/config/whatsapp.ts`
- Create: `src/components/layout/navbar.tsx`, `footer.tsx`, `language-switcher.tsx`, `whatsapp-fab.tsx`, `back-to-top.tsx`, `page-hero.tsx`
- Modify: `src/app/[locale]/(public)/layout.tsx`
- Test: `src/lib/config/whatsapp.test.ts`

**Interfaces:**
- Consumes: Task 1 → `Link`, `usePathname`, `routing`; Task 5 → `Button`
- Produces:
  ```ts
  // site.ts
  export const site = {
    name: 'Serenity Retreats',
    email: string, phone: string, phoneHref: string,
    instagram: string, url: string,       // url = NEXT_PUBLIC_SITE_URL veya localhost
  }
  export const NAV_ITEMS: { href: string; key: string }[]
  // whatsapp.ts
  buildWhatsAppUrl(message?: string): string | null   // numara yoksa null
  isWhatsAppEnabled(): boolean
  ```
  `page-hero.tsx` → `<PageHero eyebrow? title lede? image? />` — iç sayfaların ortak başlık bloğu.

- [ ] **Step 1: WhatsApp testini yaz (başarısız olacak)**

`src/lib/config/whatsapp.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'

const load = async () => {
  vi.resetModules()
  return import('./whatsapp')
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('buildWhatsAppUrl', () => {
  it('numara tanımsızsa null döner ve devre dışıdır', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '')
    const { buildWhatsAppUrl, isWhatsAppEnabled } = await load()
    expect(buildWhatsAppUrl('merhaba')).toBeNull()
    expect(isWhatsAppEnabled()).toBe(false)
  })

  it('numaradaki boşluk, artı ve tire karakterlerini temizler', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '+90 501 091 34 17')
    const { buildWhatsAppUrl } = await load()
    expect(buildWhatsAppUrl()).toBe('https://wa.me/905010913417')
  })

  it('mesajı URL kodlar', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '905010913417')
    const { buildWhatsAppUrl } = await load()
    expect(buildWhatsAppUrl('Ekim kampı için bilgi & fiyat?')).toBe(
      'https://wa.me/905010913417?text=Ekim%20kamp%C4%B1%20i%C3%A7in%20bilgi%20%26%20fiyat%3F',
    )
  })

  it('boş mesajda text parametresi eklemez', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '905010913417')
    const { buildWhatsAppUrl } = await load()
    expect(buildWhatsAppUrl('   ')).toBe('https://wa.me/905010913417')
  })
})
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/lib/config/whatsapp.test.ts`
Expected: FAIL — `Failed to resolve import "./whatsapp"`

- [ ] **Step 3: Yapılandırmayı yaz**

`src/lib/config/site.ts` — yer tutucu iletişim değerleri, yayın öncesi doldurulur:

```ts
/** YER TUTUCU: telefon, e-posta ve Instagram değerlerini yayın öncesi güncelleyin. */
export const site = {
  name: 'Serenity Retreats',
  tagline: { tr: 'Yoga ve pilates kampları', en: 'Yoga and pilates retreats' },
  email: 'merhaba@serenityretreats.com',
  phone: '+90 000 000 00 00',
  phoneHref: 'tel:+900000000000',
  instagram: 'https://instagram.com/',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const

/** `key` değerleri messages/*.json içindeki nav bölümünün anahtarlarıdır. */
export const NAV_ITEMS = [
  { href: '/kamplar', key: 'camps' },
  { href: '/hocalar', key: 'teachers' },
  { href: '/mekan', key: 'venue' },
  { href: '/deneyim', key: 'experience' },
  { href: '/hakkimizda', key: 'about' },
  { href: '/sss', key: 'faq' },
  { href: '/iletisim', key: 'contact' },
] as const

export const FOOTER_LEGAL = [
  { href: '/kvkk', key: 'kvkk' },
  { href: '/gizlilik', key: 'privacy' },
] as const
```

`src/lib/config/whatsapp.ts`:

```ts
function rawNumber(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/[^\d]/g, '')
}

export function isWhatsAppEnabled(): boolean {
  return rawNumber().length > 0
}

/** Numara tanımsızsa null döner — çağıran taraf bağlantıyı hiç göstermez. */
export function buildWhatsAppUrl(message?: string): string | null {
  const number = rawNumber()
  if (!number) return null
  const trimmed = message?.trim()
  if (!trimmed) return `https://wa.me/${number}`
  return `https://wa.me/${number}?text=${encodeURIComponent(trimmed)}`
}
```

- [ ] **Step 4: Testleri çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/config/whatsapp.test.ts`
Expected: PASS — 4 test

- [ ] **Step 5: Navbar ve dil değiştiriciyi yaz**

`src/components/layout/language-switcher.tsx` — istemci bileşeni, mevcut yolu koruyarak dil değiştirir:

```tsx
'use client'

import { useParams } from 'next/navigation'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const current = params.locale as string
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest">
      {routing.locales.map((locale) => (
        <button
          aria-current={locale === current ? 'true' : undefined}
          className={`px-2 py-1 transition-opacity ${locale === current ? 'text-ink' : 'text-body hover:text-ink'} ${isPending ? 'opacity-50' : ''}`}
          disabled={isPending || locale === current}
          key={locale}
          onClick={() => startTransition(() => router.replace(pathname, { locale }))}
          type="button"
        >
          {locale}
        </button>
      ))}
    </div>
  )
}
```

`src/components/layout/navbar.tsx` — istemci bileşeni (mobil menü durumu ve odak tuzağı):

```tsx
'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { NAV_ITEMS, site } from '@/lib/config/site'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from './language-switcher'

export function Navbar() {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Menü açıkken Escape kapatır, gövde kaydırması durur, odak panelde kalır.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a, button')
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-cream/90 backdrop-blur-[2px]">
      <div className="container-page flex h-18 items-center justify-between gap-8">
        <Link className="font-heading text-xl tracking-tight text-ink" href="/">
          {site.name}
        </Link>

        <nav aria-label={t('primary')} className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link className="text-sm text-ink-3 transition-colors hover:text-ink" href={item.href} key={item.href}>
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <Button href="/basvuru" size="md">
            {t('cta')}
          </Button>
        </div>

        <button
          aria-expanded={open}
          aria-label={t('openMenu')}
          className="lg:hidden"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Menu className="size-6 text-ink" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-cream lg:hidden" ref={panelRef}>
          <div className="container-page flex h-18 items-center justify-between">
            <span className="font-heading text-xl text-ink">{site.name}</span>
            <button aria-label={t('closeMenu')} onClick={() => setOpen(false)} type="button">
              <X className="size-6 text-ink" />
            </button>
          </div>
          <nav aria-label={t('primary')} className="container-page mt-6 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                className="border-b border-border py-4 font-heading text-2xl text-ink"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-8 flex items-center justify-between">
              <LanguageSwitcher />
              <Button href="/basvuru" onClick={() => setOpen(false)} size="lg">
                {t('cta')}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 6: Footer, WhatsApp FAB, BackToTop ve PageHero'yu yaz**

`src/components/layout/footer.tsx` — dört kolon: marka + kısa açıklama, gezinme, iletişim, yasal. `NAV_ITEMS` ve `FOOTER_LEGAL` üzerinden döner, `site` değerlerini kullanır, alt satırda `© {yıl} Serenity Retreats`. Yıl `new Date().getFullYear()` ile sunucu tarafında hesaplanır (içerik seçicisi değil, görüntüleme değeri olduğu için kısıt geçerli değil).

`src/components/layout/whatsapp-fab.tsx`:

```tsx
import { MessageCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { buildWhatsAppUrl } from '@/lib/config/whatsapp'

export async function WhatsAppFab() {
  const url = buildWhatsAppUrl()
  if (!url) return null // numara tanımsız → buton hiç render edilmez
  const t = await getTranslations('common')
  return (
    <a
      aria-label={t('whatsapp')}
      className="fixed right-5 bottom-5 z-40 flex size-13 items-center justify-center rounded-full bg-accent shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden className="size-6 text-ink" />
    </a>
  )
}
```

`src/components/layout/back-to-top.tsx` — istemci bileşeni; 600px kaydırmadan sonra görünür, `window.scrollTo({ behavior: 'smooth' })` ile başa döner. `prefers-reduced-motion` aktifse `behavior: 'auto'` kullanır (`window.matchMedia('(prefers-reduced-motion: reduce)').matches`).

`src/components/layout/page-hero.tsx` — sunucu bileşeni:

```tsx
import Image from 'next/image'
import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: string
  image?: { src: string; alt: string }
  children?: ReactNode
}) {
  return (
    <section className="relative">
      {image && (
        <div className="relative h-[42vh] min-h-70 w-full">
          <Image alt={image.alt} className="object-cover" fill priority sizes="100vw" src={image.src} />
          <div aria-hidden className="absolute inset-0 bg-ink/35" />
        </div>
      )}
      <div className={`container-page ${image ? 'relative -mt-24 pb-12' : 'section-sm'}`}>
        <div className={image ? 'max-w-3xl rounded-lg bg-cream p-8 md:p-12' : 'max-w-3xl'}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="type-section-title">{title}</h1>
          {lede && <p className="type-lede mt-5">{lede}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Yerleşimi bağla ve nav mesajlarını ekle**

`src/app/[locale]/(public)/layout.tsx`:

```tsx
import type { ReactNode } from 'react'
import { BackToTop } from '@/components/layout/back-to-top'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { WhatsAppFab } from '@/components/layout/whatsapp-fab'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFab />
      <BackToTop />
    </>
  )
}
```

`messages/tr.json`'a ekleyin (ve `en.json`'a İngilizce karşılıklarını):

```json
{
  "nav": {
    "primary": "Ana gezinme",
    "camps": "Kamplar",
    "teachers": "Hocalarımız",
    "venue": "Mekan",
    "experience": "Deneyim",
    "about": "Hakkımızda",
    "faq": "SSS",
    "contact": "İletişim",
    "cta": "Yer Ayır",
    "openMenu": "Menüyü aç",
    "closeMenu": "Menüyü kapat"
  },
  "common": {
    "whatsapp": "WhatsApp'tan yazın",
    "backToTop": "Başa dön",
    "readMore": "Devamını oku",
    "allRightsReserved": "Tüm hakları saklıdır."
  },
  "footer": { "kvkk": "KVKK", "privacy": "Gizlilik Politikası", "navTitle": "Keşfet", "contactTitle": "İletişim" }
}
```

- [ ] **Step 8: Testleri çalıştır ve görsel olarak doğrula**

Run: `npm test`
Expected: PASS — mesaj eşitliği ve kontrast koruması dahil

Run: `npm run dev`

Doğrulanacaklar:
- `/tr` ve `/en`'de navbar ve footer görünüyor; dil değiştirici mevcut yolu koruyor (`/tr/kamplar` → `/en/kamplar`; sayfa henüz 404 olabilir, önemli olan yolun korunması)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` tanımsızken WhatsApp butonu **görünmüyor**; `.env.local`'a bir numara ekleyip sunucuyu yeniden başlatınca görünüyor
- Mobil genişlikte (< 1024px) menü açılıyor, Escape kapatıyor, Tab odağı panelde dönüyor

- [ ] **Step 9: Commit**

```bash
git add src/lib/config src/components/layout src/app/\[locale\] messages
git commit -m "feat: add site config, layout chrome and WhatsApp link builder"
```

---

## Task 7: Ana sayfa

**Files:**
- Create: `src/components/home/hero-home.tsx`, `trust-strip.tsx`, `manifesto.tsx`, `upcoming-camps.tsx`, `includes-list.tsx`, `benefit-block.tsx`, `teachers-preview.tsx`, `venue-preview.tsx`, `testimonials.tsx`, `newsletter-cta.tsx`
- Create: `src/components/camps/camp-card.tsx`
- Modify: `src/app/[locale]/(public)/page.tsx`
- Modify: `messages/tr.json`, `messages/en.json`

**Interfaces:**
- Consumes: Task 2 → `getUpcomingCamps`, `getFeaturedCamps`, `getAllTeachers`, `getVenueBySlug`, `getTestimonials`; Task 3 → `formatDateRange`; Task 4 → `getCampBadge`; Task 5 → `Button`, `Section`, `Eyebrow`, `Badge`, `GalleryStrip`
- Produces: `<CampCard camp={CampSession} locale={AppLocale} />` — Task 8 de bunu kullanır.

- [ ] **Step 1: CampCard bileşenini yaz**

Rozet tonu Task 4'ün `CampBadge` değerlerinden eşlenir:

```tsx
// src/components/camps/camp-card.tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CampSession } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { getCampBadge, type CampBadge } from '@/lib/utils/camp-status'
import { formatDateRange } from '@/lib/utils/dates'

const BADGE_TONE: Record<CampBadge, 'olive' | 'coral' | 'amber' | 'neutral'> = {
  open: 'olive',
  'last-spots': 'coral',
  waitlist: 'amber',
  closed: 'neutral',
}

export function CampCard({ camp, locale }: { camp: CampSession; locale: AppLocale }) {
  const t = useTranslations('camp')
  const badge = getCampBadge(camp)
  const price = new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency',
    currency: camp.currency,
    maximumFractionDigits: 0,
  }).format(camp.priceFrom)

  return (
    <article className="group flex flex-col overflow-hidden rounded-md bg-cream shadow-[var(--shadow-soft)]">
      <Link className="relative aspect-3/2 overflow-hidden" href={`/kamplar/${camp.slug}`}>
        <Image
          alt={camp.title[locale]}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={camp.heroImage}
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <Badge tone={BADGE_TONE[badge]}>{t(`badge.${badge}`)}</Badge>
          <span className="text-xs tracking-widest text-body uppercase">{t(`program.${camp.program}`)}</span>
        </div>
        <h3 className="mt-4 font-heading text-xl text-ink">
          <Link className="hover:text-accent-deep" href={`/kamplar/${camp.slug}`}>
            {camp.title[locale]}
          </Link>
        </h3>
        <p className="mt-2 text-sm">{formatDateRange(camp.startDate, camp.endDate, locale)}</p>
        <p className="mt-3 line-clamp-3 text-sm">{camp.summary[locale]}</p>
        <div className="mt-auto flex items-end justify-between pt-6">
          <span className="text-sm">
            <span className="font-semibold text-ink">{price}</span>{' '}
            <span className="text-body">{t('priceFromSuffix')}</span>
          </span>
          <span className="text-xs text-body">{t('nights', { count: camp.nights })}</span>
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Hero, güven şeridi ve manifesto bölümlerini yaz**

`hero-home.tsx` — tam ekran görsel, koyu bindirme, eyebrow + `type-display` başlık + iki CTA. Görsel `priority` ile yüklenir. Bindirme `bg-ink/40`, metin `text-cream` — beyaza yakın metin koyu görsel üzerinde okunur.

`trust-strip.tsx` — **basın logosu yok**; doğrulanabilir dört bilgi:

```tsx
import { useTranslations } from 'next-intl'
import { Section } from '@/components/ui/section'

export function TrustStrip() {
  const t = useTranslations('home.trust')
  const items = ['assos', 'bay', 'groupSize', 'stone'] as const
  return (
    <Section background="cream-2" size="sm">
      <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {items.map((key) => (
          <li className="text-center" key={key}>
            <p className="font-heading text-2xl text-ink">{t(`${key}.value`)}</p>
            <p className="mt-1 text-xs tracking-widest text-body uppercase">{t(`${key}.label`)}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
```

`manifesto.tsx` — eyebrow + `type-section-title` + iki paragraf, tek kolon, max genişlik `65ch`.

- [ ] **Step 3: Yaklaşan kamplar, dahil olanlar ve fayda bloklarını yaz**

`upcoming-camps.tsx` — `today` prop olarak alır (içerik kısıtı):

```tsx
import { useTranslations } from 'next-intl'
import { getUpcomingCamps } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'

export function UpcomingCamps({ locale, today }: { locale: AppLocale; today: string }) {
  const t = useTranslations('home.upcoming')
  const camps = getUpcomingCamps(today, 3)
  if (camps.length === 0) return null

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="type-section-title">{t('title')}</h2>
        </div>
        <Button href="/kamplar" variant="ghost">
          {t('viewAll')}
        </Button>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {camps.map((camp) => (
          <CampCard camp={camp} key={camp.slug} locale={locale} />
        ))}
      </div>
    </Section>
  )
}
```

`includes-list.tsx` — altı madde, `lucide-react` ikonları (`BedDouble`, `Sparkles`, `Salad`, `Users`, `Footprints`, `Wind`), iki kolonlu ızgara. İkonlar `text-accent-deep`.

`benefit-block.tsx` — yeniden kullanılabilir dönüşümlü blok:

```tsx
import Image from 'next/image'
import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'

export function BenefitBlock({
  eyebrow, title, body, image, reversed = false,
}: {
  eyebrow: string; title: string; body: ReactNode
  image: { src: string; alt: string }; reversed?: boolean
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={`relative aspect-4/3 overflow-hidden rounded-lg ${reversed ? 'md:order-2' : ''}`}>
        <Image alt={image.alt} className="object-cover" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" src={image.src} />
      </div>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="type-section-title">{title}</h3>
        <div className="type-lede mt-5">{body}</div>
      </div>
    </div>
  )
}
```

Ana sayfada üç kez kullanılır: `deepenPractice`, `nourishBody`, `resetMind` — ikincisi `reversed`.

- [ ] **Step 4: Hocalar, mekan, yorumlar ve bülten bölümlerini yaz**

`teachers-preview.tsx` — `getAllTeachers().slice(0, 3)`, her biri kare fotoğraf + ad + unvan, `/hocalar/[slug]`'a link, altta `/hocalar`'a buton.

`venue-preview.tsx` — `getVenueBySlug('karadut-tas-otel')`, `GalleryStrip` ile ilk üç görsel, kısa açıklama, öne çıkanlar listesi, `/mekan`'a buton. **Oda tipi veya fiyat geçmez.**

`testimonials.tsx` — istemci bileşeni (yatay kaydırma). Örnek veri uyarısı geliştirme ortamında görünür:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { getTestimonials } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Section } from '@/components/ui/section'
import { Eyebrow } from '@/components/ui/eyebrow'

export function Testimonials({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.testimonials')
  const items = getTestimonials()
  if (items.length === 0) return null

  return (
    <Section background="cream-2">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h2 className="type-section-title max-w-2xl">{t('title')}</h2>

      {process.env.NODE_ENV !== 'production' && items.some((i) => i.isPlaceholder) && (
        <p className="mt-6 rounded-sm border border-coral bg-coral/10 p-4 text-sm text-ink">
          Geliştirme uyarısı: bu yorumlar ÖRNEKTİR. Yayına almadan önce gerçek yorumlarla değiştirin
          veya bu bölümü kaldırın.
        </p>
      )}

      <ul className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
        {items.map((item) => (
          <li className="min-w-72 flex-1 snap-start rounded-md bg-cream p-8 md:min-w-96" key={item.id}>
            <blockquote className="font-heading text-xl leading-snug text-ink">
              “{item.quote[locale]}”
            </blockquote>
            <cite className="mt-5 block text-xs tracking-widest text-body uppercase not-italic">
              {item.author}
            </cite>
          </li>
        ))}
      </ul>
    </Section>
  )
}
```

`newsletter-cta.tsx` — istemci değil; `<form>` doğrudan Task 12'nin `/api/inquiry` ucuna `kind: 'newsletter'` ile gönderir. Task 13'te `inquiry-form` ile aynı gönderim yardımcısını paylaşır; bu görevde form işaretlemesi ve KVKK onay kutusu hazırlanır, gönderim Task 13'te bağlanır.

- [ ] **Step 5: Ana sayfayı birleştir**

```tsx
// src/app/[locale]/(public)/page.tsx
import { setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { HeroHome } from '@/components/home/hero-home'
import { TrustStrip } from '@/components/home/trust-strip'
import { Manifesto } from '@/components/home/manifesto'
import { UpcomingCamps } from '@/components/home/upcoming-camps'
import { IncludesList } from '@/components/home/includes-list'
import { BenefitsSection } from '@/components/home/benefits-section'
import { TeachersPreview } from '@/components/home/teachers-preview'
import { VenuePreview } from '@/components/home/venue-preview'
import { Testimonials } from '@/components/home/testimonials'
import { NewsletterCta } from '@/components/home/newsletter-cta'

export default async function HomePage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  // Sunucuda render anında hesaplanır ve seçicilere parametre olarak geçer.
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <HeroHome />
      <TrustStrip />
      <Manifesto />
      <UpcomingCamps locale={locale} today={today} />
      <IncludesList />
      <BenefitsSection />
      <TeachersPreview locale={locale} />
      <VenuePreview locale={locale} />
      <Testimonials locale={locale} />
      <NewsletterCta />
    </>
  )
}
```

`benefits-section.tsx` üç `BenefitBlock`'u sarar ve `Section` içinde dikey boşlukla dizer.

- [ ] **Step 6: Mesajları ekle**

`messages/tr.json`'daki `home` bölümünü genişletin: `hero` (eyebrow, title, lede, ctaPrimary, ctaSecondary), `trust` (assos/bay/groupSize/stone → value + label), `manifesto` (eyebrow, title, body1, body2), `upcoming` (eyebrow, title, viewAll), `includes` (eyebrow, title, items.1…6), `benefits` (deepenPractice/nourishBody/resetMind → eyebrow, title, body), `teachers` (eyebrow, title, viewAll), `venue` (eyebrow, title, cta), `testimonials` (eyebrow, title), `newsletter` (title, lede, placeholder, consent, submit). `camp` bölümüne `priceFromSuffix` ("kişi başı, 'den başlayan") ve `nights` (`"{count} gece"`) ekleyin. Aynı anahtarları `en.json`'a İngilizce olarak ekleyin.

- [ ] **Step 7: Testleri çalıştır ve görsel olarak doğrula**

Run: `npm test`
Expected: PASS — mesaj eşitlik testi eksik çeviriyi yakalar; kontrast koruması `text-accent` kullanımını yakalar

Run: `npm run dev` → `/tr` ve `/en`

Doğrulanacaklar:
- On bir bölüm sırayla görünüyor, hiçbirinde basın logosu yok
- Yorumlar bölümünde geliştirme uyarısı görünüyor
- Ekim kampı "Kayıtlar açık" (9 yer), Kasım kampı "Son yerler" (3 yer), Nisan kampı listede yok (geçmiş)
- Fiyatlar `₺24.500` biçiminde (TR) ve `TRY 24,500` biçiminde (EN)
- Tarihler `12–16 Ekim 2026` biçiminde

- [ ] **Step 8: Commit**

```bash
git add src/components src/app messages
git commit -m "feat: build homepage sections"
```

---

## Task 8: Kamplar listesi ve filtreler

**Files:**
- Create: `src/components/camps/camp-filters.tsx`
- Create: `src/app/[locale]/(public)/kamplar/page.tsx`
- Modify: `messages/tr.json`, `messages/en.json`

**Interfaces:**
- Consumes: Task 2 → `getUpcomingCamps`, `getPastCamps`; Task 4 → `filterCamps`, `CampFilter`; Task 7 → `CampCard`
- Produces: `/kamplar?program=<Program|all>&level=<Level|all>` sorgu sözleşmesi. Geçersiz değerler `all` olarak ele alınır.

- [ ] **Step 1: Filtre bileşenini yaz**

`camp-filters.tsx` — istemci bileşeni; durumu URL'ye yazar ki filtreli görünüm paylaşılabilsin:

```tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Chip } from '@/components/ui/chip'
import type { Level, Program } from '@/content'

const PROGRAMS: (Program | 'all')[] = ['all', 'yoga', 'pilates', 'yoga-pilates']
const LEVELS: (Level | 'all')[] = ['all', 'baslangic', 'tum-seviyeler', 'ileri']

export function CampFilters() {
  const t = useTranslations('camp')
  const tf = useTranslations('camps.filters')
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const program = params.get('program') ?? 'all'
  const level = params.get('level') ?? 'all'

  function setParam(key: 'program' | 'level', value: string) {
    const next = new URLSearchParams(params.toString())
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mr-2 text-xs tracking-widest text-body uppercase">{tf('program')}</legend>
        {PROGRAMS.map((value) => (
          <Chip active={program === value} key={value} onClick={() => setParam('program', value)}>
            {value === 'all' ? tf('all') : t(`program.${value}`)}
          </Chip>
        ))}
      </fieldset>
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mr-2 text-xs tracking-widest text-body uppercase">{tf('level')}</legend>
        {LEVELS.map((value) => (
          <Chip active={level === value} key={value} onClick={() => setParam('level', value)}>
            {value === 'all' ? tf('all') : t(`level.${value}`)}
          </Chip>
        ))}
      </fieldset>
    </div>
  )
}
```

- [ ] **Step 2: Liste sayfasını yaz**

```tsx
// src/app/[locale]/(public)/kamplar/page.tsx
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'
import { getPastCamps, getUpcomingCamps, type Level, type Program } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { CampFilters } from '@/components/camps/camp-filters'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { filterCamps } from '@/lib/utils/camp-status'

const PROGRAMS = new Set<string>(['yoga', 'pilates', 'yoga-pilates'])
const LEVELS = new Set<string>(['baslangic', 'tum-seviyeler', 'ileri'])

export default async function CampsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ program?: string; level?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const query = await searchParams
  const t = await getTranslations('camps')
  const today = new Date().toISOString().slice(0, 10)

  // Bilinmeyen sorgu değerleri sessizce "hepsi" olarak ele alınır.
  const program = query.program && PROGRAMS.has(query.program) ? (query.program as Program) : 'all'
  const level = query.level && LEVELS.has(query.level) ? (query.level as Level) : 'all'

  const upcoming = filterCamps(getUpcomingCamps(today), { program, level })
  const past = getPastCamps(today)

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      <Section size="sm">
        <Suspense fallback={null}>
          <CampFilters />
        </Suspense>

        {upcoming.length === 0 ? (
          <p className="type-lede mt-12">{t('empty')}</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((camp) => (
              <CampCard camp={camp} key={camp.slug} locale={locale} />
            ))}
          </div>
        )}
      </Section>

      {past.length > 0 && (
        <Section background="cream-2">
          <h2 className="type-section-title">{t('pastTitle')}</h2>
          <div className="mt-10 grid gap-6 opacity-65 md:grid-cols-2 lg:grid-cols-3">
            {past.map((camp) => (
              <CampCard camp={camp} key={camp.slug} locale={locale} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
```

`useSearchParams` kullanan istemci bileşeni `Suspense` ile sarılmalıdır — aksi halde build sırasında prerender hatası alınır.

- [ ] **Step 3: Mesajları ekle**

`camps` bölümü: `eyebrow`, `title`, `lede`, `empty` ("Bu filtrelere uyan yaklaşan kamp yok."), `pastTitle` ("Geçmiş kamplar"), `filters.program`, `filters.level`, `filters.all` ("Tümü"). İki dilde.

- [ ] **Step 4: Testleri çalıştır ve görsel olarak doğrula**

Run: `npm test`
Expected: PASS

Run: `npm run dev` → `/tr/kamplar`

Doğrulanacaklar:
- İki yaklaşan kamp görünüyor; Nisan kampı "Geçmiş kamplar" başlığı altında soluk
- "Pilates" chip'ine tıklandığında URL `?program=pilates` oluyor ve tek kart kalıyor; sayfa başa kaymıyor
- `/tr/kamplar?program=cokoyunca` (geçersiz değer) hata vermiyor, tüm kampları gösteriyor
- `?program=yoga&level=ileri` → boş durum metni görünüyor

- [ ] **Step 5: Commit**

```bash
git add src/components/camps src/app messages
git commit -m "feat: add camps listing with URL-backed filters"
```

---

## Task 9: Kamp detay sayfası ve JSON-LD

**Files:**
- Create: `src/lib/seo/jsonld.ts`
- Create: `src/components/camps/camp-detail-hero.tsx`, `daily-flow.tsx`, `includes-excludes.tsx`, `camp-cta-card.tsx`, `camp-cta-bar.tsx`
- Create: `src/app/[locale]/(public)/kamplar/[slug]/page.tsx`
- Test: `src/lib/seo/jsonld.test.ts`

**Interfaces:**
- Consumes: Task 2 → `getCampBySlug`, `getAllCamps`, `getTeachersForCamp`, `getVenueForCamp`; Task 3 → `formatDateRange`; Task 4 → `getCampBadge`; Task 6 → `buildWhatsAppUrl`, `site`
- Produces:
  ```ts
  buildCampEventJsonLd(input: { camp: CampSession; venue: Venue; locale: AppLocale; siteUrl: string }): Record<string, unknown>
  buildOrganizationJsonLd(input: { siteUrl: string; locale: AppLocale }): Record<string, unknown>
  buildFaqJsonLd(input: { items: FaqItem[]; locale: AppLocale }): Record<string, unknown>
  ```

- [ ] **Step 1: JSON-LD testini yaz (başarısız olacak)**

`src/lib/seo/jsonld.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getAllCamps, getFaq, getVenueForCamp } from '@/content'
import { buildCampEventJsonLd, buildFaqJsonLd, buildOrganizationJsonLd } from './jsonld'

const camp = getAllCamps()[0]
const venue = getVenueForCamp(camp)
const SITE = 'https://serenityretreats.com'

describe('buildCampEventJsonLd', () => {
  const jsonLd = buildCampEventJsonLd({ camp, venue, locale: 'tr', siteUrl: SITE })

  it('Event şeması üretir', () => {
    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(jsonLd['@type']).toBe('Event')
  })

  it('adı ve açıklamayı istenen dilden alır', () => {
    expect(jsonLd.name).toBe(camp.title.tr)
    expect(jsonLd.description).toBe(camp.summary.tr)
    const en = buildCampEventJsonLd({ camp, venue, locale: 'en', siteUrl: SITE })
    expect(en.name).toBe(camp.title.en)
  })

  it('tarihleri ISO biçiminde verir', () => {
    expect(jsonLd.startDate).toBe(camp.startDate)
    expect(jsonLd.endDate).toBe(camp.endDate)
  })

  it('mekanı Place olarak koordinatlarıyla verir', () => {
    expect(jsonLd.location).toMatchObject({
      '@type': 'Place',
      name: venue.name,
      geo: { '@type': 'GeoCoordinates', latitude: venue.coordinates.lat, longitude: venue.coordinates.lng },
    })
  })

  it('teklifi fiyat, para birimi ve dile göre URL ile verir', () => {
    expect(jsonLd.offers).toMatchObject({
      '@type': 'Offer',
      price: camp.priceFrom,
      priceCurrency: 'TRY',
      url: `${SITE}/tr/kamplar/${camp.slug}`,
    })
  })

  it('durumu schema.org sözlüğüne eşler', () => {
    expect(jsonLd.eventStatus).toBe('https://schema.org/EventScheduled')
    const closed = buildCampEventJsonLd({
      camp: { ...camp, status: 'closed' }, venue, locale: 'tr', siteUrl: SITE,
    })
    expect(closed.eventStatus).toBe('https://schema.org/EventCancelled')
  })

  it('sonunda eğik çizgi olan siteUrl değerinde çift eğik çizgi üretmez', () => {
    const withSlash = buildCampEventJsonLd({ camp, venue, locale: 'tr', siteUrl: `${SITE}/` })
    expect(withSlash.url).toBe(`${SITE}/tr/kamplar/${camp.slug}`)
  })
})

describe('buildOrganizationJsonLd', () => {
  it('Organization şeması üretir', () => {
    const jsonLd = buildOrganizationJsonLd({ siteUrl: SITE, locale: 'tr' })
    expect(jsonLd['@type']).toBe('Organization')
    expect(jsonLd.name).toBe('Serenity Retreats')
    expect(jsonLd.url).toBe(`${SITE}/tr`)
  })
})

describe('buildFaqJsonLd', () => {
  it('her SSS kaydını Question olarak verir', () => {
    const items = getFaq()
    const jsonLd = buildFaqJsonLd({ items, locale: 'tr' })
    expect(jsonLd['@type']).toBe('FAQPage')
    expect(jsonLd.mainEntity).toHaveLength(items.length)
    expect((jsonLd.mainEntity as Record<string, unknown>[])[0]).toMatchObject({
      '@type': 'Question',
      name: items[0].question.tr,
      acceptedAnswer: { '@type': 'Answer', text: items[0].answer.tr },
    })
  })
})
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/lib/seo/jsonld.test.ts`
Expected: FAIL — `Failed to resolve import "./jsonld"`

- [ ] **Step 3: JSON-LD kurucularını yaz**

`src/lib/seo/jsonld.ts`:

```ts
import type { CampSession, CampStatus, FaqItem, Venue } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { site } from '@/lib/config/site'

const EVENT_STATUS: Record<CampStatus, string> = {
  open: 'https://schema.org/EventScheduled',
  waitlist: 'https://schema.org/EventScheduled',
  closed: 'https://schema.org/EventCancelled',
}

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

export function buildCampEventJsonLd({
  camp, venue, locale, siteUrl,
}: {
  camp: CampSession; venue: Venue; locale: AppLocale; siteUrl: string
}): Record<string, unknown> {
  const url = `${trimSlash(siteUrl)}/${locale}/kamplar/${camp.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: camp.title[locale],
    description: camp.summary[locale],
    startDate: camp.startDate,
    endDate: camp.endDate,
    eventStatus: EVENT_STATUS[camp.status],
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url,
    image: `${trimSlash(siteUrl)}${camp.heroImage}`,
    maximumAttendeeCapacity: camp.capacity,
    organizer: { '@type': 'Organization', name: site.name, url: trimSlash(siteUrl) },
    location: {
      '@type': 'Place',
      name: venue.name,
      address: { '@type': 'PostalAddress', addressLocality: venue.location[locale], addressCountry: 'TR' },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: venue.coordinates.lat,
        longitude: venue.coordinates.lng,
      },
    },
    offers: {
      '@type': 'Offer',
      price: camp.priceFrom,
      priceCurrency: camp.currency,
      availability:
        camp.status === 'open' && camp.spotsLeft > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      url,
    },
  }
}

export function buildOrganizationJsonLd({
  siteUrl, locale,
}: { siteUrl: string; locale: AppLocale }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: `${trimSlash(siteUrl)}/${locale}`,
    email: site.email,
    sameAs: [site.instagram],
  }
}

export function buildFaqJsonLd({
  items, locale,
}: { items: FaqItem[]; locale: AppLocale }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question[locale],
      acceptedAnswer: { '@type': 'Answer', text: item.answer[locale] },
    })),
  }
}
```

- [ ] **Step 4: Testleri çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/seo/jsonld.test.ts`
Expected: PASS — 10 test

- [ ] **Step 5: Detay bölümlerini yaz**

`camp-detail-hero.tsx` — `heroImage` tam genişlik + koyu bindirme; üstünde program etiketi, `type-display` başlık, tarih aralığı, mekan adı, süre.

`daily-flow.tsx` — sol tarafta saat, dikey çizgi, sağda başlık + açıklama:

```tsx
import { useTranslations } from 'next-intl'
import type { DailyFlowItem } from '@/content'
import type { AppLocale } from '@/i18n/routing'

export function DailyFlow({ items, locale }: { items: DailyFlowItem[]; locale: AppLocale }) {
  const t = useTranslations('campDetail')
  return (
    <div>
      <h2 className="type-section-title">{t('dailyFlow')}</h2>
      <ol className="mt-8 border-l border-border">
        {items.map((item) => (
          <li className="relative pb-8 pl-8 last:pb-0" key={`${item.time}-${item.title[locale]}`}>
            <span aria-hidden className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent" />
            <span className="block text-xs font-semibold tracking-widest text-accent-deep">{item.time}</span>
            <h3 className="mt-1 font-heading text-lg text-ink">{item.title[locale]}</h3>
            <p className="mt-1 text-sm">{item.desc[locale]}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

`includes-excludes.tsx` — iki kolon; dahil olanlar `Check` ikonu (`text-accent-deep`), olmayanlar `Minus` ikonu (`text-body-light`).

`camp-cta-card.tsx` — sunucu bileşeni, `sticky top-24`; tarih, süre, seviye, kişi başı fiyat, rozet, "Yer Ayır" butonu (`/basvuru?kamp=<slug>`) ve WhatsApp bağlantısı (kamp adı önyazılı, `buildWhatsAppUrl` null dönerse gizli). `status === 'closed'` ise buton devre dışı ve metin "Kayıtlar kapandı"; `waitlist` ise buton metni "Yedek listeye yazıl".

`camp-cta-bar.tsx` — aynı veriyi mobilde ekran altına sabitlenmiş barda gösterir (`fixed bottom-0 lg:hidden`), fiyat + buton. `WhatsAppFab`'ın üstünü kapatmaması için FAB'a `lg:block hidden` yerine bar yüksekliği kadar `bottom` ofseti verilir — bar görünürken FAB `bottom-24`.

- [ ] **Step 6: Detay sayfasını yaz**

```tsx
// src/app/[locale]/(public)/kamplar/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllCamps, getCampBySlug, getFaq, getTeachersForCamp, getVenueForCamp } from '@/content'
import { routing, type AppLocale } from '@/i18n/routing'
import { site } from '@/lib/config/site'
import { buildCampEventJsonLd } from '@/lib/seo/jsonld'
import { formatDateRange } from '@/lib/utils/dates'
/* bölüm bileşenleri: CampDetailHero, DailyFlow, IncludesExcludes, CampCtaCard,
   CampCtaBar, TeacherCard, VenueLocation, GalleryStrip, Accordion, Section */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllCamps().map((camp) => ({ locale, slug: camp.slug })))
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  const camp = getCampBySlug(slug)
  if (!camp) return {}
  const path = `/${locale}/kamplar/${slug}`
  return {
    title: camp.title[locale],
    description: camp.summary[locale],
    alternates: {
      canonical: path,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/kamplar/${slug}`])),
    },
    openGraph: {
      title: camp.title[locale],
      description: camp.summary[locale],
      images: [camp.heroImage],
      url: `${site.url}${path}`,
      type: 'website',
    },
  }
}

export default async function CampDetailPage({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const camp = getCampBySlug(slug)
  if (!camp) notFound()

  const venue = getVenueForCamp(camp)
  const teachers = getTeachersForCamp(camp)
  const t = await getTranslations('campDetail')
  const jsonLd = buildCampEventJsonLd({ camp, venue, locale, siteUrl: site.url })

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      {/* CampDetailHero → iki kolonlu gövde (içerik + CampCtaCard) → galeri → SSS → CampCtaBar */}
    </>
  )
}
```

Sayfa gövdesi: `lg:grid-cols-[1fr_360px] lg:gap-16` ızgarası; sol kolonda özet paragrafı, `DailyFlow`, `IncludesExcludes`, hocalar (`TeacherCard` ızgarası), mekan kısa bölümü (`VenueLocation`), `GalleryStrip`; sağ kolonda `CampCtaCard`. Altta `Accordion` ile `getFaq().slice(0, 4)`.

- [ ] **Step 7: Mesajları ekle ve doğrula**

`campDetail` bölümü: `dailyFlow`, `includes`, `excludes`, `teachers`, `venue`, `gallery`, `faq`, `bookNow`, `joinWaitlist`, `closed`, `whatsappCta`, `whatsappMessage` (`"{camp} kampı hakkında bilgi almak istiyorum."`), `perPerson`, `level`, `duration`, `spotsLeft` (`"{count} yer kaldı"`). İki dilde.

Run: `npm test`
Expected: PASS

Run: `npm run dev` → `/tr/kamplar/yoga-nefes-ekim-2026`

Doğrulanacaklar:
- Sağ kolondaki CTA kartı kaydırma sırasında sabit kalıyor
- Mobil genişlikte alt bar görünüyor, WhatsApp FAB'ı kapatmıyor
- `/tr/kamplar/olmayan-kamp` → 404
- Nisan kampında (waitlist) buton metni "Yedek listeye yazıl"
- Sayfa kaynağında `application/ld+json` bloğu var ve [Rich Results Test](https://search.google.com/test/rich-results) doğruluyor

- [ ] **Step 8: Commit**

```bash
git add src/lib/seo src/components/camps src/app messages
git commit -m "feat: add camp detail page with Event JSON-LD"
```

---

## Task 10: Hocalar ve mekan sayfaları

**Files:**
- Create: `src/components/teachers/teacher-card.tsx`, `teacher-bio.tsx`
- Create: `src/components/venue/venue-gallery.tsx`, `venue-location.tsx`, `venue-highlights.tsx`
- Create: `src/app/[locale]/(public)/hocalar/page.tsx`, `hocalar/[slug]/page.tsx`, `mekan/page.tsx`
- Modify: `messages/tr.json`, `messages/en.json`

**Interfaces:**
- Consumes: Task 2 → `getAllTeachers`, `getTeacherBySlug`, `getCampsForTeacher`, `getAllVenues`, `getVenueBySlug`; Task 7 → `CampCard`
- Produces: `<TeacherCard teacher locale />`, `<VenueLocation venue locale />` — Task 9'un detay sayfası da bunları kullanır.

- [ ] **Step 1: Hoca bileşenlerini yaz**

`src/components/teachers/teacher-card.tsx`:

```tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Teacher } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'

export function TeacherCard({ teacher, locale }: { teacher: Teacher; locale: AppLocale }) {
  const t = useTranslations('camp')
  return (
    <article className="group">
      <Link className="relative block aspect-3/4 overflow-hidden rounded-md" href={`/hocalar/${teacher.slug}`}>
        <Image
          alt={teacher.name}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 33vw"
          src={teacher.photo}
        />
      </Link>
      <h3 className="mt-4 font-heading text-lg text-ink">
        <Link className="hover:text-accent-deep" href={`/hocalar/${teacher.slug}`}>
          {teacher.name}
        </Link>
      </h3>
      <p className="text-sm">{teacher.title[locale]}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {teacher.disciplines.map((discipline) => (
          <li className="rounded-full bg-cream-3 px-3 py-1 text-[11px] tracking-widest text-ink-3 uppercase" key={discipline}>
            {t(`program.${discipline}`)}
          </li>
        ))}
      </ul>
    </article>
  )
}
```

`teacher-bio.tsx` — sol kolonda büyük fotoğraf (`aspect-3/4`, `priority`), sağda ad, unvan, disiplinler, biyografi paragrafı, sertifika listesi (`Award` ikonu), varsa Instagram bağlantısı (`instagram` alanı opsiyonel — yoksa hiç render edilmez).

- [ ] **Step 2: Mekan bileşenlerini yaz**

`venue-gallery.tsx` — ilk görsel iki kolon genişliğinde büyük, kalanı ızgarada; `next/image` ile `fill`, ilki `priority`.

`venue-highlights.tsx` — `highlights[locale]` dizisini `MapPin`/`Check` ikonlu liste olarak basar.

`venue-location.tsx`:

```tsx
import { ExternalLink, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Venue } from '@/content'
import type { AppLocale } from '@/i18n/routing'

export function VenueLocation({ venue, locale }: { venue: Venue; locale: AppLocale }) {
  const t = useTranslations('venue')
  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <div>
        <p className="flex items-center gap-2 text-sm">
          <MapPin aria-hidden className="size-4 text-accent-deep" />
          {venue.location[locale]}
        </p>
        <h3 className="mt-3 font-heading text-2xl text-ink">{venue.name}</h3>
        <p className="type-lede mt-3">{venue.shortDescription[locale]}</p>
        <a
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-deep hover:underline"
          href={venue.websiteUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('officialSite')}
          <ExternalLink aria-hidden className="size-4" />
        </a>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <iframe
          allowFullScreen
          className="h-70 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={venue.mapEmbedUrl}
          title={t('mapTitle', { name: venue.name })}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Hoca sayfalarını yaz**

`hocalar/page.tsx` — `PageHero` + `getAllTeachers()` üzerinden `TeacherCard` ızgarası (`md:grid-cols-2 lg:grid-cols-3`).

`hocalar/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getAllTeachers, getCampsForTeacher, getTeacherBySlug } from '@/content'
import { routing, type AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { TeacherBio } from '@/components/teachers/teacher-bio'
import { Section } from '@/components/ui/section'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllTeachers().map((teacher) => ({ locale, slug: teacher.slug })),
  )
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  const teacher = getTeacherBySlug(slug)
  if (!teacher) return {}
  return {
    title: `${teacher.name} — ${teacher.title[locale]}`,
    description: teacher.bio[locale].slice(0, 155),
    alternates: {
      canonical: `/${locale}/hocalar/${slug}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/hocalar/${slug}`])),
    },
  }
}

export default async function TeacherPage({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const teacher = getTeacherBySlug(slug)
  if (!teacher) notFound()

  const camps = getCampsForTeacher(teacher.slug)
  const t = await getTranslations('teachers')

  return (
    <>
      <Section>
        <TeacherBio locale={locale} teacher={teacher} />
      </Section>
      {camps.length > 0 && (
        <Section background="cream-2">
          <h2 className="type-section-title">{t('campsWithTeacher', { name: teacher.name })}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {camps.map((camp) => (
              <CampCard camp={camp} key={camp.slug} locale={locale} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
```

- [ ] **Step 4: Mekan sayfasını yaz**

`mekan/page.tsx` — bilinçli olarak kısa. Sıra: `PageHero` (mekan hero görseliyle) → `VenueGallery` → iki paragraf metin (taş mimari ve Assos, `messages`'tan) → `VenueHighlights` → `VenueLocation` → yaklaşan kampların bu mekandaki listesi → CTA.

**Bu sayfada oda tipi, oda fiyatı ve müsaitlik geçmez.** Konaklama merakı `VenueLocation` içindeki "Otelin resmi sitesi" bağlantısına yönlendirilir.

- [ ] **Step 5: Mesajları ekle**

`teachers` bölümü: `eyebrow`, `title`, `lede`, `campsWithTeacher` (`"{name} ile kamplar"`), `certifications`, `instagram`.
`venue` bölümü: `eyebrow`, `title`, `lede`, `body1`, `body2`, `highlightsTitle`, `officialSite` ("Otelin resmi sitesi"), `mapTitle` (`"{name} konum haritası"`), `campsHere` ("Bu mekandaki kamplar"), `accommodationNote` ("Oda tipleri ve konaklama detayları için otelin resmi sitesine bakabilirsiniz."). İki dilde.

- [ ] **Step 6: Testleri çalıştır ve görsel olarak doğrula**

Run: `npm test`
Expected: PASS

Run: `npm run dev`

Doğrulanacaklar:
- `/tr/hocalar` üç hoca; `/tr/hocalar/elif-demir` biyografi + iki kamp (Ekim ve Nisan)
- `/tr/hocalar/can-yilmaz` Instagram bağlantısı **yok** (veride tanımsız), sayfa hatasız
- `/tr/hocalar/olmayan-hoca` → 404
- `/tr/mekan` galeri, harita ve dış bağlantı çalışıyor; sayfada "oda" kelimesi yalnızca `accommodationNote` içinde geçiyor
- Harita iframe'i `loading="lazy"` ve başlığı var

- [ ] **Step 7: Commit**

```bash
git add src/components/teachers src/components/venue src/app messages
git commit -m "feat: add teacher and venue pages"
```

---

## Task 11: Form doğrulama şemaları ve referans numarası

**Files:**
- Create: `src/lib/utils/validation.ts`, `src/lib/utils/ids.ts`
- Test: `src/lib/utils/validation.test.ts`, `src/lib/utils/ids.test.ts`

**Interfaces:**
- Consumes: Task 2 → `getCampBySlug`
- Produces:
  ```ts
  // validation.ts
  const inquirySchema: z.ZodType<InquiryInput>   // kind üzerinden ayrık birleşim
  type InquiryInput = CampInquiry | ContactInquiry | NewsletterInquiry
  type CampInquiry = { kind: 'camp'; name: string; email: string; phone: string;
    campSlug: string; guests: number; roomPreference: 'paylasimli' | 'tek-kisilik';
    message?: string; consent: true; turnstileToken?: string }
  type ContactInquiry = { kind: 'contact'; name: string; email: string;
    message: string; consent: true; turnstileToken?: string }
  type NewsletterInquiry = { kind: 'newsletter'; email: string; consent: true;
    turnstileToken?: string }
  flattenZodErrors(error: z.ZodError): Record<string, string>
  // ids.ts
  generateReferenceId(now: Date): string   // 'SR-YYYYMMDD-XXXX'
  ```

- [ ] **Step 1: Referans numarası testini yaz (başarısız olacak)**

`src/lib/utils/ids.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { generateReferenceId } from './ids'

describe('generateReferenceId', () => {
  const now = new Date('2026-07-31T14:05:00Z')

  it('SR-YYYYMMDD-XXXX kalıbına uyar', () => {
    expect(generateReferenceId(now)).toMatch(/^SR-\d{8}-[A-Z2-7]{4}$/)
  })

  it('verilen tarihi kullanır', () => {
    expect(generateReferenceId(now).slice(0, 12)).toBe('SR-20260731-')
  })

  it('ardışık çağrılarda farklı değer üretir', () => {
    const ids = new Set(Array.from({ length: 200 }, () => generateReferenceId(now)))
    // 32^4 = 1.048.576 olasılık; 200 örnekte çakışma pratikte imkânsız.
    expect(ids.size).toBe(200)
  })

  it('karıştırılabilir karakterler (0, 1, 8, 9, I, O) içermez', () => {
    const suffixes = Array.from({ length: 300 }, () => generateReferenceId(now).slice(-4)).join('')
    expect(suffixes).not.toMatch(/[0189IO]/)
  })
})
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/lib/utils/ids.test.ts`
Expected: FAIL — `Failed to resolve import "./ids"`

- [ ] **Step 3: Referans numarası üreticisini yaz**

`src/lib/utils/ids.ts`:

```ts
/** Crockford benzeri alfabe: 0/O, 1/I, 8/B karışıklığı yaratan harfler dışarıda. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ234567'

/**
 * Durumsuz referans numarası. Veritabanı olmadığı için artan sayaç kullanılamaz;
 * tarih insan okunabilirliği, rastgele son ek çakışma önlemeyi sağlar. Bu değer
 * yalnızca yazışmada referanstır, sistemde bir kaydı işaret etmez.
 */
export function generateReferenceId(now: Date): string {
  const date = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
  ].join('')

  const bytes = crypto.getRandomValues(new Uint8Array(4))
  const suffix = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('')

  return `SR-${date}-${suffix}`
}
```

Alfabe 30 karakter olduğu için testteki `[A-Z2-7]{4}` deseni geçerlidir (`2-7` aralığı `234567`'yi kapsar).

- [ ] **Step 4: Testleri çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/utils/ids.test.ts`
Expected: PASS — 4 test

- [ ] **Step 5: Doğrulama testini yaz (başarısız olacak)**

`src/lib/utils/validation.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getAllCamps } from '@/content'
import { flattenZodErrors, inquirySchema } from './validation'

const CAMP_SLUG = getAllCamps()[0].slug

const validCamp = {
  kind: 'camp' as const,
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 555 111 22 33',
  campSlug: CAMP_SLUG,
  guests: 2,
  roomPreference: 'paylasimli' as const,
  message: 'Tek başıma katılacağım.',
  consent: true as const,
}

const parse = (input: unknown) => inquirySchema.safeParse(input)

describe('kind: camp', () => {
  it('geçerli gövdeyi kabul eder', () => {
    expect(parse(validCamp).success).toBe(true)
  })

  it('mesajı opsiyoneldir', () => {
    const { message, ...withoutMessage } = validCamp
    expect(parse(withoutMessage).success).toBe(true)
  })

  it('var olmayan kamp slug değerini reddeder', () => {
    const result = parse({ ...validCamp, campSlug: 'olmayan-kamp' })
    expect(result.success).toBe(false)
    if (!result.success) expect(flattenZodErrors(result.error).campSlug).toBeTruthy()
  })

  it('kişi sayısı sınırlarını uygular', () => {
    expect(parse({ ...validCamp, guests: 0 }).success).toBe(false)
    expect(parse({ ...validCamp, guests: 1 }).success).toBe(true)
    expect(parse({ ...validCamp, guests: 8 }).success).toBe(true)
    expect(parse({ ...validCamp, guests: 9 }).success).toBe(false)
    expect(parse({ ...validCamp, guests: 2.5 }).success).toBe(false)
  })

  it('mesaj uzunluk sınırını uygular', () => {
    expect(parse({ ...validCamp, message: 'a'.repeat(1000) }).success).toBe(true)
    expect(parse({ ...validCamp, message: 'a'.repeat(1001) }).success).toBe(false)
  })

  it('ad uzunluk sınırlarını uygular', () => {
    expect(parse({ ...validCamp, name: 'A' }).success).toBe(false)
    expect(parse({ ...validCamp, name: 'Al' }).success).toBe(true)
    expect(parse({ ...validCamp, name: 'a'.repeat(81) }).success).toBe(false)
  })

  it('geçersiz e-postayı reddeder', () => {
    expect(parse({ ...validCamp, email: 'ayse@' }).success).toBe(false)
  })

  it('telefon biçimlerini toleranslı kabul eder ama saçmalığı reddeder', () => {
    for (const phone of ['+905551112233', '0555 111 22 33', '(555) 111-22-33', '+44 20 7946 0958']) {
      expect(parse({ ...validCamp, phone }).success, phone).toBe(true)
    }
    for (const phone of ['telefon yok', '123', '']) {
      expect(parse({ ...validCamp, phone }).success, phone).toBe(false)
    }
  })

  it('KVKK onayı olmadan reddeder', () => {
    expect(parse({ ...validCamp, consent: false }).success).toBe(false)
  })

  it('oda tercihi enum dışı değeri reddeder', () => {
    expect(parse({ ...validCamp, roomPreference: 'kral-suiti' }).success).toBe(false)
  })
})

describe('kind: contact', () => {
  const validContact = {
    kind: 'contact' as const,
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    message: 'Kurumsal grup için bilgi almak istiyorum.',
    consent: true as const,
  }

  it('geçerli gövdeyi kabul eder', () => {
    expect(parse(validContact).success).toBe(true)
  })

  it('telefon ve kamp alanlarını zorunlu tutmaz', () => {
    expect(parse(validContact).success).toBe(true)
  })

  it('mesajı zorunludur', () => {
    const { message, ...withoutMessage } = validContact
    expect(parse(withoutMessage).success).toBe(false)
  })
})

describe('kind: newsletter', () => {
  it('yalnızca e-posta ve onay ile geçerlidir', () => {
    expect(parse({ kind: 'newsletter', email: 'okur@example.com', consent: true }).success).toBe(true)
  })

  it('ad, telefon ve kamp alanlarını zorunlu tutmaz', () => {
    const result = parse({ kind: 'newsletter', email: 'okur@example.com', consent: true })
    expect(result.success).toBe(true)
  })

  it('onay olmadan reddeder', () => {
    expect(parse({ kind: 'newsletter', email: 'okur@example.com', consent: false }).success).toBe(false)
  })
})

describe('kind ayrımı', () => {
  it('bilinmeyen kind değerini reddeder', () => {
    expect(parse({ kind: 'spam', email: 'a@b.com', consent: true }).success).toBe(false)
  })

  it('kind eksikse reddeder', () => {
    expect(parse({ email: 'a@b.com', consent: true }).success).toBe(false)
  })
})

describe('flattenZodErrors', () => {
  it('alan adına göre tek mesaj döner', () => {
    const result = parse({ ...validCamp, email: 'bozuk', guests: 99 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = flattenZodErrors(result.error)
      expect(Object.keys(errors).sort()).toEqual(['email', 'guests'])
      expect(typeof errors.email).toBe('string')
    }
  })
})
```

- [ ] **Step 6: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/lib/utils/validation.test.ts`
Expected: FAIL — `Failed to resolve import "./validation"`

- [ ] **Step 7: Şemaları yaz**

`src/lib/utils/validation.ts`:

```ts
import { z } from 'zod'
import { getCampBySlug } from '@/content'

/** En az 7 rakam içeren, yalnızca rakam/boşluk/+/-/()/. karakterlerinden oluşan dizeler. */
const phone = z
  .string()
  .trim()
  .min(1)
  .refine((value) => /^[\d\s+()./-]+$/.test(value) && (value.match(/\d/g)?.length ?? 0) >= 7, {
    message: 'invalidPhone',
  })

const email = z.string().trim().toLowerCase().email({ message: 'invalidEmail' })
const name = z.string().trim().min(2, { message: 'nameTooShort' }).max(80, { message: 'nameTooLong' })
const consent = z.literal(true, { message: 'consentRequired' })
const turnstileToken = z.string().optional()

const campInquiry = z.object({
  kind: z.literal('camp'),
  name,
  email,
  phone,
  campSlug: z.string().refine((slug) => getCampBySlug(slug) !== undefined, { message: 'unknownCamp' }),
  guests: z.number().int({ message: 'guestsInteger' }).min(1, { message: 'guestsMin' }).max(8, { message: 'guestsMax' }),
  roomPreference: z.enum(['paylasimli', 'tek-kisilik'], { message: 'invalidRoomPreference' }),
  message: z.string().trim().max(1000, { message: 'messageTooLong' }).optional(),
  consent,
  turnstileToken,
})

const contactInquiry = z.object({
  kind: z.literal('contact'),
  name,
  email,
  message: z.string().trim().min(1, { message: 'messageRequired' }).max(1000, { message: 'messageTooLong' }),
  consent,
  turnstileToken,
})

const newsletterInquiry = z.object({
  kind: z.literal('newsletter'),
  email,
  consent,
  turnstileToken,
})

export const inquirySchema = z.discriminatedUnion('kind', [campInquiry, contactInquiry, newsletterInquiry])

export type CampInquiry = z.infer<typeof campInquiry>
export type ContactInquiry = z.infer<typeof contactInquiry>
export type NewsletterInquiry = z.infer<typeof newsletterInquiry>
export type InquiryInput = z.infer<typeof inquirySchema>

/** Alan başına ilk hata mesajını döner — arayüz alan altına tek satır basar. */
export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && !(field in result)) {
      result[field] = issue.message
    }
  }
  return result
}
```

Hata mesajları **anahtar** olarak döner (`invalidEmail`, `guestsMax`); arayüz bunları `messages/*.json`'daki `form.errors` bölümünden çevirir. Böylece sunucu hataları da iki dilde görünür.

- [ ] **Step 8: Testleri çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/utils/validation.test.ts`
Expected: PASS — 20 test

zod 4'te `.email()` ve `z.literal(true, { message })` imzaları zod 3'ten farklı olabilir. Test başarısız olursa `node_modules/zod/README.md` içindeki güncel API'yi kontrol edin.

- [ ] **Step 9: Hata mesajı çevirilerini ekle**

`messages/tr.json` → `form.errors`: `invalidEmail`, `invalidPhone`, `nameTooShort`, `nameTooLong`, `consentRequired`, `unknownCamp`, `guestsInteger`, `guestsMin`, `guestsMax`, `invalidRoomPreference`, `messageRequired`, `messageTooLong`, `generic` ("Bir şeyler ters gitti. Lütfen tekrar deneyin."), `rateLimited` ("Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin."). Aynı anahtarlar `en.json`'da.

- [ ] **Step 10: Commit**

```bash
git add src/lib/utils messages
git commit -m "feat: add inquiry validation schemas and reference id generator"
```

---

## Task 12: Talep API ucu, e-posta ve güvenlik

**Files:**
- Create: `src/lib/security/rate-limit.ts`, `src/lib/security/turnstile.ts`
- Create: `src/lib/mail/types.ts`, `src/lib/mail/templates.ts`, `src/lib/mail/index.ts`
- Create: `src/app/api/inquiry/route.ts`
- Test: `src/lib/security/rate-limit.test.ts`, `src/lib/mail/templates.test.ts`

**Interfaces:**
- Consumes: Task 2 → `getCampBySlug`, `getVenueForCamp`; Task 3 → `formatDateRange`; Task 6 → `site`; Task 11 → `inquirySchema`, `flattenZodErrors`, `InquiryInput`, `generateReferenceId`
- Produces:
  ```ts
  checkRateLimit(key: string): Promise<{ allowed: boolean }>
  verifyTurnstile(token: string | undefined, ip: string): Promise<boolean>  // yapılandırılmamışsa true
  sendInquiryEmails(input: InquiryInput, referenceId: string): Promise<{ delivered: boolean }>
  ```
  API sözleşmesi: `200 { ok: true, referenceId }` · `400 { ok: false, errors }` · `429 { ok: false, error: 'rate_limited' }` · `500 { ok: false, error: 'server_error' }`

- [ ] **Step 1: Hız sınırı testini yaz (başarısız olacak)**

`src/lib/security/rate-limit.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'

const load = async () => {
  vi.resetModules()
  return import('./rate-limit')
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('checkRateLimit (in-memory geri dönüş)', () => {
  it('Upstash yapılandırılmamışsa in-memory sayaç kullanır', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    const { checkRateLimit, RATE_LIMIT_MAX } = await load()

    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect((await checkRateLimit('1.2.3.4')).allowed, `istek ${i + 1}`).toBe(true)
    }
    expect((await checkRateLimit('1.2.3.4')).allowed).toBe(false)
  })

  it('farklı anahtarları bağımsız sayar', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    const { checkRateLimit, RATE_LIMIT_MAX } = await load()
    for (let i = 0; i < RATE_LIMIT_MAX; i++) await checkRateLimit('a')
    expect((await checkRateLimit('a')).allowed).toBe(false)
    expect((await checkRateLimit('b')).allowed).toBe(true)
  })

  it('pencere dolduktan sonra sayaç sıfırlanır', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.useFakeTimers()
    const { checkRateLimit, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } = await load()

    for (let i = 0; i < RATE_LIMIT_MAX; i++) await checkRateLimit('c')
    expect((await checkRateLimit('c')).allowed).toBe(false)

    vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS + 1000)
    expect((await checkRateLimit('c')).allowed).toBe(true)
  })
})
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/lib/security/rate-limit.test.ts`
Expected: FAIL — `Failed to resolve import "./rate-limit"`

- [ ] **Step 3: Güvenlik yardımcılarını yaz**

`src/lib/security/rate-limit.ts`:

```ts
export const RATE_LIMIT_MAX = 5
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

function inMemoryCheck(key: string): { allowed: boolean } {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }
  if (bucket.count >= RATE_LIMIT_MAX) return { allowed: false }
  bucket.count += 1
  return { allowed: true }
}

/**
 * Upstash yapılandırılmışsa dağıtık, değilse süreç içi sayaç kullanır.
 * Süreç içi sayaç sunucusuz ortamda örnekler arasında paylaşılmaz — bu bilinçli
 * bir ödünç: yapılandırma eksikken form çalışmaya devam eder.
 */
export async function checkRateLimit(key: string): Promise<{ allowed: boolean }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return inMemoryCheck(key)

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    const limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, '10 m'),
      prefix: 'serenity:inquiry',
    })
    const { success } = await limiter.limit(key)
    return { allowed: success }
  } catch {
    // Upstash erişilemezse formu kilitlemek yerine süreç içi sayaca düş.
    return inMemoryCheck(key)
  }
}
```

`src/lib/security/turnstile.ts`:

```ts
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** Turnstile yapılandırılmamışsa doğrulama atlanır ve true döner. */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    })
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch {
    return false
  }
}
```

- [ ] **Step 4: Testleri çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/security/rate-limit.test.ts`
Expected: PASS — 3 test

- [ ] **Step 5: E-posta şablonu testini yaz (başarısız olacak)**

`src/lib/mail/templates.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getAllCamps } from '@/content'
import { renderAutoReply, renderInternalNotification } from './templates'
import type { CampInquiry } from '@/lib/utils/validation'

const camp = getAllCamps()[0]
const REF = 'SR-20260731-A7K2'

const inquiry: CampInquiry = {
  kind: 'camp',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+905551112233',
  campSlug: camp.slug,
  guests: 2,
  roomPreference: 'tek-kisilik',
  message: 'Vejetaryenim.',
  consent: true,
}

describe('renderInternalNotification', () => {
  const mail = renderInternalNotification(inquiry, REF)

  it('konuda referans numarası ve kamp adı geçer', () => {
    expect(mail.subject).toContain(REF)
    expect(mail.subject).toContain(camp.title.tr)
  })

  it('gövdede tüm form alanları geçer', () => {
    for (const value of [inquiry.name, inquiry.email, inquiry.phone, 'Vejetaryenim.', '2']) {
      expect(mail.text, `${value} eksik`).toContain(value)
    }
  })

  it('oda tercihini okunabilir metne çevirir', () => {
    expect(mail.text).toMatch(/tek kişilik/i)
  })

  it('HTML gövdesinde kullanıcı girdisi kaçırılır', () => {
    const xss = { ...inquiry, name: '<script>alert(1)</script>' }
    expect(renderInternalNotification(xss, REF).html).not.toContain('<script>')
    expect(renderInternalNotification(xss, REF).html).toContain('&lt;script&gt;')
  })
})

describe('renderAutoReply', () => {
  it('katılımcıya referans numarası ve kamp bilgisini yazar', () => {
    const mail = renderAutoReply(inquiry, REF)
    expect(mail.subject).toContain('Serenity Retreats')
    expect(mail.text).toContain(REF)
    expect(mail.text).toContain(camp.title.tr)
  })

  it('bülten kaydında kamp bilgisi aramaz', () => {
    const mail = renderAutoReply({ kind: 'newsletter', email: 'a@b.com', consent: true }, REF)
    expect(mail.subject).toBeTruthy()
    expect(mail.text).toContain(REF)
  })
})
```

- [ ] **Step 6: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/lib/mail/templates.test.ts`
Expected: FAIL — `Failed to resolve import "./templates"`

- [ ] **Step 7: E-posta katmanını yaz**

`src/lib/mail/types.ts`:

```ts
export type RenderedMail = { subject: string; text: string; html: string }
```

`src/lib/mail/templates.ts` — kullanıcı girdisi HTML'e girmeden kaçırılır:

```ts
import { getCampBySlug } from '@/content'
import { site } from '@/lib/config/site'
import { formatDateRange } from '@/lib/utils/dates'
import type { InquiryInput } from '@/lib/utils/validation'
import type { RenderedMail } from './types'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const ROOM_LABEL: Record<string, string> = {
  paylasimli: 'Paylaşımlı oda',
  'tek-kisilik': 'Tek kişilik oda',
}

function campLine(input: InquiryInput): string {
  if (input.kind !== 'camp') return ''
  const camp = getCampBySlug(input.campSlug)
  if (!camp) return input.campSlug
  return `${camp.title.tr} (${formatDateRange(camp.startDate, camp.endDate, 'tr')})`
}

function toHtml(lines: string[]): string {
  return `<div style="font-family:system-ui,sans-serif;color:#221c25;line-height:1.6">
${lines.map((line) => `<p style="margin:0 0 8px">${line}</p>`).join('\n')}
</div>`
}

export function renderInternalNotification(input: InquiryInput, referenceId: string): RenderedMail {
  const rows: [string, string][] = [['Referans', referenceId], ['Tür', input.kind]]

  if (input.kind === 'camp') {
    rows.push(
      ['Kamp', campLine(input)],
      ['Ad Soyad', input.name],
      ['E-posta', input.email],
      ['Telefon', input.phone],
      ['Kişi sayısı', String(input.guests)],
      ['Oda tercihi', ROOM_LABEL[input.roomPreference]],
      ['Mesaj', input.message?.trim() || '—'],
    )
  } else if (input.kind === 'contact') {
    rows.push(['Ad Soyad', input.name], ['E-posta', input.email], ['Mesaj', input.message])
  } else {
    rows.push(['E-posta', input.email])
  }

  const subjectSuffix = input.kind === 'camp' ? ` — ${campLine(input)}` : ` — ${input.kind}`

  return {
    subject: `[${referenceId}] Yeni talep${subjectSuffix}`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
    html: toHtml(rows.map(([label, value]) => `<strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}`)),
  }
}

export function renderAutoReply(input: InquiryInput, referenceId: string): RenderedMail {
  const greeting = 'name' in input ? `Merhaba ${input.name},` : 'Merhaba,'

  const lines =
    input.kind === 'newsletter'
      ? [greeting, 'Bültenimize kaydolduğunuz için teşekkürler. Yeni kamp tarihlerini ilk siz duyacaksınız.']
      : [
          greeting,
          input.kind === 'camp'
            ? `${campLine(input)} kampı için talebinizi aldık.`
            : 'Mesajınızı aldık.',
          'En kısa sürede, genellikle bir iş günü içinde size dönüyoruz.',
          `Referans numaranız: ${referenceId}`,
          `Acele bir sorunuz varsa ${site.email} adresinden yazabilirsiniz.`,
        ]

  return {
    subject: `Serenity Retreats — talebinizi aldık (${referenceId})`,
    text: [...lines, '', site.name].join('\n'),
    html: toHtml([...lines.map(escapeHtml), `<em>${escapeHtml(site.name)}</em>`]),
  }
}
```

`src/lib/mail/index.ts` — Resend anahtarı yoksa konsola loglar ve `delivered: false` döner:

```ts
import { site } from '@/lib/config/site'
import type { InquiryInput } from '@/lib/utils/validation'
import { renderAutoReply, renderInternalNotification } from './templates'

const FROM = `Serenity Retreats <bilgi@${new URL(site.url).hostname.replace(/^www\./, '')}>`

export async function sendInquiryEmails(
  input: InquiryInput,
  referenceId: string,
): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.INQUIRY_TO_EMAIL

  const internal = renderInternalNotification(input, referenceId)
  const autoReply = renderAutoReply(input, referenceId)

  // Yapılandırma eksikken formu kırmak yerine akışı loglayarak devam et.
  if (!apiKey || !to) {
    console.info('[inquiry] E-posta yapılandırılmadı, gönderim atlandı.', {
      referenceId,
      kind: input.kind,
      subject: internal.subject,
    })
    return { delivered: false }
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  const results = await Promise.allSettled([
    resend.emails.send({ from: FROM, to, replyTo: input.email, ...internal }),
    resend.emails.send({ from: FROM, to: input.email, ...autoReply }),
  ])

  const failed = results.filter((r) => r.status === 'rejected')
  if (failed.length > 0) {
    console.error('[inquiry] E-posta gönderimi kısmen başarısız', { referenceId, failed })
  }
  // Kurum bildirimi (ilk gönderim) gittiyse teslim edilmiş sayılır.
  return { delivered: results[0].status === 'fulfilled' }
}
```

- [ ] **Step 8: Testleri çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/mail/templates.test.ts`
Expected: PASS — 6 test

- [ ] **Step 9: API ucunu yaz**

`src/app/api/inquiry/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { sendInquiryEmails } from '@/lib/mail'
import { generateReferenceId } from '@/lib/utils/ids'
import { flattenZodErrors, inquirySchema } from '@/lib/utils/validation'

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: Request) {
  const ip = clientIp(request)

  try {
    const { allowed } = await checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, errors: { form: 'generic' } }, { status: 400 })
    }

    const parsed = inquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: flattenZodErrors(parsed.error) }, { status: 400 })
    }

    const isHuman = await verifyTurnstile(parsed.data.turnstileToken, ip)
    if (!isHuman) {
      return NextResponse.json({ ok: false, errors: { form: 'generic' } }, { status: 400 })
    }

    const referenceId = generateReferenceId(new Date())
    await sendInquiryEmails(parsed.data, referenceId)

    return NextResponse.json({ ok: true, referenceId }, { status: 200 })
  } catch (error) {
    console.error('[inquiry] Beklenmeyen hata', error)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
```

- [ ] **Step 10: Ucu elle doğrula**

Run: `npm run dev`, ardından:

```bash
# Geçerli istek → 200 ve referans numarası
curl -s -X POST http://localhost:3000/api/inquiry -H 'Content-Type: application/json' \
  -d '{"kind":"camp","name":"Ayşe Yılmaz","email":"ayse@example.com","phone":"+905551112233","campSlug":"yoga-nefes-ekim-2026","guests":2,"roomPreference":"paylasimli","consent":true}'

# Geçersiz e-posta → 400 ve alan hatası
curl -s -X POST http://localhost:3000/api/inquiry -H 'Content-Type: application/json' \
  -d '{"kind":"camp","name":"Ayşe","email":"bozuk","phone":"+905551112233","campSlug":"yoga-nefes-ekim-2026","guests":2,"roomPreference":"paylasimli","consent":true}'

# Bülten → 200
curl -s -X POST http://localhost:3000/api/inquiry -H 'Content-Type: application/json' \
  -d '{"kind":"newsletter","email":"okur@example.com","consent":true}'

# Altıncı istek → 429
for i in $(seq 1 6); do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/inquiry \
  -H 'Content-Type: application/json' -d '{"kind":"newsletter","email":"a@b.com","consent":true}'; done
```

Expected: `200` + `{"ok":true,"referenceId":"SR-…"}` · `400` + `{"ok":false,"errors":{"email":"invalidEmail"}}` · `200` · son satır `429`. `RESEND_API_KEY` tanımsızken sunucu konsolunda `[inquiry] E-posta yapılandırılmadı` satırı görünür ve istek yine 200 döner.

- [ ] **Step 11: Commit**

```bash
git add src/lib/security src/lib/mail src/app/api
git commit -m "feat: add inquiry API with email, rate limiting and Turnstile"
```

---

## Task 13: Başvuru formu ve gönderim arayüzü

**Files:**
- Create: `src/lib/inquiry-client.ts`
- Create: `src/components/inquiry/inquiry-form.tsx`, `consent-checkbox.tsx`, `field.tsx`
- Create: `src/app/[locale]/(public)/basvuru/page.tsx`, `basvuru-alindi/page.tsx`
- Modify: `src/components/home/newsletter-cta.tsx`
- Modify: `messages/tr.json`, `messages/en.json`

**Interfaces:**
- Consumes: Task 2 → `getUpcomingCamps`; Task 11 → `InquiryInput`; Task 12 → API sözleşmesi
- Produces:
  ```ts
  submitInquiry(input: InquiryInput): Promise<
    | { ok: true; referenceId: string }
    | { ok: false; errors?: Record<string, string>; error?: 'rate_limited' | 'server_error' | 'network' }
  >
  ```
  `<Field label error htmlFor children />` — etiket, alan ve hata mesajını `aria-describedby` ile bağlar.

- [ ] **Step 1: Gönderim istemcisini yaz**

`src/lib/inquiry-client.ts` — hem `inquiry-form` hem `newsletter-cta` bunu kullanır:

```ts
import type { InquiryInput } from '@/lib/utils/validation'

export type SubmitResult =
  | { ok: true; referenceId: string }
  | {
      ok: false
      errors?: Record<string, string>
      error?: 'rate_limited' | 'server_error' | 'network'
    }

export async function submitInquiry(input: InquiryInput): Promise<SubmitResult> {
  try {
    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const data = (await response.json()) as SubmitResult
    if (response.ok && data.ok) return data
    return data.ok === false ? data : { ok: false, error: 'server_error' }
  } catch {
    // Ağ hatası: form verisi korunur, çağıran taraf WhatsApp alternatifini öne çıkarır.
    return { ok: false, error: 'network' }
  }
}
```

- [ ] **Step 2: Field ve ConsentCheckbox bileşenlerini yaz**

`src/components/inquiry/field.tsx`:

```tsx
import type { ReactNode } from 'react'

export function Field({
  label, htmlFor, error, hint, children,
}: {
  label: string; htmlFor: string; error?: string; hint?: string; children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-body" id={`${htmlFor}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs font-semibold text-coral" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const inputClass =
  'w-full rounded-sm border border-border bg-cream px-4 py-3 text-ink placeholder:text-body-light focus:border-accent-deep focus:outline-2 focus:outline-offset-1 focus:outline-accent-deep'
```

`consent-checkbox.tsx` — onay kutusu + KVKK sayfasına bağlantı içeren etiket; `aria-describedby` ile hata mesajına bağlanır.

- [ ] **Step 3: Başvuru formunu yaz**

`src/components/inquiry/inquiry-form.tsx` — istemci bileşeni:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import type { CampSession } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl } from '@/lib/config/whatsapp'
import { submitInquiry } from '@/lib/inquiry-client'
import { formatDateRange } from '@/lib/utils/dates'
import { ConsentCheckbox } from './consent-checkbox'
import { Field, inputClass } from './field'

export function InquiryForm({ camps, locale }: { camps: CampSession[]; locale: AppLocale }) {
  const t = useTranslations('form')
  const te = useTranslations('form.errors')
  const router = useRouter()
  const params = useSearchParams()

  const preselected = params.get('kamp')
  const initialCamp = camps.some((c) => c.slug === preselected) ? preselected! : (camps[0]?.slug ?? '')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [failedOnce, setFailedOnce] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrors({})

    const data = new FormData(event.currentTarget)
    const result = await submitInquiry({
      kind: 'camp',
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      campSlug: String(data.get('campSlug') ?? ''),
      guests: Number(data.get('guests') ?? 1),
      roomPreference: data.get('roomPreference') as 'paylasimli' | 'tek-kisilik',
      message: String(data.get('message') ?? '') || undefined,
      consent: data.get('consent') === 'on',
    } as never)

    setSubmitting(false)

    if (result.ok) {
      router.push(`/basvuru-alindi?ref=${result.referenceId}`)
      return
    }

    setFailedOnce(true)
    // Form verisi korunur — yeniden render edilmiyor, yalnızca hatalar ekleniyor.
    setErrors(result.errors ?? { form: result.error === 'rate_limited' ? 'rateLimited' : 'generic' })
  }

  const whatsappUrl = buildWhatsAppUrl(t('whatsappFallbackMessage'))

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
      <Field error={errors.name && te(errors.name)} htmlFor="name" label={t('name')}>
        <input
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
          className={inputClass}
          id="name"
          name="name"
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field error={errors.email && te(errors.email)} htmlFor="email" label={t('email')}>
          <input
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={inputClass}
            id="email"
            name="email"
            type="email"
            required
          />
        </Field>
        <Field error={errors.phone && te(errors.phone)} htmlFor="phone" label={t('phone')}>
          <input
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            className={inputClass}
            id="phone"
            name="phone"
            type="tel"
            required
          />
        </Field>
      </div>

      <Field error={errors.campSlug && te(errors.campSlug)} htmlFor="campSlug" label={t('camp')}>
        <select className={inputClass} defaultValue={initialCamp} id="campSlug" name="campSlug" required>
          {camps.map((camp) => (
            <option key={camp.slug} value={camp.slug}>
              {camp.title[locale]} — {formatDateRange(camp.startDate, camp.endDate, locale)}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field error={errors.guests && te(errors.guests)} htmlFor="guests" label={t('guests')}>
          <input
            className={inputClass}
            defaultValue={1}
            id="guests"
            max={8}
            min={1}
            name="guests"
            type="number"
            required
          />
        </Field>
        <Field
          error={errors.roomPreference && te(errors.roomPreference)}
          htmlFor="roomPreference"
          label={t('roomPreference')}
        >
          <select className={inputClass} defaultValue="paylasimli" id="roomPreference" name="roomPreference">
            <option value="paylasimli">{t('roomShared')}</option>
            <option value="tek-kisilik">{t('roomSingle')}</option>
          </select>
        </Field>
      </div>

      <Field
        error={errors.message && te(errors.message)}
        hint={t('messageHint')}
        htmlFor="message"
        label={t('message')}
      >
        <textarea className={inputClass} id="message" maxLength={1000} name="message" rows={4} />
      </Field>

      <ConsentCheckbox error={errors.consent && te(errors.consent)} />

      {errors.form && (
        <p className="rounded-sm border border-coral bg-coral/10 p-4 text-sm text-ink" role="alert">
          {te(errors.form)}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button disabled={submitting} size="lg" type="submit">
          {submitting ? t('submitting') : t('submit')}
        </Button>
        {failedOnce && whatsappUrl && (
          <a
            className="text-sm font-semibold text-accent-deep hover:underline"
            href={whatsappUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('whatsappFallback')}
          </a>
        )}
      </div>
    </form>
  )
}
```

- [ ] **Step 4: Başvuru ve teşekkür sayfalarını yaz**

`basvuru/page.tsx` — `PageHero` + iki kolon: solda `InquiryForm` (`Suspense` ile sarılı, `useSearchParams` kullanıyor), sağda seçili kampın özet kartı ve "neden form" açıklaması. `getUpcomingCamps(today)` sonucu boşsa form yerine `t('noCamps')` metni ve iletişim bağlantısı gösterilir.

`basvuru-alindi/page.tsx` — `ref` sorgu parametresini okur ve gösterir:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

export default async function InquiryReceivedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ ref?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { ref } = await searchParams
  const t = await getTranslations('inquiryReceived')

  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="type-section-title">{t('title')}</h1>
        <p className="type-lede mt-5">{t('lede')}</p>
        {ref && (
          <p className="mt-8 inline-block rounded-sm bg-cream-2 px-6 py-4 text-sm">
            {t('reference')}{' '}
            <strong className="font-mono tracking-wider text-ink">{ref}</strong>
          </p>
        )}
        <div className="mt-10 flex justify-center gap-4">
          <Button href="/kamplar" variant="ghost">
            {t('otherCamps')}
          </Button>
        </div>
      </div>
    </Section>
  )
}
```

Bu sayfa `noindex` metadata alır (`robots: { index: false }`) — teşekkür sayfası aramada görünmemeli.

- [ ] **Step 5: Bülten formunu bağla**

`newsletter-cta.tsx`'i istemci bileşenine çevirin ve aynı `submitInquiry` yardımcısını `kind: 'newsletter'` ile kullanın. Başarı durumunda formu tebrik mesajıyla değiştirin (yönlendirme yok). Hata durumunda alan altında `form.errors` mesajını gösterin.

- [ ] **Step 6: Mesajları ekle**

`form` bölümü: `name`, `email`, `phone`, `camp`, `guests`, `roomPreference`, `roomShared`, `roomSingle`, `message`, `messageHint` ("Beslenme tercihiniz, sağlık notunuz veya sorunuz."), `consent` ("KVKK Aydınlatma Metni'ni okudum ve kişisel verilerimin işlenmesine onay veriyorum."), `submit` ("Talebimi Gönder"), `submitting` ("Gönderiliyor…"), `whatsappFallback` ("WhatsApp'tan yazın"), `whatsappFallbackMessage` ("Merhaba, kamp başvurusu yapmak istiyorum."), `noCamps`.
`inquiryReceived` bölümü: `title`, `lede`, `reference` ("Referans numaranız:"), `otherCamps`. İki dilde.

- [ ] **Step 7: Testleri çalıştır ve uçtan uca doğrula**

Run: `npm test`
Expected: PASS — tüm testler

Run: `npm run dev`

Doğrulanacaklar:
- `/tr/kamplar/pilates-mobilite-kasim-2026` → "Yer Ayır" → `/tr/basvuru?kamp=pilates-mobilite-kasim-2026`, kamp seçili
- `/tr/basvuru?kamp=uydurma-slug` → hata yok, ilk kamp seçili
- Boş formu göndermek → tarayıcı doğrulaması; `noValidate` olduğu için sunucu hataları alan altında Türkçe görünüyor
- Geçersiz e-posta ile gönderim → alan altında "Geçerli bir e-posta adresi girin", **girilen diğer alanlar korunuyor**
- Başarılı gönderim → `/tr/basvuru-alindi?ref=SR-…`, referans numarası görünüyor
- Sunucuyu kapatıp göndermek → "Form gönderilemedi" + WhatsApp bağlantısı görünüyor
- `/en/basvuru`'da hatalar İngilizce

- [ ] **Step 8: Commit**

```bash
git add src/lib/inquiry-client.ts src/components/inquiry src/components/home src/app messages
git commit -m "feat: add inquiry form with graceful error handling"
```

---

## Task 14: Kalan içerik sayfaları

**Files:**
- Create: `src/app/[locale]/(public)/deneyim/page.tsx`, `hakkimizda/page.tsx`, `sss/page.tsx`, `iletisim/page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`, `kvkk/page.tsx`, `gizlilik/page.tsx`
- Create: `src/components/contact-form.tsx`
- Create: `src/app/[locale]/(public)/not-found.tsx`
- Modify: `messages/tr.json`, `messages/en.json`

**Interfaces:**
- Consumes: Task 2 → `getFaq`, `getAllPosts`, `getPostBySlug`, `getAllCamps`; Task 5 → `Accordion`, `Section`; Task 6 → `PageHero`, `site`; Task 9 → `buildFaqJsonLd`; Task 13 → `submitInquiry`, `Field`, `ConsentCheckbox`
- Produces: Task 15'in `sitemap.ts`'i bu rotaların yollarını kullanır: `/deneyim`, `/hakkimizda`, `/sss`, `/iletisim`, `/blog`, `/kvkk`, `/gizlilik`.

- [ ] **Step 1: Deneyim ve hakkımızda sayfalarını yaz**

`deneyim/page.tsx` — `PageHero` + dört bölüm: "Bir gün nasıl geçer" (ilk öne çıkan kampın `dailyFlow`'unu `DailyFlow` bileşeniyle örnek olarak gösterir, üstünde "örnek bir gün" notu), beslenme yaklaşımı, ne getirmeli listesi, seviye beklentileri. Metinler `messages`'tan.

`hakkimizda/page.tsx` — `PageHero` + kuruluş hikayesi (iki paragraf), yaklaşım (üç madde), "neden Assos" bölümü, ekip yerine `TeachersPreview` benzeri kısa hoca şeridi ve `/iletisim`'e CTA.

- [ ] **Step 2: SSS sayfasını yaz**

```tsx
// src/app/[locale]/(public)/sss/page.tsx
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getFaq } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Accordion } from '@/components/ui/accordion'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { buildFaqJsonLd } from '@/lib/seo/jsonld'

export default async function FaqPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('faq')
  const items = getFaq()

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd({ items, locale })) }}
        type="application/ld+json"
      />
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />
      <Section size="sm">
        <div className="max-w-3xl">
          <Accordion
            items={items.map((item) => ({
              id: item.id,
              question: item.question[locale],
              answer: item.answer[locale],
            }))}
          />
        </div>
      </Section>
    </>
  )
}
```

- [ ] **Step 3: İletişim sayfasını ve formunu yaz**

`src/components/contact-form.tsx` — istemci bileşeni; `submitInquiry` ile `kind: 'contact'` gönderir. Alanlar: ad, e-posta, mesaj, KVKK onayı. Başarıda form yerine teşekkür mesajı ve referans numarası gösterilir (yönlendirme yok). `Field`, `inputClass` ve `ConsentCheckbox` Task 13'ten yeniden kullanılır.

`iletisim/page.tsx` — `PageHero` + iki kolon: solda `site.email`, `site.phone` (`tel:` bağlantısı), Instagram, WhatsApp bağlantısı (`buildWhatsAppUrl` null dönerse gizli) ve mekan konumu; sağda `ContactForm`.

- [ ] **Step 4: Blog sayfalarını yaz**

`blog/page.tsx` — `getAllPosts()` boş olduğunda boş durum:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllPosts } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'

export default async function BlogPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const posts = getAllPosts()

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} />
      <Section size="sm">
        {posts.length === 0 ? (
          <div className="max-w-xl">
            <p className="type-lede">{t('empty')}</p>
            <Button className="mt-6" href="/kamplar" variant="ghost">
              {t('emptyCta')}
            </Button>
          </div>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* PostCard ızgarası — kapak görseli, tarih, başlık, özet */}
          </ul>
        )}
      </Section>
    </>
  )
}
```

`blog/[slug]/page.tsx` — `generateStaticParams` boş dizi döndüğünde Next.js hiçbir sayfa üretmez; bilinmeyen slug `notFound()` verir. Markdown gövdesi tek bir yardımcıda izole edilir:

```tsx
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllPosts().map((post) => ({ locale, slug: post.slug })))
}
```

Gövde dönüştürücüsü v1'de içerik olmadığı için minimal tutulur: paragrafları `\n\n` ile bölüp `<p>` olarak basan `renderMarkdownBody(body: string)` yardımcısı. İlk gerçek yazı yazıldığında bu yardımcı gerçek bir Markdown kütüphanesiyle değiştirilir — o kararı şimdi vermeyin.

- [ ] **Step 5: Yasal sayfaları ve 404'ü yaz**

`kvkk/page.tsx` ve `gizlilik/page.tsx` — `PageHero` + `messages`'tan gelen metin. Her ikisinin başında görünür bir uyarı bloğu:

```tsx
<p className="rounded-sm border border-amber bg-amber/12 p-4 text-sm text-ink">
  {t('placeholderWarning')}
</p>
```

`placeholderWarning` metni: "Bu metin bir yer tutucudur ve hukuki geçerliliği yoktur. Yayına almadan önce hukuk danışmanınızın hazırladığı metinle değiştirilmelidir." Aynı uyarı İngilizce olarak `en.json`'da.

`not-found.tsx` — 404 sayfası: `type-section-title` başlık, kısa metin, `/` ve `/kamplar` butonları.

- [ ] **Step 6: Mesajları ekle ve doğrula**

`experience`, `about`, `faq`, `contact`, `blog`, `legal` (`kvkk`, `privacy`, `placeholderWarning`), `notFound` bölümlerini iki dilde ekleyin.

Run: `npm test`
Expected: PASS — mesaj eşitlik testi eksik çeviriyi yakalar

Run: `npm run dev`

Doğrulanacaklar:
- Navbar'daki yedi bağlantının tamamı çalışıyor, hiçbiri 404 değil
- `/tr/sss` akordeon JavaScript kapalıyken de açılıp kapanıyor (`<details>`)
- `/tr/blog` boş durum metni gösteriyor
- `/tr/kvkk` ve `/tr/gizlilik` yer tutucu uyarısını gösteriyor
- `/tr/olmayan-sayfa` → özel 404 sayfası (navbar ve footer ile)
- `/tr/iletisim` formu gönderiliyor ve teşekkür mesajı gösteriyor

- [ ] **Step 7: Commit**

```bash
git add src/app src/components messages
git commit -m "feat: add experience, about, faq, contact, blog and legal pages"
```

---

## Task 15: SEO — metadata, hreflang, sitemap ve robots

**Files:**
- Create: `src/lib/seo/metadata.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: `src/app/[locale]/layout.tsx` (kök metadata + Organization JSON-LD)
- Test: `src/lib/seo/sitemap-entries.test.ts`
- Create: `src/lib/seo/sitemap-entries.ts`

**Interfaces:**
- Consumes: Task 2 → `getAllCamps`, `getAllTeachers`, `getAllPosts`; Task 6 → `site`; Task 9 → `buildOrganizationJsonLd`
- Produces:
  ```ts
  const STATIC_PATHS: string[]                 // '', '/kamplar', '/hocalar', …
  buildSitemapEntries(siteUrl: string): { url: string; alternates: { languages: Record<string,string> } }[]
  buildAlternates(path: string): { canonical: string; languages: Record<string, string> }
  ```

- [ ] **Step 1: Sitemap testini yaz (başarısız olacak)**

`src/lib/seo/sitemap-entries.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getAllCamps, getAllTeachers } from '@/content'
import { buildSitemapEntries, STATIC_PATHS } from './sitemap-entries'

const SITE = 'https://serenityretreats.com'
const entries = buildSitemapEntries(SITE)
const urls = entries.map((e) => e.url)

describe('buildSitemapEntries', () => {
  it('her statik yolu iki dilde içerir', () => {
    for (const path of STATIC_PATHS) {
      expect(urls, `tr${path}`).toContain(`${SITE}/tr${path}`)
      expect(urls, `en${path}`).toContain(`${SITE}/en${path}`)
    }
  })

  it('her kampı iki dilde içerir', () => {
    for (const camp of getAllCamps()) {
      expect(urls).toContain(`${SITE}/tr/kamplar/${camp.slug}`)
      expect(urls).toContain(`${SITE}/en/kamplar/${camp.slug}`)
    }
  })

  it('her hocayı iki dilde içerir', () => {
    for (const teacher of getAllTeachers()) {
      expect(urls).toContain(`${SITE}/tr/hocalar/${teacher.slug}`)
      expect(urls).toContain(`${SITE}/en/hocalar/${teacher.slug}`)
    }
  })

  it('beklenen toplam kayıt sayısını üretir', () => {
    const dynamicCount = getAllCamps().length + getAllTeachers().length
    expect(entries).toHaveLength((STATIC_PATHS.length + dynamicCount) * 2)
  })

  it('yinelenen URL içermez', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('her kayıt iki dil için hreflang alternatifi taşır', () => {
    for (const entry of entries) {
      expect(Object.keys(entry.alternates.languages).sort()).toEqual(['en', 'tr'])
    }
  })

  it('teşekkür ve başvuru sayfalarını dışlar', () => {
    expect(urls.some((u) => u.includes('/basvuru-alindi'))).toBe(false)
  })

  it('sonunda eğik çizgi olan siteUrl değerinde çift eğik çizgi üretmez', () => {
    for (const url of buildSitemapEntries(`${SITE}/`).map((e) => e.url)) {
      expect(url.replace(`${SITE}/`, '')).not.toMatch(/^\//)
    }
  })
})
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör**

Run: `npm test -- src/lib/seo/sitemap-entries.test.ts`
Expected: FAIL — `Failed to resolve import "./sitemap-entries"`

- [ ] **Step 3: Sitemap kaynağını yaz**

`src/lib/seo/sitemap-entries.ts`:

```ts
import { getAllCamps, getAllPosts, getAllTeachers } from '@/content'
import { routing } from '@/i18n/routing'

/** Dizine girmesi istenen statik yollar. /basvuru-alindi bilinçli olarak yok. */
export const STATIC_PATHS = [
  '',
  '/kamplar',
  '/hocalar',
  '/mekan',
  '/deneyim',
  '/hakkimizda',
  '/sss',
  '/iletisim',
  '/blog',
  '/basvuru',
  '/kvkk',
  '/gizlilik',
] as const

export type SitemapEntry = {
  url: string
  alternates: { languages: Record<string, string> }
}

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

export function buildSitemapEntries(siteUrl: string): SitemapEntry[] {
  const base = trimSlash(siteUrl)

  const paths = [
    ...STATIC_PATHS,
    ...getAllCamps().map((camp) => `/kamplar/${camp.slug}`),
    ...getAllTeachers().map((teacher) => `/hocalar/${teacher.slug}`),
    ...getAllPosts().map((post) => `/blog/${post.slug}`),
  ]

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${path}`])),
      },
    })),
  )
}
```

- [ ] **Step 4: Testleri çalıştır ve geçtiğini gör**

Run: `npm test -- src/lib/seo/sitemap-entries.test.ts`
Expected: PASS — 8 test

- [ ] **Step 5: sitemap.ts, robots.ts ve metadata yardımcısını yaz**

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { site } from '@/lib/config/site'
import { buildSitemapEntries } from '@/lib/seo/sitemap-entries'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(site.url).map((entry) => ({
    url: entry.url,
    alternates: entry.alternates,
    changeFrequency: 'weekly',
    priority: entry.url.endsWith('/tr') || entry.url.endsWith('/en') ? 1 : 0.7,
  }))
}
```

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next'
import { site } from '@/lib/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/basvuru-alindi'] }],
    sitemap: `${site.url.replace(/\/+$/, '')}/sitemap.xml`,
  }
}
```

`src/lib/seo/metadata.ts`:

```ts
import { routing, type AppLocale } from '@/i18n/routing'

/** Her sayfa bu yardımcıyı kullanır; hreflang ve canonical tek yerde tanımlı kalır. */
export function buildAlternates(path: string) {
  return {
    canonical: path,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${stripLocale(path)}`])),
      'x-default': `/${routing.defaultLocale}${stripLocale(path)}`,
    },
  }
}

function stripLocale(path: string): string {
  const match = path.match(/^\/(tr|en)(\/.*)?$/)
  return match ? (match[2] ?? '') : path
}

export function localeToHtmlLang(locale: AppLocale): string {
  return locale === 'tr' ? 'tr-TR' : 'en-GB'
}
```

- [ ] **Step 6: Kök metadata ve Organization JSON-LD'yi bağla**

`src/app/[locale]/layout.tsx`'e ekleyin — `metadataBase` göreli canonical değerlerinin çözülmesi için zorunludur:

```tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    metadataBase: new URL(site.url),
    title: { default: t('defaultTitle'), template: `%s — ${site.name}` },
    description: t('defaultDescription'),
    alternates: buildAlternates(`/${locale}`),
    openGraph: {
      siteName: site.name,
      locale: localeToHtmlLang(locale as AppLocale),
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}
```

`<html lang>` değeri kök layout'ta sabit olamaz — `[locale]/layout.tsx` içinde `<html>` etiketi bulunmadığı için `lang`'i kök layout'a taşımak yerine kök layout'ta `params` okunamaz. Çözüm: kök `layout.tsx`'i `src/app/[locale]/layout.tsx` ile birleştirin — `<html lang={locale}>` orada üretilir, `src/app/layout.tsx` yalnızca `children`'ı geçirir. Next.js 16'da bu düzenin doğru biçimini `node_modules/next/dist/docs/` içindeki i18n bölümünden doğrulayın.

`Organization` JSON-LD `[locale]/layout.tsx` içinde bir `<script type="application/ld+json">` olarak eklenir.

- [ ] **Step 7: Sayfa metadata'larını tamamla**

Task 9 ve 10'da yazılan `generateMetadata` fonksiyonlarındaki elle kurulmuş `languages` nesnelerini `buildAlternates` çağrısıyla değiştirin. `/deneyim`, `/hakkimizda`, `/sss`, `/iletisim`, `/mekan`, `/kamplar`, `/hocalar`, `/blog`, `/basvuru`, `/kvkk`, `/gizlilik` sayfalarına `generateMetadata` ekleyin. `/basvuru-alindi` sayfasına `robots: { index: false, follow: false }` verin.

`meta` mesaj bölümü: `defaultTitle`, `defaultDescription` ve sayfa başına `<sayfa>.title` / `<sayfa>.description` anahtarları — iki dilde.

- [ ] **Step 8: Testleri çalıştır ve build ile doğrula**

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: Build başarılı; çıktıda `/sitemap.xml` ve `/robots.txt` rotaları listeleniyor

Run: `npm start`, ardından:

```bash
curl -s http://localhost:3000/sitemap.xml | head -30
curl -s http://localhost:3000/robots.txt
```

Doğrulanacaklar:
- Sitemap'te her URL için `xhtml:link rel="alternate"` girdileri var
- `robots.txt` `/api/` ve `/basvuru-alindi` yollarını yasaklıyor ve sitemap'e işaret ediyor
- `/tr/kamplar/yoga-nefes-ekim-2026` kaynağında `<link rel="alternate" hreflang="en" …>` ve `hreflang="x-default"` var
- `<html lang="tr">` (ve `/en` için `lang="en"`)

- [ ] **Step 9: Commit**

```bash
git add src/lib/seo src/app messages
git commit -m "feat: add sitemap, robots and hreflang metadata"
```

---

## Task 16: Erişilebilirlik geçişi ve yayın öncesi doğrulama

**Files:**
- Modify: `src/app/globals.css` (skip link)
- Modify: `src/app/[locale]/(public)/layout.tsx` (skip link)
- Create: `README.md`
- Create: `src/content/content-readiness.test.ts`

**Interfaces:**
- Consumes: tüm önceki görevler
- Produces: `README.md` — kurulum, env değişkenleri, içerik güncelleme rehberi ve **yayın öncesi kontrol listesi**.

- [ ] **Step 1: Yayına hazırlık testini yaz (başarısız olacak)**

Bu test yer tutucu içerikle canlıya çıkmayı zorlaştırır. Varsayılan olarak *atlanır*; yayın öncesi `CHECK_LAUNCH_READY=1` ile çalıştırılır.

`src/content/content-readiness.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getTestimonials } from './index'
import { site } from '@/lib/config/site'

const shouldRun = process.env.CHECK_LAUNCH_READY === '1'

describe.skipIf(!shouldRun)('yayın öncesi hazırlık', () => {
  it('örnek yorum kalmamıştır', () => {
    const placeholders = getTestimonials().filter((t) => t.isPlaceholder)
    expect(
      placeholders.map((t) => t.id),
      'Örnek yorumlar hâlâ yerinde — gerçek yorumlarla değiştirin veya bölümü kaldırın',
    ).toEqual([])
  })

  it('iletişim bilgileri yer tutucu değildir', () => {
    expect(site.phone, 'site.phone güncellenmedi').not.toContain('000 000')
    expect(site.email, 'site.email güncellenmedi').not.toBe('merhaba@serenityretreats.com')
  })

  it('site URL değeri localhost değildir', () => {
    expect(site.url).not.toContain('localhost')
  })
})
```

- [ ] **Step 2: Testin doğru davrandığını doğrula**

Run: `npm test -- src/content/content-readiness.test.ts`
Expected: PASS (atlanmış — `3 skipped`)

Run: `CHECK_LAUNCH_READY=1 npm test -- src/content/content-readiness.test.ts`
Expected: FAIL — üç testin tamamı, yer tutucu içerik hâlâ yerinde olduğu için. Bu **beklenen** durumdur; test yayın öncesi bir kontrol listesidir.

- [ ] **Step 3: Skip link ekle**

`globals.css`'e:

```css
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 100;
  padding: 12px 20px;
  background: var(--color-ink);
  color: var(--color-cream);
  border-radius: var(--radius-sm);
}
.skip-link:focus {
  left: 16px;
  top: 16px;
}
```

`(public)/layout.tsx`'te `<Navbar />`'dan önce:

```tsx
<a className="skip-link" href="#main">{t('skipToContent')}</a>
```

`common.skipToContent` mesajını iki dilde ekleyin ("İçeriğe geç" / "Skip to content").

- [ ] **Step 4: Erişilebilirlik geçişi yap**

Her sayfada tek tek doğrulayın:

- Sayfa başına **tek** `h1` var; başlık seviyeleri atlanmıyor (`h1 → h2 → h3`)
- Tüm `<img>`/`next/image` çağrılarında anlamlı `alt` var; dekoratif görsellerde `alt=""`
- Tüm `<iframe>`'lerde `title` var
- Tüm form alanlarının `<label>`'ı var, hatalar `aria-describedby` ile bağlı, `role="alert"` taşıyor
- Dekoratif ikonlarda `aria-hidden` var
- Yalnızca klavyeyle: skip link → navbar → tüm bağlantılar → form → footer sırası mantıklı; hiçbir öğe atlanmıyor
- Mobil menüde odak tuzağı çalışıyor, Escape kapatıyor
- İşletim sisteminde "hareketi azalt" açıkken kaydırma ve geçişler duruyor
- Tarayıcıda 200% yakınlaştırmada yatay kaydırma **yok**
- Chrome DevTools → Lighthouse → Accessibility: `/tr`, `/tr/kamplar/yoga-nefes-ekim-2026` ve `/tr/basvuru` sayfalarında 100

Bulunan sorunları düzeltin.

- [ ] **Step 5: README yaz**

`README.md` içeriği:
- Kurulum: `npm install`, `cp .env.example .env.local`, `npm run dev`
- Betikler: `dev`, `build`, `start`, `test`, `lint`
- Ortam değişkenleri tablosu: her değişken, zorunlu mu, eksikse ne olur
- **İçerik nasıl güncellenir:** yeni kamp dönemi eklemek (`src/content/camps.ts`), yeni hoca (`teachers.ts`), yeni otel (`venues.ts` — birden fazla mekan desteklenir), görsellerin nereye konacağı
- **Tasarım kuralları:** `--color-accent` metin rengi değildir; gövde metni `#6f6f6f`; kontrast koruma testi bunu uygular
- **Yayın öncesi kontrol listesi:**
  1. `src/lib/config/site.ts` içindeki telefon, e-posta, Instagram güncellendi
  2. `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `INQUIRY_TO_EMAIL`, `RESEND_API_KEY` tanımlandı
  3. `src/content/testimonials.ts` gerçek yorumlarla değiştirildi veya bölüm kaldırıldı
  4. `messages/*.json` içindeki KVKK ve gizlilik metinleri hukuk danışmanının metniyle değiştirildi
  5. Gerçek kamp tarihleri, fiyatları ve kontenjanları girildi
  6. Gerçek hoca fotoğrafları ve biyografileri girildi
  7. `CHECK_LAUNCH_READY=1 npm test` geçiyor
  8. `npm run build` uyarısız tamamlanıyor

- [ ] **Step 6: Tam doğrulama çalıştır**

```bash
npm run lint
npm test
npm run build
```

Expected: Üçü de hatasız. `npm test` çıktısında `content-readiness` testleri `skipped` olarak görünür — bu doğrudur.

Üç komuttan biri başarısız olursa **düzeltin**; "sonra bakılacak" bırakmayın.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add skip link, accessibility pass, launch readiness checks and README"
```

---

## Yayın öncesi bilinen yer tutucular

Bu liste spec §3 ile eşleşir ve Task 16'daki kontrol listesiyle uygulanır. Site bu maddeler tamamlanmadan yayına **alınmamalıdır**:

| Yer tutucu | Dosya | Neden önemli |
|---|---|---|
| Telefon, e-posta, Instagram | `src/lib/config/site.ts` | Sahte iletişim bilgisi güven kaybettirir |
| WhatsApp numarası | `.env.local` | Tanımsızken buton hiç görünmez |
| Örnek yorumlar | `src/content/testimonials.ts` | Gerçek olmayan yorum yanıltıcıdır |
| KVKK ve gizlilik metni | `messages/tr.json`, `en.json` | Hukuki yükümlülük |
| Kamp tarih, fiyat, kontenjan | `src/content/camps.ts` | Yanlış fiyat ticari risk |
| Hoca biyografi ve fotoğrafları | `src/content/teachers.ts` | Gerçek kişilere ait olmalı |
| Kamp ve hoca görselleri | `public/img/camps/`, `public/img/teachers/` | Kırık görseller |

---

## Self-Review

Plan yazıldıktan sonra spec'e karşı yapılan denetim:

**1. Spec kapsamı** — spec bölümleri ve karşılık gelen görevler:

| Spec | Görev |
|---|---|
| §4 Teknoloji ve dizin yapısı | Task 1 |
| §5.1 Renk token'ları | Task 1 |
| §5.2 Kontrast kuralları | Task 1 (token'lar) + Task 5 (makine denetimi) |
| §5.3 Tipografi | Task 1 |
| §5.4 Boşluk, radius, gölge | Task 1 |
| §5.5 Yasaklar | Global Constraints |
| §6.1 Yerelleştirme kuralı | Task 1 (test) + Global Constraints |
| §6.2 Tipler | Task 2 |
| §6.3 Erişim yardımcıları | Task 2 |
| §6.4 Yer tutucu veri hacmi | Task 2 |
| §7.1 Ana sayfa | Task 7 |
| §7.2 Kamplar listesi | Task 8 |
| §7.3 Kamp detay | Task 9 |
| §7.4 Hocalar | Task 10 |
| §7.5 Mekan | Task 10 |
| §7.6 Deneyim | Task 14 |
| §7.7 Diğer sayfalar | Task 14 |
| §8 Bileşen yapısı | Task 5, 6, 7, 9, 10, 13 |
| §9.1 Başvuru akışı | Task 13 |
| §9.2 Form alanları | Task 11 (şema) + Task 13 (arayüz) |
| §9.3 API sözleşmesi | Task 12 |
| §9.4 Hata yönetimi (arayüz) | Task 13 |
| §10 SEO ve erişilebilirlik | Task 15 (SEO) + Task 16 (erişilebilirlik) |
| §11 Test stratejisi | Task 2, 3, 4, 11, 15 |
| §12 Dağıtım | Task 1 (`.env.example`) + Task 16 (README) |

Kapsam boşluğu bulunmadı. Spec §11'in beş test maddesinin tamamı karşılandı: içerik bütünlüğü (Task 2), tarih yardımcıları (Task 3), içerik seçicileri (Task 2), form doğrulama üç `kind` için (Task 11), `referenceId` biçimi (Task 11).

**2. Yer tutucu taraması** — planda "TBD", "sonra bakılır" veya kodsuz kod adımı yok. Task 14'teki Markdown dönüştürücü kararı bilinçli olarak ertelendi ve bu açıkça yazıldı (v1'de blog içeriği olmadığı için karar verecek bilgi yok). Yer tutucu **içerik** (yorumlar, iletişim bilgileri) plan eksikliği değil, spec kararıdır ve Task 16'daki test ile uygulanır.

**3. Tip tutarlılığı** — çapraz kontrol edilen adlar:
- `CampSession`, `Teacher`, `Venue`, `FaqItem`, `Testimonial`, `BlogPost` — Task 2'de tanımlandı, sonraki tüm görevlerde aynı adla kullanıldı
- `getUpcomingCamps(today, limit?)` — Task 2'de tanımlandı; Task 7 ve 8'de aynı imzayla çağrıldı
- `getCampBadge` → `CampBadge` (`'open' | 'last-spots' | 'waitlist' | 'closed'`) — Task 4'te tanımlandı; Task 7'nin `BADGE_TONE` eşlemesi dört değerin tamamını kapsıyor
- `formatDateRange(start, end, locale)` — Task 3'te tanımlandı; Task 7, 9, 12, 13'te aynı sırayla çağrıldı
- `inquirySchema`, `flattenZodErrors`, `InquiryInput`, `CampInquiry` — Task 11'de tanımlandı; Task 12 ve 13'te aynı adla kullanıldı
- `generateReferenceId(now: Date)` — Task 11'de tanımlandı; Task 12'de `new Date()` ile çağrıldı
- `buildWhatsAppUrl(message?)` → `string | null` — Task 6'da tanımlandı; Task 9 ve 13'te null kontrolüyle kullanıldı
- `submitInquiry(input)` → `SubmitResult` — Task 13'te tanımlandı; bülten ve iletişim formları aynı yardımcıyı kullanıyor
- `buildAlternates(path)` — Task 15'te tanımlandı; Task 9 ve 10'daki elle kurulmuş `languages` nesneleri Task 15 Step 7'de bununla değiştiriliyor (bilinçli sıralama, çakışma değil)
- `Field`, `inputClass`, `ConsentCheckbox` — Task 13'te tanımlandı; Task 14'ün `contact-form` bileşeni yeniden kullanıyor

