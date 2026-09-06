---
name: eden-design-system
description: EDEN Wellness Club sitesinin tasarım, erişilebilirlik ve içerik dürüstlüğü kuralları. Bu repoda HERHANGİ bir UI, stil, bileşen, metin veya içerik değişikliği yapmadan önce okunmalı — renk seçerken, yeni bileşen yazarken, animasyon eklerken, metin/görsel eklerken veya "neden böyle yapılmış" sorusuna cevap ararken.
---

# EDEN Wellness Club — Tasarım Sistemi

Bu kurallar kod yorumlarında dağınık hâlde yaşıyordu. Buradaki amaç onları
tekrarlamak değil, **her oturumda yeniden keşfedilmek zorunda kalınmasını
önlemek**. Bir kural burada yoksa `src/app/globals.css` başlığına bakın.

## 0. Önce şunu bilin

Site `development` dalında **deneysel bir yönde**: `DESIGN.md` (Handsome Frank
stil referansı) EDEN'in kendi posterine uyarlandı. `main`'de eski (yuvarlak
köşeli, gölgeli) sistem duruyor. Deneysel yön beğenilmezse `main` korunur.

Kaynaklar:
- `DESIGN.md` — düz yüzey felsefesi, gölgesizlik, hairline çerçeve, pill CTA
- `public/img/poster/canakkale-18-20-eylul-2026-duyuru.jpeg` — palet ve dil
- `src/app/globals.css` — kararların tam gerekçesiyle birlikte token'lar

## 1. Renk — üç tuzak

Palet `globals.css` içindeki `@theme inline` bloğunda. Ezberlenecek üç kural:

**Poster turuncusu (`--color-orange`, #E8792B) ASLA metin değildir.** Krem
üzerinde 2.47:1 verir. Dolgulu CTA için ayrı token var: `--color-orange-deep`
(#B4501A), beyaz metinle 5.12:1. `DESIGN.md`'nin önerdiği #FF7701 de
kullanılamaz — beyaz metinle 2.66:1, yani referans tasarımın kendi CTA'sı
erişilebilir değil. Bu bilinçli bir sapma.

**Dekoratif SVG boyarken `text-orange` YAZMAYIN.** `ink-sun`, `ink-pen`,
`ink-olive` sınıfları tam bunun için var. `contrast-guard.test.ts` metin
yazımını yakalayıp reddeder ve haklıdır — istisna işaretiyle delmek yerine
dekoratif kullanımın kendi adını kullanın.

**Kum (`--color-sand`) ve sarı (`--color-yellow`) de metin değildir.** Dolgu ve
çizgi. Sarı ayrıca "highlighter" işaretidir: hata mesajları ve dikkat çekmesi
gereken notlar sarı ZEMİN alır, kırmızı METİN değil (kırmızı bu paletin dışında
ve krem üzerinde zayıf okunuyor).

**Yeşil iki token:** `--color-olive` (#4A5A3B) yazı/çerçeve için (krem üzerinde
6.32:1), `--color-forest` (#5A6B47) POSTER ALANI zemini için (üzerine krem
metin 4.91:1). Biri yazar, diğeri zemin olur; yer değiştiremezler.

**Indigo (#160572) KALEMDİR, blok rengi değildir.** Yalnızca el yazısı
aksanlarda ve anotasyon çizgilerinde — "mavi tükenmezle sayfaya not düşülmüş"
hissi. Yapısal renk zeytindir. `DESIGN.md` indigo'yu yapısal kullanır; ikisini
birlikte yapısal yapmak paleti bulandırırdı, bu yüzden roller ayrıldı.

## 2. Biçim

- **Yarıçap yok.** Tek eğri pill butondadır (`--radius-btn: 999px`). Kart,
  panel, görsel, form alanı — hepsi keskin köşeli.
- **Gölge yok.** `--shadow-*` token'ları `none`'a ayarlı (silinmediler çünkü
  onlarca bileşen onlara başvuruyor). Ayrım **1px siyah hairline** ile yapılır
  — sistemin imza jesti. İki öğeyi ayırmak gerektiğinde boşluk büyütmek veya
  zemin rengi değiştirmek yerine çerçeve ekleyin.
- Butonlar: dolgu renk + beyaz/krem metin, gradient yok, kenarlık yok.
  Zeytin alan üzerinde `ghost` varyantı okunmaz (siyah üstüne siyah) — orada
  krem hairline + krem metin elle verilir.

## 3. Üç tipografik ses

| Ses | Font | Nerede | Nerede ASLA |
|---|---|---|---|
| Display serif | Fraunces | Marka, bölüm başlıkları, retreat adları | Gövde |
| Grotesk | Inter | Navbar, gövde, buton, form, tarih, fiyat, program | — |
| El yazısı | Caveat | Kısa aksan: tarih, konum, "Move · Breathe · Connect", doodle altyazısı | Gövde, buton, form etiketi |

- Display ölçekte harf aralığı **agresif negatiftir** (-0.05em). Havadar bir
  display başlık bu sistemin dili değildir.
- El yazısı fontu seçerken **`latin-ext` alt kümesi ZORUNLU**: Google
  Fonts'taki el yazısı fontlarının çoğunda yok ve ğ/ş/ı/İ/ç anında bozulur.
  Caveat taşıyor, bu yüzden seçildi.
- Büyük harf + geniş aralık `.type-eyebrow`a ve metadata satırlarına ayrılmıştır.
  Butonlara da verilirse ayrım anlamını yitirir.

## 4. Derinlik politikası

Sistem düz; ama **derinlik yüzeyde değil MEKÂNDA yaşar**. Kağıt hâlâ düz ve
gölgesiz, asıldığı oda gerçek bir perspektife sahip.

- Cam efekti, gradient, parlaklık, neon, koyu "AI" zemin YOK. Derinlik
  perspektif ve hareketten gelir.
- Gölge yerine **gerçek ikinci düzlem**: `Tilt` bileşeni parçanın arkasına
  negatif Z'de kum tonlu bir paspartu koyar — bir CSS gölgesi değil, çerçeveli
  baskının arkasındaki montaj kartonu.
- Araçlar: `motion/stage.tsx` (`Stage`/`Depth`), `motion/tilt.tsx`,
  `art/gallery-wall.tsx`, `art/draw-in.tsx`, `art/interactive-sun.tsx`.
  (`motion/pointer-scene.tsx` 2026-09-06'da SİLİNDİ: hero'da artık yalnızca
  güneş hareket ettiği için katman paralaksına ihtiyaç kalmadı — bkz. §4b.)

**CSS perspektifi kalıtsal DEĞİLDİR.** `transform-style: preserve-3d` zinciri
bir düğümde kırılırsa altındaki katmanlar düzleşir ve bileşen **çalışır ama
hiçbir derinlik üretmez** — fark edilmesi en zor hata türü. Araya bir
sarmalayıcı girerse ona da `[transform-style:preserve-3d]` verin.

**Sunucuda render edilen SVG'de trigonometri kullanıyorsanız sonucu
yuvarlayın.** `Math.cos`/`Math.sin` Node ile tarayıcı arasında son ondalık
basamakta ayrışabiliyor ve React bunu hydration uyuşmazlığı sayıp o alt ağacı
yamalamayı bırakıyor. `art/marks.tsx` içindeki `round()` bunun için var.

## 4b. Canlı işaretler — üç kural

**HERO'DA YALNIZCA GÜNEŞ HAREKET EDER.** Bir ara beş katman birden fareyi
takip ediyordu; kullanıcı geri bildirimiyle (2026-09-06) kaldırıldı. Sebep
yalnızca tercih değil: BİR nesne hareket ettiğinde o nesne canlı görünür, HER
ŞEY hareket ettiğinde sayfa oynak görünür. Metin, düğme ve dal SABİT kalır.

**IŞIK PARLAKLIKLA DEĞİL MÜREKKEPLE ANLATILIR.** "Işıma" için radial-gradient
halo veya `filter: blur()` parıltısı KULLANILMAZ — ikisi de sistemin düz yüzey
kuralını bozar ve kağıt dilini dijitalleştirir. Baskı geleneğinde ışık zaten
çevreye EKLENEN ÇİZGİLERLE gösterilir: `InteractiveSun` yakınlık arttıkça
saçakları uzatır, kalınlaştırır ve ikinci bir kısa saçak halkası açar.

**`DrawIn` sarmaladığı SVG'nin yollarında `pathLength={1}` ARAR.** Bu öznitelik
yolun gerçek uzunluğunu 1 birim sayar, böylece `dasharray: 1` + `dashoffset: 1`
çizgiyi gizler ve offset 0'a giderken çizgi çizilir — JS ile `getTotalLength()`
ölçmeye gerek kalmaz. Yeni bir işaret eklerken `pathLength={1}` unutulursa
animasyon SESSİZCE çalışmaz (görsel bozulmaz, sadece durağan kalır).

**BÜYÜYEN BİR SVG'YE `overflow-visible` VERİN.** SVG kökü tarayıcı
varsayılanında `overflow: hidden` taşır: `viewBox` dışına çıkan hiçbir şey
boyanmaz. `InteractiveSun`'ın saçakları ışırken 100 birimlik kutuyu 13 birim
aşıyordu ve ışık görünür KARE bir çizgide kesiliyordu (kullanıcı bildirimi,
2026-09-07). Düzeltme `viewBox`'ı büyütmek DEĞİL — o, aynı CSS alanında çizimi
küçültür ve yerleşimi de değiştirmeyi gerektirir — sınıfa `overflow-visible`
eklemektir. Etkileşimle boyu değişen her işarette bunu kontrol edin.

İki güneş bileşeni vardır, karıştırmayın:
- `art/marks.tsx` → `SunMark`: durağan, sunucuda render edilir. Kart, footer,
  şerit gibi çok sayıda örneğin bulunduğu yerlerde kullanılır.
- `art/interactive-sun.tsx` → `InteractiveSun`: istemci, pencere çapında
  işaretçi dinler. YALNIZCA hero'da, sayfada tek örnek olarak.

## 5. Hareket azaltma — pazarlık konusu değil

`prefers-reduced-motion: reduce` altında **3B tamamen KAPANIR, yavaşlatılmaz**:
`perspective: none`, koltuk dönüşümleri `none`, imleç halkası hiç render
edilmez, perde kurulmaz. Perspektifli hareket vestibüler rahatsızlığın en güçlü
tetikleyicilerinden biridir; süreyi 0.01ms'e indirmek yeterli bir uyum değildir.

Süre kısaltmanın yetmediği iki durum daha:
- `filter: blur()` bir başlangıç durumudur, geçiş değil — `BlurFade` bu yüzden
  hareket azaltmada animasyonu hiç KURMAZ.
- Sonsuz döngüler son karelerinde donar. Akan şerit bu yüzden başlangıç
  konumunda sabitlenir, hızlandırılmaz.

`useReducedMotion()` ve `useFinePointer()` (`src/lib/hooks/`) `useSyncExternalStore`
kullanır — efekt içinde senkron `setState` ile medya sorgusu okumayın, basamaklı
render'a ve ilk boyamada yanlış kareye yol açar.

## 6. İçerik dürüstlüğü — en katı kural

Site **canlı bir işletmeye** ait. Var olmayan bir şeyi varmış gibi göstermek
gerçek müşteriyi yanıltır.

- **`isPlaceholder: true` kayıtlar** görünür "ÖRNEK" rozeti taşır, fiyatı DOM'a
  hiç girmez, tarih yerine "yakında" yazar ve CTA'sı gerçek bağlantı değil
  `disabled` bir `<button>`dur.
- **Kolaj yer tutucuları** (`src/content/collage.ts`, `isFiller: true`)
  geliştirmede sarı "filler" rozetiyle işaretlenir. Gerçek varlık konduğunda
  alan `false` yapılır.
- **EDEN'in henüz gerçekleşmiş etkinliği YOK** (ilk retreat 18-20 Eylül 2026).
  Ana sayfadaki bölüm bu yüzden ARŞİV DEĞİL MOOD DUVARIDIR (`home/mood-wall.tsx`,
  2026-09-06). Eskiden "Geçmiş Retreatlerden" başlığını taşıyor ve altına bir
  özür satırı yazıyordu; bölümün İDDİASINI değiştirmek özrü yazmaktan daha
  doğru bir çözümdü. `alt` metinleri ne görüldüğünü (bir poster, bir kolaj
  panosu) olduğu gibi anlatır. Gerçek etkinlik fotoğrafları geldiğinde AYRI bir
  arşiv bölümü açılabilir.
- **EDEN BİR ORGANİZASYON MARKASIDIR.** Otel İŞLETMEZ, eğitmen ÇALIŞTIRMAZ.
  Mekânlar ve hocalar bağımsızdır; her retreat için ayrı seçilir ve İŞ ORTAĞI
  olarak yer alırlar. "Aynı otelde", "EKİBİMİZ", "Hocalarımız" gibi aidiyet
  kuran ifadeler KULLANILMAZ — kimin neyden sorumlu olduğu konusunda
  ziyaretçiyi yanıltır. Kamp detayında mekân adını vermek GEREKLİDİR (katılımcı
  nerede kalacağını bilmeli) ve oradaki "Kalacağınız Yer" / "Otelin Resmi
  Sitesi" çerçevesi doğrudur: ayrı bir işletme olduğunu söyler.
- **Hocalar gerçek kişilerdir.** `bio`, `certifications`, `photo` yalnızca
  kişiden doğrulanmış bilgi geldiğinde doldurulur. Fotoğraf yoksa monogram
  gösterilir, stok fotoğraf konmaz.
- **Uydurma dosya yolu icat etmeyin.** Var olmayan bir görsele/videoya
  başvurmak çalışmayan bir kontrol üretir.

## 7. İki dillilik

- Her yeni dize `messages/tr.json` VE `messages/en.json`'a girer;
  `messages.test.ts` pariteyi ve boş değer olmamasını zorlar.
- "Membership" Türkçe sürümde de çevrilmez — kulübün programının adıdır.
- "Move · Breathe · Connect" çevrilmez — markanın kendi sloganı.
- Türkçe için font alt kümesinde `latin-ext` zorunlu.

## 8. Site kapsamı

Üç sayfa: **Yaklaşan Etkinlikler** (`/kamplar`), **Hakkımızda**, **Membership**.
Artı `/kamplar/[slug]`, `/basvuru`, `/basvuru-alindi` ve footer'daki yasal
sayfalar. Blog, Hocalar, Deneyim, Mekan, SSS, İletişim **silindi** (2026-09-05).

- Mega menü yok, duyuru çubuğu yok.
- Yoga/pilates retreat DIŞINDA aktivite kategorisi eklenmez.
- **Membership'in arka ucu YOKTUR** ve olmayacaktır (rafa kaldırıldı): form
  hiçbir yere istek atmaz, sahte kalıcılık taklit etmez, başarı metni üyeliğin
  henüz açık olmadığını söyler. Ödeme/kimlik doğrulama/üye paneli/abonelik
  KURULMAZ.
- Bir sayfa silinirse `STATIC_PATHS` (`lib/seo/sitemap-entries.ts`) ve
  `NAV_ITEMS` (`lib/config/site.ts`) da temizlenir. İçerik verisinin durması
  sayfanın var olduğu anlamına gelmez.

## 9. Değişiklikten sonra

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```

Bu repoda testler tasarım kararlarını da kilitler — kırılan bir test çoğu zaman
bir kuralın ihlalidir, güncellenecek bir beklenti değil:

- `contrast-guard.test.ts` — palet token'ları, turuncu/kum'un metin olarak
  kullanılmaması
- `messages.test.ts` — tr/en paritesi
- `navbar.test.ts` — hangi rotaların koyu hero'su var (şeffaf navbar güvenliği)
- `sitemap-entries.test.ts` — silinmiş sayfaların sitemap'e sızmaması
- `content.test.ts`, `content-readiness.test.ts` — içerik bütünlüğü

Görsel/etkileşimli değişiklikleri **tarayıcıda doğrulayın**. Bu sitede tilt
yalnızca fare üzerine gelince, dolly yalnızca kaydırınca, perde yalnızca rota
değişince çalışır — hiçbiri statik HTML'de görünmez. Playwright MCP bunun için
bağlı (`.mcp.json`).
