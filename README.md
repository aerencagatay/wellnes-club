# Serenity Retreats

Assos'ta (Çanakkale) yoga ve pilates kampları düzenleyen bir organizasyon için iki dilli
(tr/en) "quiet luxury" tanıtım sitesi. Online ödeme veya veritabanı yoktur; dönüşüm yolu
tek bir başvuru formu ve WhatsApp'tır. İçerik statik TypeScript dosyalarında tutulur
(`src/content/`), Next.js App Router ile derlenir.

## Gereksinimler

- **Node.js ≥ 22.** `resend` paketi (`package.json` → `dependencies`) kendi `engines`
  alanında `node >= 20` talep eder, ancak proje test paketindeki
  `src/lib/utils/contrast-guard.test.ts` `node:fs/promises`'ın `glob` üyesini kullanır —
  bu, Node 22+'da eklenmiş bir API'dir. Proje `package.json`'ı bunu `engines: { "node":
  ">=22" }` ile beyan eder; npm bu alanı zorunlu kılmaz, bu yüzden CI/CD veya barındırma
  platformunuzda Node sürümünü elle 22+ olarak sabitleyin.
- npm (proje `package-lock.json` ile birlikte gelir).

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` içindeki değerleri aşağıdaki tabloya göre doldurun. Hiçbirini doldurmadan da
site geliştirme ortamında çalışır — yalnızca e-posta gönderimi, WhatsApp butonu ve
dağıtık hız sınırlama gibi opsiyonel/entegrasyon özellikleri devre dışı kalır (bkz.
"Ortam değişkenleri" ve "Bilinmesi gereken operasyonel detaylar").

## Betikler

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır (Next.js dev server). |
| `npm run build` | Üretim derlemesi üretir (statik sayfalar + route'lar). |
| `npm run start` | `build` çıktısını üretim modunda sunar. |
| `npm test` | Vitest ile tüm testleri bir kez çalıştırır (bkz. "Yayına hazırlık testi"). |
| `npm run test:watch` | Testleri izleme modunda çalıştırır. |
| `npm run lint` | ESLint (Next.js kuralları + TypeScript) çalıştırır. |
| `npm run typecheck` | `tsc --noEmit` ile tüm proje ve testler için tip denetimi yapar. |

## Ortam değişkenleri

| Değişken | Zorunlu mu? | Eksikse ne olur |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Üretimde evet.** | Tanımsızsa `http://localhost:3000`'e düşer (bkz. `src/lib/config/site.ts`). Bu değer; kanonik/hreflang etiketleri, JSON-LD, `sitemap.xml`/`robots.txt` ve giden e-postaların `FROM` adresinin **hostname**'i için tek kaynaktır (bkz. aşağıdaki "FROM adresi ve localhost" notu). Üretime `localhost` ile çıkmak yayın öncesi kontrol listesinde ve `CHECK_LAUNCH_READY=1 npm test` içinde ayrıca engellenir. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Hayır (ama pratikte önemli). | Tanımsızsa `buildWhatsAppUrl()` `null` döner ve WhatsApp float butonu ile tüm "WhatsApp'tan sor" bağlantıları **hiç render edilmez** — hata vermez, sessizce kaybolur. |
| `INQUIRY_TO_EMAIL` | **Evet — bu, tek dönüşüm kanalıdır.** | Bkz. aşağıdaki "E-posta olmadan kayıp lead" uyarısı. |
| `RESEND_API_KEY` | **Evet — yukarıdakiyle birlikte.** | Aynı uyarı geçerlidir. |
| `UPSTASH_REDIS_REST_URL` | Hayır, ama önerilir. | Tanımsızsa hız sınırlama süreç-içi bir `Map`'e düşer (bkz. `src/lib/security/rate-limit.ts`). Bu, sunucusuz/çoklu örnek barındırmada örnekler arasında paylaşılmaz ve yeniden dağıtımda sıfırlanır — sınır teorik olarak örnek sayısı kadar gevşer. |
| `UPSTASH_REDIS_REST_TOKEN` | Yukarıdakiyle birlikte. | Aynı. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Hayır. | **Bu sürümde hiçbir yerde tüketilmez** — arayüzde bir Cloudflare Turnstile widget'ı henüz yok. Tanımlamak tek başına hiçbir şeyi değiştirmez. |
| `TURNSTILE_SECRET_KEY` | Hayır — **ve bir client widget eklenmeden ASLA tek başına ayarlanmamalıdır.** | Bkz. aşağıdaki "Turnstile'ı yanlışlıkla etkinleştirmeyin" uyarısı. |

## İçerik nasıl güncellenir

Tüm içerik `src/content/` altında düz TypeScript nesneleridir; veritabanı veya CMS
yoktur. Her dosyanın üstünde hangi alanların yer tutucu olduğunu açıklayan bir yorum
vardır. `npm test` her değişiklikte içerik bütünlüğünü otomatik denetler
(`src/content/content.test.ts`): benzersiz `slug`, kebab-case biçim, her iki dilde de
dolu alanlar, `/img/` ile başlayan görsel yolları, kapasite/kontenjan tutarlılığı vb.

- **Yeni bir kamp dönemi eklemek** — `src/content/camps.ts` içindeki `camps` dizisine bir
  `CampSession` nesnesi ekleyin (alan tipleri `src/content/types.ts`'te). `slug` benzersiz
  ve kebab-case olmalı; `dailyFlow` en az 6 madde içermeli; `includes`/`excludes` her iki
  dilde de aynı uzunlukta olmalı. `heroImage` ve `gallery` yolları `public/img/` altına
  konan dosyaları göstermelidir (örn. `public/img/camps/<slug>-hero.webp`).
- **Yeni bir hoca eklemek** — `src/content/teachers.ts` içine bir `Teacher` nesnesi
  ekleyin, `photo`'yu `public/img/teachers/` altına koyun. Kampın hocalarına
  bağlanabilmesi için kamp kaydındaki `teacherSlugs` dizisine hocanın `slug`'ını ekleyin.
- **Yeni bir mekan/otel eklemek** — `src/content/venues.ts` **birden fazla mekanı
  destekler**; yeni bir `Venue` nesnesi ekleyip kampın `venueSlug` alanını o mekana
  işaret edecek şekilde ayarlamanız yeterlidir. `gallery` en az 4 görsel içermelidir
  (`content.test.ts` bunu denetler). Görseller `public/img/venue/` altına konur; mevcut
  görseller otel görselinden WebP'ye dönüştürülüp yeniden boyutlandırılmıştır (uzun kenar
  ≤2400px, kalite ~80) — yeni görselleri de aynı kalıpta hazırlayın.
- **Yeni bir SSS/blog yazısı** — sırasıyla `src/content/faq.ts` ve `src/content/posts.ts`.
  Blog gövdesi v1'de düz metindir (`\n\n` ile ayrılan paragraflar); Markdown biçimlendirme
  gerektiğinde `blog/[slug]/page.tsx`'teki `renderMarkdownBody` bilinçli olarak
  ertelenmiştir ve o zaman bir Markdown kütüphanesiyle değiştirilmelidir.
- **Kullanıcıya görünen her yeni metin** `messages/tr.json` VE `messages/en.json`'a
  eklenmelidir — `src/i18n/messages.test.ts` iki dosyanın anahtar kümesinin birebir aynı
  olmasını ve hiçbir değerin boş olmamasını denetler.

### Kapasite/grup büyüklüğü metinleri elle senkronize edilir

`messages/*.json` içindeki `home.trust.groupSize.value` ("12–16") ve
`home.includes.items.4` ("12–16 kişilik küçük gruplar" / "Small groups of 12–16") ile
`about`/`benefits` metinlerindeki "on altı kişi" / "sixteen people" ifadeleri
`src/content/camps.ts`'teki gerçek `capacity` değerlerinden **hesaplanmaz** — elle
yazılmış dizelerdir. Kampların kapasitesini değiştirirseniz (ör. 20 kişilik bir kamp
eklerseniz) bu metinleri de elle güncelleyin, aksi halde site sessizce yanlış bir
kapasite iddiasında bulunmaya devam eder.

## Tasarım kuralları (editorial redesign)

Site 2026-08 editorial redesign'ından (turkuaz "quiet luxury" temasından Aman
Resorts tarzı sıcak-krem/zeytin editorial estetiğine) geçti. Aşağıdaki kurallar
`docs/briefs/2026-08-04-editorial-redesign-brief.md` §2'nin bağlayıcı kontrast
tablosunu ve bu görev serisinin (Task 1-9) makine + gerçek Lighthouse
doğrulamasını yansıtır.

### Renk paleti ve kontrast kuralları

`globals.css`teki `@theme inline` token'ları:

```css
--color-background: #F1EDE4  /* sıcak krem */
--color-surface:     #E5DED2  /* açık kum yüzeyi */
--color-text:        #1B211D  /* koyu taş metin */
--color-muted:        #5F5D57 /* ikincil metin — AA uyumlu, her boyutta */
--color-muted-soft:   #77756E /* YALNIZCA ≥24px veya ≥18.66px bold */
--color-olive:        #555D49 /* zeytin accent */
--color-sand:         #C9B99F /* kum accent — ASLA metin rengi değil */
--color-dark:         #171B18 /* koyu bölümler */
```

Ölçülmüş, bağlayıcı oranlar:

| Kullanım | Oran | Kural |
|---|---|---|
| `--muted` / `--background` | 5.63 | ✓ her boyutta ikincil metin |
| `--muted` / `--surface` | 4.93 | ✓ (dar marj — ≥4.5 eşiğini geçer, ama ince/açık ağırlıkla birlikte kullanılan yeni bir bileşen eklerseniz gerçek bir Lighthouse taramasıyla doğrulayın) |
| `--muted-soft` / `--background` | 3.95 | ✗ yalnızca ≥24px veya ≥18.66px bold |
| `--olive` / açık zemin (`--background`/`--surface`) | 5.90 / 5.15 | ✓ metin olarak kullanılabilir |
| `--olive` / `--dark` | 2.53 | ✗ **koyu zeminde zeytin metin yasak** |
| `--sand` / `--background` | 1.65 | ✗ **hiçbir zeminde metin rengi değil** — yalnızca dolgu/çizgi/ayırıcı |
| `--background` veya `--sand` / `--dark` | 14.90 / 9.05 | ✓ koyu zeminde metin |
| zeytin dolgu üzerine `--background` metin | 5.90 | ✓ |
| kum dolgu üzerine `--text` metin | 8.52 | ✓ |

Özet: turkuaz/neon/mor gradyan yok; köşeler keskin (`border-radius: 0`,
`rounded-full`/`rounded-2xl` kullanılmaz); koyu bölümlerde arka plan düz
`--dark` (gradyan yok), metin `--background` veya `--sand` — asla `--olive`;
açık zeminde accent metin `--olive` — asla `--sand`.

- **`text-sand` hiçbir biçimde (ne `text-sand` ne `text-[var(--color-sand)]`
  ne `text-[#C9B99F]`) metin rengi olarak kullanılmaz.**
  `src/lib/utils/contrast-guard.test.ts` kaynak ağacını tarayıp bu üç yazım
  biçimini de (token, `var()`, ham hex) test hatası olarak işaretler.
- **Koyu zeminde (`bg-dark`) `text-olive` yasaktır** — aynı test dosyası bunu
  da denetler.
- **`--muted-soft` yalnızca ≥24px metinde kullanılabilir.** Bilinçli bir
  istisna gerekiyorsa aynı satıra `contrast-guard-allow` yorumu eklenmelidir.
- Yeni bir bileşen eklerken bu kuralları ihlal edip etmediğinizi `npm test`
  size söyler — ama bir metnin **gerçek** zemininin ne olduğu (ör. koyu bir
  fotoğraf + yarı-şeffaf bindirme üzerinde) statik bir testle kesin
  saptanamaz; bu proje, Task 9'da 14 sayfa × 2 dil = 28 URL için gerçek
  Lighthouse `--only-categories=accessibility` taraması çalıştırıp hepsinin
  100 puan aldığını doğruladı (bkz. `.superpowers/sdd/2026-08-05-editorial-redesign/task-9-report.md`).
  Yeni bir sayfa/bölüm eklediğinizde `npm run build && npm start` sonrası aynı
  taramayı o sayfa için tekrarlayın — özellikle koyu hero fotoğrafı üzerine
  metin bindirmelerinde.

### Tipografi

- **Başlıklar (serif):** Instrument Serif. **Yalnızca 400 (normal) ağırlıkta
  yayınlanır** — `globals.css`teki `@layer base` kuralı `h1-h5` için
  `font-weight: 400`'ü açıkça sabitler; aksi halde tarayıcı, mevcut olmayan
  bir kalın ağırlığı taklit-bold (sentetik bold) ile üretir ve fontun ince,
  zarif çizgi kalitesini bozar. Bir başlığı "daha kalın" göstermek isterseniz
  `font-weight`/`font-bold` ile değil, boyut/harf aralığıyla vurgu yapın.
- **Gövde & menü (sans):** Manrope, 300-400 ağırlık, ferah harf aralığı.
- Tipografi ölçeği `globals.css`teki `@layer components` sınıflarındadır:
  `.type-display` (H1, `clamp(3rem, 8vw, 6.5rem)`), `.type-title` (H2,
  `clamp(2rem, 4vw, 3.25rem)`), `.type-lede` (gövde özet), `.type-eyebrow`
  (üst etiket). Bunlar `@layer components`e taşınmıştır ki Tailwind'in
  `utilities` katmanındaki `text-*` yardımcıları (ör. koyu zeminde
  `text-background`) rengi güvenle ezebilsin.

### Hareket katmanı ve `prefers-reduced-motion`

- **Smooth scroll:** `lenis` (`src/components/motion/smooth-scroll.tsx`).
  `prefers-reduced-motion: reduce` algılandığında Lenis **hiç kurulmaz** —
  tarayıcının kendi anlık kaydırması korunur. Bu, gerçek headless Chrome'da
  `--force-prefers-reduced-motion` ile doğrulandı: normal modda
  `<html class="lenis">` eklenir, azaltılmış modda hiç eklenmez.
- **Bölüm açılışı/mikro-etkileşim:** `motion` (framer-motion'ın yeni paket
  adı) — `Reveal`/`RevealGroup` (`src/components/motion/reveal.tsx`),
  `MaskedLines` (hero'nun satır-satır mask reveal'i), `Parallax`
  (yalnızca `transform`), `Marquee` (dekoratif, `aria-hidden`).
  Tümü yalnızca `opacity`/`transform` animasyonu yapar (`transition: all`
  hiçbir yerde kullanılmaz) ve **her biri** hareket azaltma istendiğinde
  animasyonsuz, son/nihai durumuyla render edilir — hiçbir bölüm kalıcı
  olarak `opacity: 0`'da asılı kalmaz. Bu, gerçek headless Chrome'da 7 farklı
  sayfada (ana sayfa, deneyim, kamp detay, mekan, hocalar, başvuru, kamplar)
  `getComputedStyle` ile sıfır kalıcı-gizli öğe bulunarak doğrulandı.
- `RevealGroup`'un `itemAs="li"` ile kullanıldığı liste bağlamlarında (Daily
  Flow, Includes listesi) `className` verilmezse grup **hiçbir sarmalayıcı
  DOM düğümü render etmez** (React `Fragment`) — `<li>` öğeleri gerçekten
  `<ol>`/`<ul>`'un doğrudan çocuğu olur. Önceki sürüm bunu bir
  `display: contents` `div`'i ile çözmeye çalışıyordu; gerçek bir Lighthouse
  taraması bu düğümün bazı tarayıcı erişilebilirlik ağaçlarında hâlâ var
  olduğunu ve axe'in `list`/`listitem` denetimini kırdığını gösterdi
  (Task 9'da bulundu ve düzeltildi — bkz. task-9-report.md).
- Global CSS güvenlik ağı: `@media (prefers-reduced-motion: reduce)` tüm
  `animation-duration`/`transition-duration`'ı `0.01ms`'e indirir
  (`globals.css`) — bileşen bazlı reduced-motion dallarına ek bir taban
  güvence.

### Hero video / fallback fotoğraf

Brief §4.1 yavaş oynayan bir hero videosu tarif eder, ama `src/lib/config/site.ts`
içinde henüz bir `heroVideo` alanı **tanımlı değildir** ve gerçek bir video
dosyası da yoktur — bu bilinçli bir karardır (uydurma video yerine gerçek bir
fallback fotoğraf, bkz. `src/components/home/hero-home.tsx`'teki `HERO_IMAGE`
yorumu). Şu an ana sayfa hero'su, kamp detay hero'su ve mekan sayfası hero'su
istemcinin gerçek fotoğraflarını (`public/img/`) `next/image`'ın `priority`
özelliğiyle kullanır. Gerçek bir hero videosu eklenecekse: `site.ts`'e
`heroVideo` alanı eklenmeli, `HeroHome`/`CampDetailHero` koşullu olarak
`<video>` render etmeli ve `prefers-reduced-motion: reduce` altında videonun
ya duraklatılması ya da statik fotoğrafa düşülmesi gerekir (brief'in "az ve
kaliteli hareket" ilkesiyle tutarlı olarak).

## Yayın öncesi kontrol listesi

Bu adımların **tamamı** tamamlanmadan site canlıya alınmamalıdır:

1. `src/lib/config/site.ts` içindeki telefon, e-posta, Instagram güncellendi.
2. `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `INQUIRY_TO_EMAIL`,
   `RESEND_API_KEY` üretim ortamında tanımlandı.
3. `src/content/testimonials.ts` gerçek yorumlarla değiştirildi veya bölüm kaldırıldı.
4. `messages/*.json` içindeki KVKK ve gizlilik metinleri hukuk danışmanının metniyle
   değiştirildi (`legal.placeholderWarning` kaldırıldı).
5. Gerçek kamp tarihleri, fiyatları ve kontenjanları `src/content/camps.ts`'e girildi.
6. Gerçek hoca fotoğrafları ve biyografileri `src/content/teachers.ts`'e girildi,
   `public/img/teachers/` altındaki SVG yer tutucular gerçek fotoğraflarla değiştirildi.
7. `CHECK_LAUNCH_READY=1 npm test` geçiyor (bkz. aşağıda — bu üç maddeyi otomatik
   denetler: örnek yorum, telefon/e-posta/Instagram yer tutucusu, `localhost` URL).
8. `npm run build` uyarısız tamamlanıyor.
9. **Mekan (`public/img/venue/`) fotoğrafları daha iyi kadraj ve ışıkla yeniden
   çekilir/düzenlenir.** Mevcut 7 fotoğraf gerçek (Assos Karadut Taş Otel) ve
   doğru, ama editorial sanat yönünün gerektirdiği kalitede değil — bu bilinçli
   bir karardı (bkz. `docs/briefs/2026-08-04-editorial-redesign-brief.md` §6):
   mekan bölümünde stok görsel kullanılmaz, çünkü ziyaretçi tam olarak bu
   görsele bakarak rezervasyon yapıyor.

### Yayına hazırlık testi

`src/content/content-readiness.test.ts` varsayılan olarak **atlanır** (`npm test`
çalıştırıldığında `5 skipped` görürsünüz — bu normaldir, kırık bir test değildir). Yayın
öncesi elle çalıştırın:

```bash
CHECK_LAUNCH_READY=1 npm test
```

Yer tutucu içerik hâlâ yerindeyse bu komut **başarısız olur** — bu beklenen ve istenen
davranıştır: test, yukarıdaki kontrol listesinin 1., 3. ve 2. (yalnızca `NEXT_PUBLIC_SITE_URL`)
maddelerini otomatik olarak uygular. Yeşile dönmeden yayına alınmamalıdır.

## Bilinmesi gereken operasyonel detaylar

Bu bölüm kod yorumlarında dağınık halde duran, ama bir dağıtım öncesi mutlaka bilinmesi
gereken gerçekleri tek yerde toplar.

### E-posta olmadan kayıp lead (en önemli madde)

**Bu sitede tek dönüşüm yolu e-postadır.** `INQUIRY_TO_EMAIL` ve `RESEND_API_KEY`
tanımlanmadan başvuru/iletişim/bülten formu **ziyaretçiye başarı mesajı gösterir** ama
hiçbir yere e-posta gitmez — yalnızca kimsenin okumadığı bir sunucu konsoluna loglanır
(`src/lib/mail/index.ts` → `console.info('[inquiry] E-posta yapılandırılmadı...')`).
Ziyaretçi açısından her şey normal görünür; gerçekte **her başvuru sessizce kaybolur.**
Bu iki değişken olmadan siteyi yayına almayın.

### FROM adresi ve `localhost`

Giden e-postaların `FROM` adresi `NEXT_PUBLIC_SITE_URL`'in **hostname**'inden türetilir
(`bilgi@<hostname>`, bkz. `src/lib/mail/index.ts`). Geliştirme ortamında bu değer
`bilgi@localhost` olur. Yerelde gerçek bir `RESEND_API_KEY` tanımlayıp `NEXT_PUBLIC_SITE_URL`'i
`localhost`'ta bırakırsanız Resend gönderimi **reddeder** — bu artık sessiz bir
"başarı" değil, `delivered: false` dönen ve sunucu tarafında loglanan dürüst bir
başarısızlıktır, ama beklenmedikse kafa karıştırabilir.

### Hız sınırlama yalnızca güvenilir bir proxy arkasında diş gösterir

`src/app/api/inquiry/route.ts` istemci IP'sini `X-Forwarded-For`/`X-Real-IP`/
`X-Vercel-Forwarded-For` başlıklarından okur. Bu başlıklar yalnızca aradaki katman
(Vercel'in kenarı veya eşdeğer bir ters proxy) onları **kendi gözlemiyle üzerine
yazıyorsa** güvenilirdir. Sitenizi tamamen açık bir origin'de (güvenilir bir proxy
olmadan) barındırırsanız, başlık tabanlı hiçbir IP tespiti saldırganı gerçek istemciden
ayırt edemez — bu koda özgü bir eksiklik değil, tekniğin doğasıdır. O topolojide gerçek
azaltma, `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`'ı yapılandırıp dağıtık hız
sınırlamayı devreye almaktır (IP sahtekarlığına karşı tam çözüm değildir, ama süreç-içi
sayaçtan daha güçlüdür).

### Vercel'in `VERCEL` sistem değişkeni kapalıysa

`clientIp()` (`src/app/api/inquiry/route.ts`) yalnızca `process.env.VERCEL === '1'`
iken `x-vercel-forwarded-for` başlığını dikkate alır. Bu değişken Vercel projelerinde
**"Enable access to System Environment Variables"** ayarı kapalıysa çalışma zamanına
enjekte edilmez. Kapalıysa bu dal sessizce atlanır ve kod `x-real-ip`/`x-forwarded-for`'a
düşer — bunlar da Vercel tarafından zaten üzerine yazıldığı için en kötü ihtimalle bir
geri düşüş olur, bir güvenlik regresyonu değil; yine de bu ayarın açık olması önerilir.

### Turnstile'ı yanlışlıkla etkinleştirmeyin

`TURNSTILE_SECRET_KEY` tanımlıyken `src/lib/security/turnstile.ts` her başvuru için bir
`turnstileToken` **bekler**; token yoksa doğrulamayı reddeder. Bu sürümde arayüzde
(`inquiry-form.tsx`, `contact-form.tsx`, `newsletter-cta.tsx`) bir Cloudflare Turnstile
widget'ı **henüz yoktur** — yani `turnstileToken` hiçbir zaman doldurulmaz. Sonuç: bu
sürümde `TURNSTILE_SECRET_KEY`'i tek başına tanımlarsanız **her gerçek ziyaretçinin
başvurusu reddedilir** ve form fiilen kilitlenir. Bir client-side Turnstile widget'ı
eklenip `turnstileToken` doldurulmadan bu değişkeni üretimde tanımlamayın.

### `resend`'in ve test paketinin Node sürümü gereksinimi

`resend` paketi kendi `package.json`'ında `engines: { node: ">=20" }` beyan eder; ancak
bu projenin kendi `package.json`'ı `engines: { "node": ">=22" }` talep eder, çünkü test
paketi (`contrast-guard.test.ts`) Node 22'de eklenen `node:fs/promises`'ın `glob`
üyesini kullanır. npm bu alanı zorunlu kılmaz — barındırma platformunuzda Node sürümünü
elle 22+ olarak sabitleyin (bkz. "Gereksinimler").
