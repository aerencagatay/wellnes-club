# Editorial Redesign Brief — Serenity Retreats

**Tarih:** 2026-08-04
**Durum:** Taslak — uygulanmadan önce §11'deki açık kararlar netleşmeli
**İlişkili:** [spec](../superpowers/specs/2026-07-31-serenity-retreats-design.md) · [plan](../superpowers/plans/2026-08-01-serenity-retreats-site.md)

> Bu brief, hâlihazırda yayınlanmış turkuaz temalı siteyi **görsel olarak tamamen
> yeniden yönlendirir**. Altyapı (içerik katmanı, form API'si, güvenlik, SEO,
> erişilebilirlik, 165 test) korunur; değişen katman sanat yönü ve etkileşimdir.

---

## 0. Kısa özet

Assos'ta düzenlenen yoga & pilates retreat'ini (ve gelecekteki doğa etkinliklerini)
tanıtan, başvuru toplayan bir wellness sitesi. Mevcut turkuaz temalı otel-tanıtım
hissi tamamen bırakılır.

**Yeni yön:** Aman Resorts sadeliği + Awwwards tarzı yumuşak scroll + modern
longevity/wellness markası. Hedef duygu: *"A slower way of living."* — sakin,
ferah, lüks ama gösterişsiz.

**Olmasın:** aşırı futuristik, neon, teknoloji şirketi görünümü, her yerde yuvarlak
köşeler, kalabalık satış metni, klasik "card grid" şablonu.

**Olsun:** koyu taş / sıcak krem / zeytin tonları, büyük serif başlıklar, ince
sans-serif açıklamalar, çok geniş boşluklar, tam ekran fotoğraf/video, çok az ama
çok kaliteli hareket, hafif parallax, editorial (dergi) kompozisyon.

---

## 1. Sanat yönü

- Tek, net ve cesur bir sanat yönüne tam commit. Editorial / dergi estetiği.
  Fotoğrafa nefes alacak alan bırak; metinle doldurma.
- Keskin dikdörtgen "card" yerine **asimetrik editorial kompozisyonlar**: büyük
  görsel + yanında küçük detay görselleri, kaydırılmış hizalamalar, geniş boşluklar.
- Yuvarlak köşe her yerde kullanılmaz. Köşeler çoğunlukla keskin (0px) veya çok
  hafif (2–4px).
- Görseller bilinçli işlenir: spotlight etkisi, kırpılmış çerçeveler, tam-taşma
  (full-bleed) görseller, hafif grain/noise doku overlay.
- Referans: **Aman Resorts** (hero'da az metin, dev görsel, ince üst menü, zarif
  geçişler), Awwwards editorial wellness siteleri.

---

## 2. Renk paleti

```css
:root {
  --background:  #F1EDE4; /* sıcak krem */
  --surface:     #E5DED2; /* açık kum yüzeyi */
  --text:        #1B211D; /* koyu taş metin */
  --muted:       #5F5D57; /* ikincil metin — AA uyumlu (bkz. tablo) */
  --muted-soft:  #77756E; /* brief'in orijinal tonu — YALNIZCA büyük metin */
  --olive:       #555D49; /* zeytin accent */
  --sand:        #C9B99F; /* kum accent */
  --dark:        #171B18; /* koyu bölümler */
}
```

Brief'in orijinal `--muted` değeri (#77756E) krem üzerinde **3.95:1**, kum yüzeyi
üzerinde **3.45:1** veriyordu — ikisi de WCAG AA'nın 4.5:1 eşiğinin altında. İkincil
gövde metni rengi olduğu için doğrudan kullanılamaz. `#5F5D57` görsel olarak
neredeyse ayırt edilemeyecek kadar yakın ama her iki açık zeminde de geçiyor.

### Ölçülen oranlar ve bağlayıcı kurallar

| Kullanım | Oran | Karar |
|---|---|---|
| `--text` / `--background` | 14.02 | ✓ başlık ve gövde |
| `--text` / `--surface` | 12.26 | ✓ |
| `--muted` #5F5D57 / `--background` | 5.63 | ✓ **ikincil gövde metni** |
| `--muted` #5F5D57 / `--surface` | 4.93 | ✓ |
| `--muted-soft` #77756E / `--background` | 3.95 | ✗ yalnızca ≥24px veya ≥18.66px bold |
| `--olive` / `--background` | 5.90 | ✓ metin olarak kullanılabilir |
| `--olive` / `--surface` | 5.15 | ✓ |
| `--sand` / `--background` | 1.65 | ✗ **metin olarak yasak** — sadece dolgu/çizgi |
| `--background` / `--olive` dolgu | 5.90 | ✓ zeytin dolgu üzerine krem metin |
| `--text` / `--sand` dolgu | 8.52 | ✓ kum dolgu üzerine koyu metin |
| `--sand` / `--dark` | 9.05 | ✓ koyu bölümde accent metin |
| `--background` / `--dark` | 14.90 | ✓ koyu bölümde gövde metni |
| `--olive` / `--dark` | 2.53 | ✗ **koyu zeminde zeytin metin yasak** |

Özet kurallar:
- Turkuaz / neon / mor gradyan kullanılmaz.
- Koyu bölümlerde arka plan düz `--dark` (gradyan çamurlaştırır). Koyu zeminde
  metin `--background` veya `--sand` olur — **asla `--olive`**.
- Açık zeminde accent metin `--olive` olur — **asla `--sand`**. Kum yalnızca
  dolgu, çizgi ve ayırıcı olarak kullanılır.
- Mevcut projede `contrast-guard` testi bu kuralları makine tarafından uyguluyor;
  yeni token'lar için aynı korumayı güncelle (`text-sand` ve koyu zeminde
  `text-olive` yakalanmalı).

---

## 3. Tipografi

- **Başlıklar (serif):** Instrument Serif — büyük, ince, zarif.
- **Gövde & menü (sans):** Manrope — ince, sade, ferah.
- H1 dev boyutta (`clamp(3.5rem, 8vw, 6rem)`), geniş satır boşlukları. Gövde
  metni 300–400 ağırlık, ferah harf aralığı.

---

## 4. Sayfa yapısı

### 4.1 Hero
Tam ekran (100vh), yavaş oynayan video; yoksa dev bir fotoğraf. Metin çok az:

- Başlık: **A slower way of living.**
- Alt: **Three days in Assos.**
- Etiket satırı: `Yoga · Pilates · Nature · Rest`
- Tek CTA: **Retreat'i keşfet**

İnce, transparan üst menü (scroll'da hafif değişir).
**İmza on-load anı:** başlık satır-satır mask reveal ile açılır.

### 4.2 Kamp bilgi paneli
```
07—09 September
Assos, Çanakkale
12 guests
3 days / 2 nights
```
Yanında büyük **Reserve your place** → rezervasyon formu.

### 4.3 Daily Flow
Uzun tablo yerine **yatay zaman çizgisi**:
```
07:30  Morning movement
09:00  Breakfast
12:00  Free time
17:00  Pilates
20:00  Dinner
```
Scroll'da maddeler sırayla (staggered) açılır.

### 4.4 Mekan bölümü
Carousel yerine **büyük ana fotoğraf + sağda iki küçük detay fotoğrafı**.
Tıklayınca fullscreen galeri (lightbox).

### 4.5 Eğitmenler
Profil kartı değil, **moda dergisi düzeni**: büyük portre, sadece isim,
uzmanlık, iki satır bio.

### 4.6 Gelecek etkinlikler ("Coming soon")
Assos retreat sadece ilk etkinlik. Gelecekte: hiking, camping, running, su
sporları (kano, paddling), ATV ile wildlife turları. Anlaşmalı oteller ve
anlaşmalı pilates hocaları vurgusu. Editorial liste/mozaik — kalabalık grid değil.

### 4.7 Son CTA
Tam ekran koyu (`--dark`). Başlık: **Your weekend away from everything.**
Altında tarih + tek buton.

### 4.8 Footer
Minimal: marka adı, kısa navigasyon, iletişim, sosyal.

---

## 5. Hareket & etkileşim

Motion az ve kaliteli; abartılmaz.

- **Smooth momentum scroll:** `lenis`
- **Section reveal & micro-interaction:** `framer-motion`
- **Hero on-load:** satır-satır masked reveal (imza an)
- Hafif parallax / katman hissi (hero veya mekan bölümünde)
- Bir yerde yavaş kayan metin şeridi: `Yoga · Pilates · Nature · Rest · Longevity`
- Manifesto bölümü numaralı bölümler (01, 02, 03) olarak editorial biçimde
- Geçişler belirli özelliklere uygulanır (opacity, transform). `transition: all` yok.
- Hover / custom cursor / selection state gibi ince dokunuşlar
- `prefers-reduced-motion` desteklenir

---

## 6. Görseller

- Tema: yoga/pilates retreat, wellness, longevity, doğa, sabah ışığı, sakin lüks.
- Optimize (webp), lazy-load, art direction'a uygun kırpma.

**Karar (2026-08-05): karma yaklaşım.**

- **Mood / atmosfer bölümleri** (hero, manifesto, fayda blokları, Coming soon):
  stok görsel serbest. Bunlar bir yer iddiası taşımaz, duygu taşır.
- **Mekan bölümü** (§4.4 — "kalacağınız yer"): Assos Karadut Taş Otel'in
  **gerçek fotoğrafları** kullanılır. İnsanlar bu bölüme bakarak rezervasyon
  yapıyor; başka bir tesisin havuzunu göstermek gelen kişiye farklı bir yer
  satmak olur. Bu, projede sahte basın logosu ve sahte yorum koymayı
  reddettiğimiz aynı çizgi.
- Mevcut gerçek fotoğraflar `public/img/venue/` altında (7 adet webp).
- **Yayın öncesi kontrol listesine eklenecek:** mekan fotoğraflarının daha iyi
  kadraj ve ışıkla yeniden çekilmesi / düzenlenmesi. Mevcut kareler doğru ama
  editorial sanat yönünün gerektirdiği kalitede değil.

---

## 7. Rezervasyon / başvuru

- **Reserve your place** gerçek bir form açar: ad soyad, e-posta, telefon (ops.),
  kişi sayısı, seçilen etkinlik/tarih, not (ops.). Doğrulama zorunlu.
- Başarılı başvuruda onay e-postası (Resend) + organizatöre bildirim.
- Başarı/hata durumları net gösterilir.

**Karar (2026-08-05): veritabanı EKLENMEZ.** Brief'in ilk hâli kayıtların
veritabanına yazılmasını istiyordu; mevcut mimari bunu bilinçli olarak kapsam
dışı bırakıyor ve o karar korunuyor. Gerekçe: aylık maliyet doğmaz, ve kişisel
veriyi *saklamak* KVKK açısından e-postayla iletmekten farklı bir yükümlülük
(saklama süresi, silme prosedürü, veri sorumlusu kaydı) doğurur.

Dolayısıyla **mevcut `/api/inquiry` ucu aynen kullanılır** — zod ayrık birleşimi,
hız sınırı, Turnstile kancası, Resend teslimi ve `SR-YYYYMMDD-XXXX` referans
numarası dahil. Bu katmanda hiçbir şey yeniden yazılmaz; yalnızca formun görsel
kabuğu yeni sanat yönüne uyarlanır.

---

## 8. Teknik yön

- React / Next.js, küçük ve tek sorumluluklu bileşenler.
- `framer-motion`, `lenis`, ikon için Lucide (emoji ikon yok).
- Responsive: mobil/tablet/desktop kusursuz; mobilde de editorial his korunur.
- Performans: görsel optimizasyonu, lazy-load, gereksiz JS'den kaçınma.
- Erişilebilirlik: semantik HTML, alt metinleri, `prefers-reduced-motion`.
- Etkileşimli öğelere `data-testid` (kebab-case).

---

## 9. İçerik metinleri

- Hero: **A slower way of living.** / **Three days in Assos.** / `Yoga · Pilates · Nature · Rest`
- Kamp: `07—09 September · Assos, Çanakkale · 12 guests · 3 days / 2 nights`
- Daily Flow: `07:30 Morning movement`, `09:00 Breakfast`, `12:00 Free time`, `17:00 Pilates`, `20:00 Dinner`
- Son CTA: **Your weekend away from everything.**
- Marka adı: **Serenity Retreats** (değiştirilebilir)

---

## 10. Kabul kriterleri

Task 9'da (bkz. `.superpowers/sdd/2026-08-05-editorial-redesign/task-9-report.md`)
gerçek Lighthouse taraması (14 sayfa × 2 dil = 28 ölçüm, hepsi accessibility 100),
kod incelemesi ve gerçek headless-Chrome doğrulamasıyla işaretlendi:

- [x] Aman tarzı sade editorial his; turkuaz/neon yok — `contrast-guard.test.ts`
      turkuaz/neon/mor gradyan token'larının kaynak ağacına geri dönmediğini
      makine ile denetler; §2 kontrast tablosu Task 1'de ölçülüp uygulandı.
- [x] §2 paleti ve Instrument Serif + Manrope kullanılıyor — `globals.css`
      `@theme inline` token'ları ve `--font-heading`/`--font-body`.
- [x] Tam ekran hero + satır-satır masked reveal — `HeroHome` +
      `MaskedLines` (`src/components/home/hero-home.tsx`).
- [x] Kamp paneli, yatay Daily Flow, editorial mekan + fullscreen galeri,
      dergi tarzı eğitmenler, Coming soon, full-screen dark son CTA — sırasıyla
      `CampPanel`, `DailyFlow`, `VenuePreview`/`VenueLightbox`,
      `TeachersPreview`/`TeacherCard`, `ComingSoon`, son CTA bölümü (Task 5-8).
- [x] `lenis` + `framer-motion` (`motion` paketi) + hafif parallax + slow
      marquee + numaralı manifesto — `SmoothScroll`, `Reveal`/`RevealGroup`,
      `Parallax`, `Marquee`, `Manifesto` (`SECTIONS = ['01','02','03']`).
- [x] Rezervasyon formu kaydediyor ve Resend ile onay e-postası gönderiyor —
      görsel kabuk yeniden yapıldı, `/api/inquiry` ucu (§11 kararına göre)
      hiç değiştirilmedi; bu katman Task 9'un DOKUNULMAYACAK listesindedir.
- [x] Responsive, `prefers-reduced-motion`, `data-testid`'ler — reduced-motion
      davranışı Task 9'da gerçek headless Chrome'da (`--force-prefers-reduced-motion`)
      7 sayfada sıfır kalıcı-gizli öğe ve Lenis'in kurulmadığı doğrulanarak
      kanıtlandı (yalnızca kod okumasıyla değil).
- [x] Görseller optimize — hero'lar `priority` + webp/jpeg, diğerleri lazy
      (varsayılan veya açık `loading="lazy"`); bkz. task-9-report.md §Performans.

---

## 11. Alınan kararlar (2026-08-05)

Brief'in ilk hâli hâlihazırda yayınlanmış siteyle dört noktada çelişiyordu.
Hepsi karara bağlandı:

**1. Yaklaşım: mevcut site üzerinde redesign.** Sıfırdan yeni proje kurulmaz.
Korunan katmanlar — bunlara dokunulmaz:

- `src/content/` tipli içerik katmanı ve seçicileri (bütünlük testleriyle)
- `/api/inquiry` ucu: zod ayrık birleşimi, hız sınırı (`x-forwarded-for`
  sahteciliğine karşı sertleştirilmiş, `VERCEL` kapılı), Turnstile kancası,
  Resend teslimi, `delivered` sinyali
- `messages/tr.json` · `en.json` ve next-intl kurulumu (iki dil, hreflang)
- SEO katmanı: sitemap, robots, JSON-LD kurucuları, `buildAlternates`
- Yayın hazırlık testi (`CHECK_LAUNCH_READY=1`)
- 165 testin tamamı — görsel katman değişirken hiçbiri kırılmamalı

Değişen katman: `globals.css` token'ları, tipografi, tüm sunum bileşenleri,
sayfa kompozisyonları ve hareket katmanı.

**2. Palet ve tipografi değişiyor.** Spec'in turkuaz `#3cc4b2` + PT Serif +
Mulish tercihi bu brief'in paleti ve Instrument Serif + Manrope ile
değiştirilir. §2'deki kontrast tablosu bağlayıcıdır; `contrast-guard` testi
yeni kurallara göre güncellenir.

**3. Veritabanı eklenmez.** Bkz. §7.

**4. Mekan görselleri: karma.** Bkz. §6.

**5. Sıralama.** Vercel kurulumu yarım kaldı. Mevcut site önce canlıya alınıp
bir temel oluşturulabilir, ya da redesign tamamlanıp tek seferde yayınlanabilir
— bu bir tercih meselesi, teknik bir kısıt değil.
