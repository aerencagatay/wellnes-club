# Serenity Retreats — Tasarım Belgesi

**Tarih:** 2026-07-31
**Durum:** Onaylandı (kullanıcı onayı 2026-07-31)
**Referans site:** https://www.ourretreat.co.uk/

## 1. Amaç ve kapsam

Serenity Retreats, otellerle anlaşarak gruplar halinde yoga ve pilates kampları
düzenleyen bir organizasyon girişimidir. Bu belge, girişimin tanıtım ve talep
toplama sitesinin tasarımını tanımlar.

Site iki işi yapar:

1. Kamp dönemlerini (program × tarih) tanıtır ve güven inşa eder.
2. Katılım talebi toplar — form ve WhatsApp üzerinden. **Online ödeme yoktur.**

### Kapsam dışı (v1)

- Online ödeme, kapora tahsilatı, sanal POS entegrasyonu
- Kontenjan/envanter yönetimi, takvim tabanlı müsaitlik sorgusu
- Admin paneli — kamp ve hoca verisi kod içinde tipli dosyalarda tutulur
- Otel oda tipi, oda fiyatı ve oda müsaitliği (bunlar otelin kendi sitesinde kalır)
- Blog yazısı içeriği — sayfa altyapısı kurulur, içerik sonra yazılır

## 2. Alınan kararlar

| Karar | Seçim |
|---|---|
| Teknoloji | Next.js + Tailwind, içerik tipli TS dosyalarında |
| Rezervasyon | Talep formu + WhatsApp |
| Dil | Türkçe + İngilizce (next-intl) |
| Sayfa kapsamı | Tam site (blog altyapısı dahil, blog içeriği hariç) |
| Marka adı | Serenity Retreats |
| Konumlandırma | Lüks / premium — referans sitenin sakin tonu |
| Renk paleti | ourretreat paleti birebir (iki teknik uyarlamayla, bkz. §5) |
| Kamp modeli | Program × Tarih — her dönem kendi sayfası |
| Otel bilgisi | Minimal mekan tanıtımı; oda detayı otelin sitesine link |
| İçerik | Yer tutucu (gerçekçi örnek veri), sonra gerçek veriyle değiştirilir |

## 3. Kanonik iş bilgileri (tek doğruluk kaynağı)

Bu bölüm iş bilgilerinin kanonik kaynağıdır. Bir sayfa içeriği veya bileşen bu
bölümle çelişirse, bu bölüm kazanır. Bilgi değişikliklerini yalnızca burada
güncelleyin.

- **Marka adı:** Serenity Retreats
- **İş modeli:** Anlaşmalı otellerde grup halinde yoga/pilates kampı organizasyonu
- **v1 mekanı:** Assos Karadut Taş Otel — Büyükhusun Köyü Namazgah Mevkii No:26,
  Ayvacık, Çanakkale 17860
- **Mekan notu:** Assos antik kentine ~7 dk, Kadırga Koyu'na ~5 km, taş mimari,
  havuz ve restoran mevcut
- **Otelin kendi sitesi:** https://www.karaduttasotel.com/
- **İlgili repo:** https://github.com/aerencagatay/otel-web-app.git (otelin sitesi;
  bu proje ondan bağımsız ama aynı konvansiyonları izler)
- **Rezervasyon modeli:** Talep formu + WhatsApp. Online ödeme YOK.

> **Yer tutucu alanlar** — yayına almadan önce doldurulmalı: Serenity Retreats
> telefon numarası, e-posta adresi, WhatsApp numarası, domain, KVKK/gizlilik metni,
> gerçek kamp tarihleri ve fiyatları, gerçek hoca biyografileri ve fotoğrafları,
> gerçek katılımcı yorumları.

## 4. Teknoloji ve dizin yapısı

Otel repo'sundan **ayrı, yeni bir Next.js uygulaması**. Gerekçe: ayrı tüzel iş,
ayrı domain, ayrı marka. Ancak konvansiyonlar birebir aynı tutulur ki geliştirici
zihinsel modeli taşınsın.

Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 (`@tailwindcss/postcss`)
· next-intl 4 · zod · lucide-react · Resend · vitest.

> Next.js 16 eğitim verisinden farklıdır. Kod yazmadan önce ilgili kılavuz
> `node_modules/next/dist/docs/` altından okunur.

```
src/
  app/
    layout.tsx                       kök layout, font tanımları
    globals.css                      tasarım token'ları
    robots.ts  sitemap.ts
    api/inquiry/route.ts             talep formu POST ucu
    [locale]/
      layout.tsx                     next-intl sağlayıcısı
      (public)/
        layout.tsx                   navbar + footer + WhatsApp FAB
        page.tsx                     Ana sayfa
        kamplar/page.tsx             Kamp dönemleri listesi
        kamplar/[slug]/page.tsx      Kamp detay
        hocalar/page.tsx             Hocalarımız
        hocalar/[slug]/page.tsx      Hoca profili
        mekan/page.tsx               Mekan (kısa)
        deneyim/page.tsx             Bir gün nasıl geçer
        hakkimizda/page.tsx          Hikayemiz
        sss/page.tsx                 SSS
        iletisim/page.tsx            İletişim
        blog/page.tsx                Blog listesi (içerik yok, boş durum)
        blog/[slug]/page.tsx         Blog yazısı
        basvuru/page.tsx             Talep formu
        basvuru-alindi/page.tsx      Teşekkür
        kvkk/page.tsx  gizlilik/page.tsx
  content/                           İÇERİK KATMANI (§6)
    types.ts  camps.ts  teachers.ts  venues.ts  faq.ts  testimonials.ts
    posts.ts  index.ts
  components/                        (§8)
  lib/
    config/site.ts                   marka adı, iletişim, sosyal medya
    config/whatsapp.ts               numara + önyazılı mesaj kurucu
    mail/                            Resend istemcisi + e-posta şablonları
    security/rate-limit.ts  security/turnstile.ts
    utils/dates.ts                   tarih aralığı biçimleme (TR/EN)
    utils/validation.ts              zod şemaları
    seo/jsonld.ts                    Event / Organization şemaları
  i18n/                              next-intl yapılandırması
messages/  tr.json  en.json
public/img/                          görseller
```

**Yönlendirme (routing):** Tek segment seti (Türkçe). `/en` aynı yolları kullanır
(`/en/kamplar`). next-intl `pathnames` çeviri katmanı **eklenmez** — otel
repo'sundaki desenle tutarlı ve v1 için gereksiz karmaşıklık.

**Varsayılan dil:** `tr`. Dil öneki her zaman görünür (`/tr/...`, `/en/...`) ki
hreflang ve canonical ilişkileri tek biçimli kalsın.

## 5. Görsel dil

### 5.1 Renk token'ları

`src/app/globals.css` içinde `@theme inline` bloğunda tanımlanır:

```css
@theme inline {
  /* Zeminler — sıcak krem ailesi */
  --color-cream:        #faf6f2;
  --color-cream-2:      #f0ece9;
  --color-cream-3:      #ebe7e4;

  /* Metin ve koyu yüzeyler — derin erik-siyah */
  --color-ink:          #221c25;
  --color-ink-2:        #1a151c;
  --color-ink-3:        #423c45;

  /* Gövde metni — sıcak gri (AA düzeltmesi, bkz. §5.2) */
  --color-body:         #6f6f6f;  /* gövde metni — 4.67:1 ✓ */
  --color-body-muted:   #7a7a7a;  /* referansın rengi — yalnızca büyük metin */
  --color-body-light:   #a4a4a4;  /* dekoratif / devre dışı öğe */
  --color-border:       #e5e5e5;

  /* Vurgu — turkuaz */
  --color-accent:       #3cc4b2;  /* dolgu, çerçeve, ikon, ayırıcı */
  --color-accent-hover: #2fa697;  /* dolgu hover */
  --color-accent-deep:  #1d6b61;  /* SADECE metin ve link */

  /* İkincil vurgular — rozet ve durum göstergeleri */
  --color-coral:        #f56c6d;  /* "son yerler" uyarısı */
  --color-olive:        #5e844b;  /* "kayıtlar açık" */
  --color-amber:        #e9aa35;  /* "erken kayıt" */

  --font-heading: var(--font-pt-serif), serif;
  --font-body:    var(--font-mulish), system-ui, sans-serif;
}
```

### 5.2 Kontrast kuralları (bağlayıcı)

Palet referanstan birebir alındı, ancak turkuazın erişilebilirlik davranışı
açıkça kurallanmalı. Ölçülen değerler:

Palet referanstan birebir alındı; ancak iki rengin *kullanım kuralı* açıkça
tanımlanmalı. Ölçülen değerler (WCAG 2.1 bağıl parlaklık formülü):

| Kombinasyon | Oran | Karar |
|---|---|---|
| `#faf6f2` üzerine `#221c25` başlık | 15.5:1 | ✓ Başlık ve koyu metin |
| `#faf6f2` üzerine `#6f6f6f` gövde | 4.67:1 | ✓ **Gövde metni** |
| `#faf6f2` üzerine `#7a7a7a` (referansın rengi) | 3.99:1 | ✗ Normal metinde **yasak** |
| `#faf6f2` üzerine `#a4a4a4` | 2.32:1 | Yalnızca dekoratif / devre dışı öğe |
| `#3cc4b2` üzerine beyaz metin | 2.16:1 | ✗ **Yasak** |
| `#3cc4b2` üzerine `#221c25` metin | 7.72:1 | ✓ Turkuaz butonun standart metin rengi |
| `#faf6f2` üzerine `#3cc4b2` metin | 2.01:1 | ✗ **Yasak** |
| `#faf6f2` üzerine `#1d6b61` metin | 5.87:1 | ✓ Turkuaz *metin* gerektiğinde bu kullanılır |

**İki bağlayıcı kural:**

1. **`--color-accent` (#3cc4b2) asla metin rengi değildir.** Metin için
   `--color-accent-deep`, dolgu/çerçeve/ikon/ayırıcı için `--color-accent`
   kullanılır. Turkuaz zemin üzerindeki metin daima `--color-ink` olur.
2. **Gövde metni `#6f6f6f`'tir, `#7a7a7a` değil.** Referans sitenin gövde rengi
   `#7a7a7a` krem zemin üzerinde 3.99:1 veriyor ve AA'nın 4.5:1 eşiğini geçmiyor
   (beyaz üzerinde de 4.29:1 ile geçmiyor). `#6f6f6f` görsel olarak neredeyse
   ayırt edilemeyecek kadar yakın ama 4.67:1 ile uyumlu. Referansın orijinal
   tonu `--color-body-muted` olarak korunur ve yalnızca büyük metinde
   (≥24px veya ≥18.66px bold — AA eşiği 3:1) kullanılabilir.

### 5.3 Tipografi

Referans site **Proxima Nova** (ticari lisans, dağıtım hakkı gerekir) ve
**PT Serif** kullanıyor. Kararı:

- **Başlıklar:** PT Serif — referansın serif'i, Google Fonts'ta mevcut
- **Gövde:** Mulish — Proxima Nova'ya en yakın ücretsiz humanist sans

`next/font/google` ile yüklenir, `display: 'swap'`, yalnızca `latin` + `latin-ext`
alt kümeleri (Türkçe karakterler için `latin-ext` zorunlu).

Ölçek — akışkan (fluid), `clamp()` ile:

```css
.type-display       { clamp(2.5rem, 6vw, 4.5rem);  line-height: 1.06; letter-spacing: -0.02em }
.type-section-title { clamp(1.75rem, 3.2vw, 2.65rem); line-height: 1.15 }
.type-lede          { clamp(1rem, 1.35vw, 1.125rem); line-height: 1.75; color: var(--color-body) }
.eyebrow            { 10px; letter-spacing: 0.35em; uppercase; color: var(--color-accent-deep) }
```

### 5.4 Boşluk, radius, gölge

- Bölüm ritmi: `.section-py { padding: clamp(72px, 12vw, 112px) 0 }`
- Radius: kart `16px`, input `10px`, buton/chip `999px` (hap formu)
- Gölge: çok yumuşak, iki katmanlı — `0 1px 2px rgba(34,28,37,.05), 0 8px 28px rgba(34,28,37,.07)`
- Tam genişlikte bölüm zeminleri köşesiz kalır; yalnızca yüzen kart/panel radius alır

### 5.5 Yasaklar

Glassmorphism ve yoğun `backdrop-blur`; neon/parlak gradient; SaaS dashboard
estetiği (çok sütunlu metrik kartları); steril beyaz minimalizm; çok büyük bold
sans-serif başlıklar. Hedef his: sakin lüks, editoryal, bol beyaz alan.

## 6. İçerik katmanı

### 6.1 Yerelleştirme kuralı

- **Arayüz metinleri** (buton etiketleri, form etiketleri, navigasyon) →
  `messages/tr.json` · `messages/en.json`, next-intl ile
- **İçerik metinleri** (kamp açıklaması, hoca biyografisi) → içerik dosyasında
  `{ tr, en }` alanları

Gerekçe: bir kampın tüm verisi tek yerde durur; kamp eklemek tek dosyaya kayıt
eklemektir, iki çeviri dosyasında koordinasyon gerektirmez.

### 6.2 Tipler

```ts
// src/content/types.ts
export type Locale = 'tr' | 'en'
export type Localized = Record<Locale, string>
export type LocalizedList = Record<Locale, string[]>

export type Program = 'yoga' | 'pilates' | 'yoga-pilates'
export type Level = 'baslangic' | 'tum-seviyeler' | 'ileri'
export type CampStatus = 'open' | 'waitlist' | 'closed'

export type CampSession = {
  slug: string                 // 'yoga-nefes-ekim-2026'
  program: Program
  title: Localized
  summary: Localized
  startDate: string            // 'YYYY-MM-DD'
  endDate: string              // 'YYYY-MM-DD'
  nights: number
  venueSlug: string
  teacherSlugs: string[]
  capacity: number
  spotsLeft: number
  priceFrom: number            // kişi başı, paylaşımlı oda
  currency: 'TRY'
  level: Level
  status: CampStatus
  heroImage: string
  gallery: string[]
  includes: LocalizedList
  excludes: LocalizedList
  dailyFlow: Array<{ time: string; title: Localized; desc: Localized }>
  featured: boolean
}

export type Teacher = {
  slug: string
  name: string
  title: Localized             // 'Yoga & Nefes Eğitmeni'
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
  location: Localized          // 'Büyükhusun, Ayvacık / Çanakkale'
  highlights: LocalizedList    // 'Assos antik kentine 7 dk' vb.
  gallery: string[]
  mapEmbedUrl: string
  websiteUrl: string
  coordinates: { lat: number; lng: number }
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
  body: Localized              // Markdown metin
  publishedAt: string          // 'YYYY-MM-DD'
  coverImage: string
  tags: string[]
}
```

`posts.ts` v1'de **boş dizi** döner — blog altyapısı kurulu, içerik sonra yazılır.
Markdown gövdesi sayfada bir dönüştürücüden geçirilir; v1'de içerik olmadığı için
dönüştürücü tercihi uygulama anında verilir ve tek bir yardımcıda izole edilir.

**Enum değerleri anahtardır, etiket değildir.** `program`, `level` ve `status`
değerleri (`'yoga'`, `'tum-seviyeler'`, `'waitlist'` …) yalnızca anahtar olarak
kullanılır; kullanıcıya görünen etiketler `messages/tr.json` ve `messages/en.json`
içinde tutulur. Bu değerler içerik dosyalarında asla insan okunabilir metin
taşımaz.

`venues` bir dizidir. İkinci otelle anlaşıldığında yalnızca veri eklenir; hiçbir
bileşen değişmez.

### 6.3 Erişim yardımcıları

`src/content/index.ts` şu fonksiyonları dışa açar. Bileşenler içerik dizilerine
doğrudan erişmez, yalnızca bu fonksiyonları kullanır:

```ts
getAllCamps(): CampSession[]                  // startDate'e göre artan
getUpcomingCamps(today: string, n?: number)   // endDate >= today, artan
getPastCamps(today: string): CampSession[]    // endDate < today, azalan
getCampBySlug(slug): CampSession | undefined
getFeaturedCamps(): CampSession[]
getTeachersForCamp(camp): Teacher[]
getVenueForCamp(camp): Venue
getTeacherBySlug(slug) / getVenueBySlug(slug)
```

"Bugün" değeri parametre olarak geçirilir, fonksiyon içinde `Date.now()`
çağrılmaz — böylece test edilebilir kalır.

### 6.4 Yer tutucu veri hacmi

3 kamp dönemi (biri `waitlist` durumunda ki tüm durumlar görsel olarak
doğrulanabilsin), 3 hoca, 1 mekan, 8 SSS, 3 örnek yorum
(`isPlaceholder: true`).

## 7. Sayfa tasarımları

### 7.1 Ana sayfa

Referans sitenin akışını izler:

1. **Hero** — tam ekran görsel, eyebrow "ASSOS · ÇANAKKALE", H1, alt metin,
   birincil CTA "2026 Tarihlerini Gör" + ikincil "Bize Ulaşın"
2. **Güven şeridi** — doğrulanabilir bilgi: "Assos antik kentine 7 dk ·
   Kadırga Koyu'na 5 km · Max 16 kişilik gruplar · Taş mimari butik otel"
3. **Neden Serenity Retreats** — kısa manifesto metni
4. **Yaklaşan kamplar** — 2-3 kamp kartı: tarih aralığı, program, hoca, süre,
   `₺X'ten başlayan`, durum rozeti (kalan kontenjan ≤ 4 ise mercan "son yerler")
5. **Dahil olanlar** — 6 maddelik liste, ikonlu
6. **Üç fayda bloğu** — dönüşümlü görsel/metin: Pratiğini Derinleştir ·
   Bedenini Besle · Zihnini Sıfırla
7. **Hocalarımız** — 3 hoca kartı, `/hocalar`'a link
8. **Mekan** — galeri şeridi + kısa metin + konum, `/mekan`'a link
9. **Yorumlar** — kaydırmalı alıntılar (örnek veri, açıkça işaretli)
10. **Bülten / CTA bandı** — e-posta toplama
11. **Footer**

**Basın logoları eklenmez.** Referans sitede Vogue / Condé Nast / The Times
logoları var; sahip olunmayan basın referansı koymak yanıltıcıdır ve marka riski
yaratır. Yerine 2. maddedeki doğrulanabilir bilgi şeridi konur.

Örnek yorumlar kodda `isPlaceholder: true` ile işaretlenir ve içerik dosyasının
başında büyük harfli bir uyarı yorumu bulunur.

### 7.2 Kamp dönemleri listesi — `/kamplar`

Sayfa başlığı + filtre chip'leri (program: Tümü / Yoga / Pilates / Yoga & Pilates;
seviye). Filtreleme istemci tarafında, URL arama parametresine yansır
(`?program=yoga`) ki paylaşılabilir olsun. Geçmiş kamplar ayrı bir "Geçmiş
kamplar" başlığı altında, soluk stille listelenir.

### 7.3 Kamp detay — `/kamplar/[slug]`

- Hero: görsel + program adı + tarih aralığı + mekan + süre
- İki kolon: solda içerik, sağda **sabit (sticky) CTA kartı** — tarih, süre,
  kişi başı fiyat, kalan kontenjan, "Yer Ayır" butonu, WhatsApp linki
- İçerik: özet → günlük akış (zaman çizelgesi) → dahil olanlar / olmayanlar →
  hocalar → mekan (kısa) → galeri → SSS kısa listesi
- Mobilde CTA kartı ekran altına sabitlenen bir bara dönüşür
- JSON-LD `Event` şeması (`startDate`, `endDate`, `location`, `offers`)

### 7.4 Hocalar — `/hocalar`, `/hocalar/[slug]`

Liste: fotoğraf + isim + unvan + disiplin chip'leri. Profil: büyük fotoğraf,
biyografi, sertifikalar, katıldığı kamplar (ters ilişkiden türetilir), Instagram.

### 7.5 Mekan — `/mekan`

Bilinçli olarak kısa: 4-6 güçlü fotoğraf (galeri), konum haritası (iframe,
`loading="lazy"`), taş mimari ve Assos üzerine iki paragraf, öne çıkanlar listesi,
"Otelin kendi sitesi" dış linki. **Oda tipi, oda fiyatı, müsaitlik geçmez.**

### 7.6 Deneyim — `/deneyim`

"Bir gün nasıl geçer" zaman çizelgesi, beslenme yaklaşımı, ne getirmeli listesi,
seviye beklentileri.

### 7.7 Diğer

- `/hakkimizda` — kuruluş hikayesi, yaklaşım, ekip
- `/sss` — akordeon, `<details>` tabanlı (JS gerektirmez), JSON-LD `FAQPage`
- `/iletisim` — iletişim bilgileri, harita, kısa mesaj formu, WhatsApp
- `/blog` — boş durum: "Yakında ilk yazılarımız burada olacak." Liste ve detay
  şablonları hazır.
- `/kvkk`, `/gizlilik` — yer tutucu metin, açıkça işaretli

## 8. Bileşen yapısı

Her bileşen tek bir işi yapar, props üzerinden veri alır, içerik dosyalarına
doğrudan erişmez (veri çekimi sayfa seviyesinde yapılır).

```
components/
  ui/          button · eyebrow · section · badge · chip · accordion · gallery-strip
  layout/      navbar · footer · page-hero · language-switcher · whatsapp-fab · back-to-top
  home/        hero-home · trust-strip · manifesto · upcoming-camps · includes-list
               benefit-block · teachers-preview · venue-preview · testimonials · newsletter-cta
  camps/       camp-card · camp-filters · camp-hero · daily-flow · includes-excludes
               camp-cta-card · camp-cta-bar (mobil) · camp-jsonld
  teachers/    teacher-card · teacher-bio
  venue/       venue-gallery · venue-location · venue-highlights
  inquiry/     inquiry-form · camp-select · consent-checkbox
```

Sunucu bileşeni varsayılandır. `'use client'` yalnızca şu bileşenlerde:
`camp-filters`, `inquiry-form`, `language-switcher`, `navbar` (mobil menü),
`testimonials` (kaydırma), `back-to-top`.

## 9. Talep (başvuru) akışı

### 9.1 Akış

Kamp detayındaki "Yer Ayır" → `/basvuru?kamp=<slug>` (kamp alanı önseçili) →
form gönderimi → `POST /api/inquiry` → başarılıysa `/basvuru-alindi`.

Ayrıca her sayfada WhatsApp FAB; kamp detayında kamp adı önyazılı
(`wa.me/<numara>?text=...`).

### 9.2 Form alanları

| Alan | Tip | Doğrulama |
|---|---|---|
| Ad Soyad | text | zorunlu, 2-80 karakter |
| E-posta | email | zorunlu, geçerli e-posta |
| Telefon | tel | zorunlu, TR/uluslararası biçim toleranslı |
| Kamp dönemi | select | zorunlu, mevcut bir slug olmalı |
| Kişi sayısı | number | zorunlu, 1-8 |
| Oda tercihi | radio | `paylasimli` \| `tek-kisilik` |
| Mesaj | textarea | opsiyonel, max 1000 karakter |
| KVKK onayı | checkbox | zorunlu, `true` olmalı |

### 9.3 API sözleşmesi

`POST /api/inquiry`

Tek uç, üç form türüne hizmet eder — `kind` alanı ayrımı yapar:

| `kind` | Kaynak | Zorunlu alanlar |
|---|---|---|
| `camp` | `/basvuru` — kamp katılım talebi | §9.2'deki tüm alanlar |
| `contact` | `/iletisim` — genel mesaj | ad, e-posta, mesaj, KVKK |
| `newsletter` | Ana sayfa bülten bandı | e-posta, KVKK |

zod ayrık birleşim (discriminated union) ile `kind` üzerinden doğrulanır, böylece
her tür yalnızca kendi alanlarını zorunlu tutar.

- Gövde zod ile doğrulanır (`src/lib/utils/validation.ts`)
- Rate limit: IP başına 5 istek / 10 dakika. Upstash env değişkenleri varsa
  Upstash, yoksa in-memory sayaç (geliştirme ortamı için)
- Turnstile token'ı, env'de site key tanımlıysa doğrulanır; tanımsızsa atlanır
- Başarı: `200 { ok: true, referenceId }`

**`referenceId` durumsuz üretilir.** Veritabanı yok, dolayısıyla artan sayaç
kullanılamaz. Biçim: `SR-<YYYYMMDD>-<4 karakter base32 rastgele>` —
örnek `SR-20260731-A7K2`. Tarih insan okunabilirliği, rastgele son ek çakışma
önlemeyi sağlar. Bu değer yalnızca katılımcı ile aranızdaki yazışmada referans
olarak kullanılır, sistemde bir kaydı işaret etmez.
- Doğrulama hatası: `400 { ok: false, errors: Record<field, message> }`
- Rate limit: `429 { ok: false, error: 'rate_limited' }`
- Sunucu hatası: `500 { ok: false, error: 'server_error' }`

**E-posta:** Resend ile iki mesaj — organizasyona bildirim (tüm form verisi,
kamp bilgisi, referans no) ve katılımcıya otomatik yanıt (talebi aldık, ne
zaman döneceğiz, kamp özeti). Resend env değişkeni yoksa e-posta gönderimi
atlanır ve konsola loglanır; **form yine de başarılı döner** — geliştirme
ortamında akış test edilebilsin diye.

### 9.4 Hata yönetimi (arayüz)

Alan hataları ilgili alanın hemen altında, `aria-describedby` ile bağlı.
Gönderim sırasında buton devre dışı + "Gönderiliyor…". Ağ/sunucu hatasında form
verisi korunur ve WhatsApp alternatifi öne çıkarılır: "Form gönderilemedi.
WhatsApp'tan da yazabilirsiniz."

## 10. SEO ve erişilebilirlik

- Sayfa başına `generateMetadata` — başlık, açıklama, OG görseli
- `hreflang` alternatifleri (`tr`, `en`, `x-default` → `tr`), canonical
- JSON-LD: `Organization` (kök), `Event` (her kamp dönemi), `FAQPage` (SSS)
- `sitemap.ts` — statik sayfalar + tüm kamp ve hoca slug'ları, iki dil
- Görseller `next/image` ile, hero görsellerinde `priority`, gerisi `lazy`
- Semantik başlık hiyerarşisi, sayfa başına tek `h1`
- Klavye odak halkası: `:focus-visible { outline: 2px solid var(--color-accent-deep) }`
- `prefers-reduced-motion` desteklenir — kaydırma ve geçiş animasyonları kapanır
- Tüm etkileşimli öğeler klavyeyle erişilebilir; mobil menü odak tuzağı (focus trap) içerir

## 11. Test stratejisi

Vitest. Kapsam bilinçli olarak dar ve değerli tutulur:

1. **İçerik bütünlüğü** — her kampın `venueSlug` ve tüm `teacherSlugs` değerleri
   gerçekten çözülüyor mu; `slug` değerleri tekil mi; `endDate >= startDate`;
   `nights` tarih aralığıyla tutarlı mı; `spotsLeft <= capacity`; her
   `Localized` alanın hem `tr` hem `en` değeri boş değil mi
2. **Tarih yardımcıları** — TR/EN tarih aralığı biçimleme, ay taşan aralıklar
   ("28 Eyl – 2 Eki 2026"), yıl taşan aralıklar
3. **İçerik seçicileri** — `getUpcomingCamps` sabit bir "bugün" değeriyle doğru
   filtreliyor ve sıralıyor mu
4. **Form doğrulama şeması** — üç `kind` türünün her biri için geçerli/geçersiz
   gövdeler; sınır değerler (kişi sayısı 0/1/8/9, mesaj 1000/1001 karakter,
   KVKK `false`); `kind: 'newsletter'` gövdesinin kamp alanlarını zorunlu
   tutmadığı; `kind: 'camp'` gövdesinde var olmayan bir kamp slug'ının reddedildiği
5. **`referenceId` biçimi** — `SR-<YYYYMMDD>-<4 karakter>` kalıbına uyduğu ve
   ardışık çağrılarda farklı değer ürettiği

## 12. Dağıtım

Vercel. Ortam değişkenleri `.env.example` dosyasında belgelenir:

```
RESEND_API_KEY=                 # yoksa e-posta atlanır, form yine çalışır
INQUIRY_TO_EMAIL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SITE_URL=
UPSTASH_REDIS_REST_URL=         # opsiyonel
UPSTASH_REDIS_REST_TOKEN=       # opsiyonel
NEXT_PUBLIC_TURNSTILE_SITE_KEY= # opsiyonel
TURNSTILE_SECRET_KEY=           # opsiyonel
```

Kural: **opsiyonel env değişkeni eksikse ilgili özellik zarifçe devre dışı kalır,
build veya çalışma zamanı çökmez.**

## 13. Bu belge dışında not edilen bulgu

Otel repo'sundaki [`.claude/skills/ui-agent/brand-guide.md`](https://github.com/aerencagatay/otel-web-app)
dosyası güncel değil: Playfair Display ve altın `#e4a00e` vurgusunu anlatıyor,
ancak canlı `src/app/globals.css` "Assos Sessizliği" paletini kullanıyor —
derin Ege mavisi `#2e4a5c`, fildişi `#f4f2ee`, Cormorant Garamond + DM Sans.
Bu proje kapsamı dışında, ama o repoda düzeltilmesi gerekiyor.
