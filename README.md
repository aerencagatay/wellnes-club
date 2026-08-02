# Serenity Retreats

Assos'ta (Çanakkale) yoga ve pilates kampları düzenleyen bir organizasyon için iki dilli
(tr/en) "quiet luxury" tanıtım sitesi. Online ödeme veya veritabanı yoktur; dönüşüm yolu
tek bir başvuru formu ve WhatsApp'tır. İçerik statik TypeScript dosyalarında tutulur
(`src/content/`), Next.js App Router ile derlenir.

## Gereksinimler

- **Node.js ≥ 20.** `resend` paketi (`package.json` → `dependencies`) kendi `engines`
  alanında `node >= 20` talep eder; bu projenin kendi `package.json`'ında ise henüz bir
  `engines` alanı **tanımlı değildir**. Bu, npm'in düşük bir Node sürümünü otomatik
  reddetmeyeceği, ama `resend`'in gerçek çalışma zamanı davranışının bu sürümün altında
  garanti edilmediği anlamına gelir. CI/CD veya barındırma platformunuzda Node sürümünü
  elle 20+ olarak sabitleyin.
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

## Tasarım kuralları

- **`--color-accent` (turkuaz) hiçbir zaman metin rengi olarak kullanılmaz** — yalnızca
  zemin/arka plan olarak. Metin için her zaman `--color-accent-deep` kullanılır.
  `src/lib/utils/contrast-guard.test.ts` kaynak ağacını tarayıp bağımsız bir
  `text-accent` yardımcı sınıfı kullanımını (metinde) test hatası olarak işaretler;
  `text-accent-deep` istisnadır.
- **Gövde metni rengi `#6f6f6f`'tir** (`--color-body`, `globals.css`). Aynı test dosyası
  bu tanımın var olduğunu da denetler.
- **`--color-body-muted` yalnızca ≥24px metinde kullanılabilir.** Bunun dışında bir
  kullanım test tarafından yakalanır; bilinçli bir istisna gerekiyorsa aynı satıra
  `contrast-guard-allow` yorumu eklenmelidir.
- **Koyu krem zeminlerde (`cream-2`, `cream-3`) `text-body`, `text-coral`, `text-olive`
  yeterli kontrast vermez.** `--color-body` (#6f6f6f) yalnızca en açık `--color-cream`
  zemininde (4.67:1) WCAG AA'yı geçer; `cream-2`'de 4.28:1, `cream-3`'te 4.09:1'e düşer
  — ikisi de 4.5:1 eşiğinin altındadır (Task 16'da gerçek bir Lighthouse denetimiyle
  yakalandı). Bu yüzden `--color-body-deep`, `--color-olive-deep`, `--color-coral-deep`
  token'ları eklendi (`globals.css`) — `--color-accent-deep` ile aynı mantık: taban renk
  metin için güvenli değilse, `-deep` sürümü kullanılır. Bir bileşeni `cream-2`/`cream-3`
  zemininde kullanacaksanız (veya `opacity` ile soldurulmuş bir kapsayıcı içine
  koyacaksanız — bkz. aşağıdaki not) metin renklerini buna göre seçin.
- **Bir kapsayıcıya `opacity` uygulamak, içindeki TÜM metnin kontrastını da zemine
  doğru çöker.** `/kamplar` sayfasındaki "geçmiş kamplar" grid'i bunun gerçek bir
  örneğiydi (`opacity-65`, Lighthouse'ta ~2.51:1'e kadar düşen kontrast oranlarıyla
  yakalandı) ve kaldırıldı. Bir öğeyi görsel olarak "pasif/geçmiş" göstermek için
  `opacity` yerine ayrı bir başlık/rozet veya zemin rengi kullanın.
- Yeni bir bileşen eklerken bu kuralları ihlal edip etmediğinizi `npm test` size
  söyler (bare `text-accent`/korumasız `text-body-muted` için) — ama `text-body`'nin
  hangi zeminde kullanıldığı veya `opacity`'nin etkisi statik bir testle
  yakalanamaz; bu ikisi için `npm run build` sonrası gerçek bir Lighthouse
  taraması (bkz. Yayına hazırlık testi altındaki kontrol listesi) hâlâ gereklidir.

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

### Yayına hazırlık testi

`src/content/content-readiness.test.ts` varsayılan olarak **atlanır** (`npm test`
çalıştırıldığında `3 skipped` görürsünüz — bu normaldir, kırık bir test değildir). Yayın
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

### `resend`'in Node sürümü gereksinimi

`resend` paketi kendi `package.json`'ında `engines: { node: ">=20" }` beyan eder; bu
projenin `package.json`'ı ise bir `engines` alanı tanımlamaz. npm bu farkı zorunlu
kılmaz — barındırma platformunuzda Node sürümünü elle 20+ olarak sabitleyin (bkz.
"Gereksinimler").
