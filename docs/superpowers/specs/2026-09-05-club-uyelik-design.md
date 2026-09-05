# EDEN Club Üyelik — Tasarım Belgesi

**Tarih:** 2026-09-05
**Durum:** İncelemede
**Önceki belge:** `2026-07-31-serenity-retreats-design.md` (site temeli)

## 1. Amaç ve kapsam

Site bugün tek yönlü: ziyaretçi okur, form doldurur, e-posta gider. Bu belge
siteye **kimliği olan bir üye kitlesi** ekler — başvuran, onaylanan, giriş
yapabilen, yorum bırakabilen ve etkinliklere önce erişebilen kişiler.

Üyelik dört şey sağlar:

1. **Başvuru ve onay** — başvuru siteden gelir, onay kulüp sahibinde kalır.
   Onaylanan üye WhatsApp grubuna elle eklenir (site grup yönetimi yapmaz).
2. **Doğrulanmış yorum** — sitedeki üye yorumları artık uydurma değil, giriş
   yapmış gerçek bir üyeye ait.
3. **Erken ve ayrıcalıklı erişim** — üyeler etkinliklere genel açılıştan önce
   erişir; bazı etkinlikler tamamen üyelere özeldir.
4. **Görünür topluluk** — toplam üye sayısı sitede gerçek veriden gösterilir.

### Kapsam dışı

- **Online ödeme.** Üyelik ücretsiz, rezervasyon hâlâ form + WhatsApp üzerinden.
- **WhatsApp API entegrasyonu.** Gruba ekleme elle yapılır; site yalnızca grup
  bağlantısını onaylanmış üyeye gösterir.
- **Şifre.** Şifre yok, şifre sıfırlama yok (bkz. §5).
- **Sosyal giriş** (Google/Apple), **telefon OTP**, **iki faktörlü doğrulama**.
- **Üyelik ön koşullarının otomatik denetimi** — kural motoru yazılmaz (bkz. §12).
- **Üyeler arası mesajlaşma, profil sayfası, bildirim.**

## 2. Alınan kararlar

| Karar | Seçim | Gerekçe |
|---|---|---|
| Depolama | Upstash Redis | Zaten kurulu; yeni servis/faturalama yok. Tüm işlemler O(1)/O(log n) |
| Kimlik | E-posta bağlantısı (şifresiz) | Resend zaten kurulu; şifre saklamamak en güvenli seçenek |
| Oturum | Sunucu tarafı (Redis) + imzalı çerez | Üyeliği iptal etmek tek komut; JWT'de iptal listesi gerekirdi |
| İmza | Web Crypto HMAC-SHA256 | Yeni bağımlılık yok (`jose` vb. gerekmez) |
| Onay | Elle — e-postada tek tık + `/yonetim` | Onay kulüp sahibinde kalır; moderasyon için yüzey zaten gerekli |
| Yorum | Öntanımlı `pending`, elle yayınlanır | Üye bile olsa denetimsiz metin yayınlanmaz |
| Erken erişim | Tarih penceresi **+** üyelere özel etkinlik | Kullanıcı kararı, 2026-09-05 |
| İçerik odağı | Yalnızca yoga / retreat / pilates | Kullanıcı kararı, 2026-09-05 |
| Sıralama | Yol haritası | Kullanıcı "sonrasında" dedi |

## 3. Aşamalandırma

Uygulama planı bu sırayı izler. **A tek başına yayına alınabilir.**

**Aşama A — İçerik daralması** *(kimlik doğrulama yok; bu belgeden bağımsız
olarak 2026-09-05'te uygulandı)*

- "Sağlıklı Yaşam" mega menüsü ve 9 maddelik aktivite listesi kaldırıldı;
  birincil gezinme yalnızca *Yaklaşan Etkinlikler* + *Hakkımızda*.
- Koşu / doğa yürüyüşü / kitap kulübü örnek etkinlikleri ve karşılık gelen
  `EventCategory` değerleri kaldırıldı. Yoga, pilates ve meditasyon kaldı.

**Aşama B — Üyelik** *(bu belgenin gövdesi)*

- Veri modeli, başvuru, onay, giriş, üye alanı, yorumlar, rezervasyon kapıları,
  `/yonetim`, üye sayısı.

**Aşama C — Yol haritası** *(inşa edilmiyor, bkz. §12)*

## 4. Veri modeli

Tümü Upstash Redis. `<id>` değerleri `crypto.randomUUID()`.

| Anahtar | Tip | İçerik |
|---|---|---|
| `member:<id>` | HASH | `name`, `email`, `phone`, `referral`, `status`, `appliedAt`, `decidedAt`, `locale` |
| `member:byEmail:<email>` | STRING | `<id>` — tekillik indeksi |
| `members:pending` | ZSET | skor = başvuru zamanı; yönetim kuyruğu |
| `members:approved` | ZSET | skor = onay zamanı; **üye sayısı = ZCARD** |
| `members:rejected` | ZSET | reddedilenler |
| `session:<id>` | STRING | `<memberId>` veya `admin`, TTL 30 gün |
| `login:<tokenHash>` | STRING | `<memberId>` veya `admin`, TTL 15 dk, kullanımda silinir |
| `login:cooldown:<email>` | STRING | e-posta başına gönderim frenlemesi, TTL 60 sn |
| `comment:<id>` | HASH | `memberId`, `campSlug`, `body`, `status`, `createdAt` |
| `comments:byCamp:<slug>` | ZSET | skor = oluşturma zamanı |
| `comments:pending` | ZSET | moderasyon kuyruğu |

**E-posta normalizasyonu:** indeks anahtarı küçük harfe çevrilmiş ve kırpılmış
e-postadan üretilir. Aksi halde `Ali@x.com` ile `ali@x.com` iki ayrı üye olur.

**Neden ilişkisel veritabanı değil:** bu şemada tek bir çoktan-çoğa ilişki ve
tek bir toplama (`ZCARD`) var; ikisi de Redis'in birincil veri yapılarıyla
doğrudan karşılanıyor. Postgres'in getireceği sorgu esnekliğinin karşılığı yeni
bir servis, yeni bir bağımlılık ve ayrı faturalama olurdu — bu ölçekte ödenmeye
değmez. Sıralama (Aşama C) da Redis'in en güçlü olduğu yapıya, sorted set'e
denk düşüyor.

## 5. Kimlik doğrulama

### Akış

1. Üye e-postasını girer → hız sınırı + Turnstile + e-posta başına 60 sn fren.
2. 32 byte rastgele jeton üretilir. Redis'e **yalnızca SHA-256 özeti** yazılır
   (15 dk TTL). Jetonun kendisi hiçbir yerde saklanmaz ve loglanmaz.
3. Resend ile bağlantı gider: `GET /api/uye/dogrula?token=…`
4. Route handler özeti doğrular, **anahtarı siler (tek kullanımlık)**, oturum
   oluşturur, çerezi kurar ve `/kulup`'a 302 döner.

### Oturum çerezi

`eden_session` — `httpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, 30 gün.
Değer: `<sessionId>.<HMAC-SHA256(sessionId)>`. Sunucu imzayı sabit zamanlı
karşılaştırmayla doğrular, sonra `session:<id>`'yi okur. Çerez kendi başına
yetki taşımaz — Redis'te karşılığı yoksa geçersizdir.

### Üç güvenlik kuralı

Bunlar sessizce yanlış yapılırsa geri dönüşü zordur:

1. **Giriş endpoint'i her zaman aynı yanıtı döner** ("bağlantı gönderildi"),
   e-posta üye olsun ya da olmasın. Aksi halde endpoint bir *üyelik sorgulama
   aracına* dönüşür: yabancı biri e-posta girip kimin üye olduğunu öğrenebilir.
   Aynı gerekçeyle başvuru endpoint'i de "bu e-posta zaten kayıtlı" demez.
2. **Jeton URL'de kalmaz.** Doğrulama bir route handler'dır, sayfa değildir:
   jeton HTML'e basılmaz, tarayıcı geçmişinde sayfa olarak durmaz ve `Referer`
   başlığıyla dışarı sızmaz. Yanıt `Cache-Control: no-store` taşır.
3. **Erişim kısıtlaması sunucuda uygulanır.** Arayüzde buton saklamak yeterli
   değil; `/api/inquiry` üyelik durumunu kendisi denetler (bkz. §6). Aksi halde
   formu doğrudan POST eden biri kapıyı atlar.

### Yönetici girişi

Ayrı bir mekanizma yok: `ADMIN_EMAIL` ile giriş istendiğinde aynı bağlantı
akışı çalışır, oturum `admin` olarak işaretlenir. Şifre, ikinci bir kullanıcı
tablosu ya da üçüncü bir kavram gerekmez.

### Özellik bayrağı

Üyelik, Upstash **ve** `MEMBER_SESSION_SECRET` yapılandırıldığında etkindir.
Yapılandırma eksikse `/kulup` "yakında" durumunda render edilir ve yazma
endpoint'leri 503 döner. Sitenin geri kalanı bugünkü gibi çalışmaya devam eder.

Bu, `checkRateLimit`'in "yapılandırma eksikken açık kal" felsefesinden bilinçli
bir ayrılıştır: hız sınırında açık kalmanın maliyeti biraz fazla e-postadır, ama
oturum imzalama anahtarı olmadan "açık kalmak" imzasız oturum kabul etmek
demektir. Kimlik doğrulamada doğru varsayılan kapalı kalmaktır.

## 6. Rezervasyon erişim modeli

`CampSession` iki alan kazanır:

```ts
/** 'public' herkese açık; 'members-only' yalnızca onaylı üyeler. */
access: 'public' | 'members-only'
/** Genel rezervasyonun açıldığı gün. Üyeler bu tarihten ÖNCE de rezervasyon
 *  yapabilir. Verilmezse etkinlik zaten herkese açıktır. */
publicOpensAt?: string // 'YYYY-MM-DD'
```

Tek bir saf fonksiyon karar verir — saat okumaz, `today` dışarıdan gelir:

```
bookingStateFor(camp, isMember, today):
  access === 'members-only'
      → üye değilse  'locked'      (rezervasyon yok, üyelik daveti gösterilir)
      → üyeyse       'open'
  publicOpensAt var ve today < publicOpensAt
      → üye değilse  'opens-soon'  (genel açılış tarihi gösterilir)
      → üyeyse       'early'       ("üye erken erişimi" rozeti)
  aksi halde         'open'
```

**Uygulama iki katmanda:** arayüz durumu *gösterir*, `/api/inquiry` durumu
*zorlar*. `locked` veya `opens-soon` durumundaki bir kampa gelen talep 403 ile
reddedilir. İki katman aynı fonksiyonu çağırır — kural kopyalanmaz.

Kamp detay sayfası statik render edilmeye devam eder; üyelik durumuna bağlı
parçalar `/api/uye/ben`'i çağıran küçük bir istemci bileşenidir. Böylece sayfa
önbelleklenebilir kalır ve hiçbir üyeye özel bilgi statik HTML'e sızmaz.

## 7. Yorumlar

- Yorum bırakmak için giriş yapmış **ve** durumu `approved` olmak gerekir.
- Yorum yalnızca **bitmiş** bir kampa bırakılabilir (`endDate < today`).
  Yaşanmamış bir etkinliğe yorum, sitedeki en değerli şeyi — yorumların gerçek
  olması — bozar. *(Aşama C bunu gerçek katılım kaydına sıkılaştırır.)*
- Üye başına kamp başına **tek** yorum; düzenlenebilir, düzenleme yeniden
  `pending`'e düşer.
- Gövde 20–1000 karakter, düz metin (HTML yok, işaretleme yok).
- Öntanımlı durum `pending`. Yayınlama `/yonetim`'den elle.
- Yayınlanınca `revalidatePath` ile ilgili kamp sayfası ve ana sayfa tazelenir.

**Görünen ad:** üye adının yalnızca adı ve soyadının baş harfi gösterilir
("Elif D.") — üye listesi bu yolla dışarıya dökülmesin. E-posta ve telefon
hiçbir genel yüzeyde görünmez.

`testimonials.ts` yayınlanmış yorumlarla değiştirilir. Yayınlanmış yorum yoksa
`CommunityWall` hiç render edilmez — boş bir bölüm ya da uydurma bir yorum
göstermek yerine bölüm yok olur.

## 8. Üye sayısı

`ZCARD members:approved`. Bir sabitle korunur: sayı `MEMBER_COUNT_MIN_DISPLAY`
(öntanımlı 10) altındaysa rakam yerine niteliksel bir cümle gösterilir.
Açılışta "1 üye" yazmak kulübü küçültür, ama sayıyı şişirmek yalan olurdu — bu
sabit ikisinden de kaçınır. Sayı 5 dakikalık ISR ile tazelenir.

## 9. Sayfalar, bileşenler ve endpoint'ler

**Sayfalar** (her biri `tr` ve `en`):

| Yol | İçerik |
|---|---|
| `/kulup` | Üyelik anlatımı, üye sayısı, avantajlar, başvuru formu — **veya** giriş yapılmışsa üye alanı (WhatsApp grup bağlantısı, yorumlarım, üyelikten çık) |
| `/kulup/giris` | E-posta ile giriş bağlantısı isteme |
| `/yonetim` | Bekleyen başvurular, üye listesi, yorum moderasyonu |

`/kulup`'un birincil gezinmeye eklenip eklenmeyeceği Aşama B'de kullanıcıya
sorulur — bugünkü karar gezinmenin iki maddede kalması.

**Endpoint'ler:**

| Yöntem ve yol | İş |
|---|---|
| `POST /api/uye/basvuru` | Başvuru (ad, e-posta, telefon, referans, onay) |
| `POST /api/uye/giris` | Giriş bağlantısı gönder |
| `GET /api/uye/dogrula` | Jetonu tüket, oturum kur, yönlendir |
| `POST /api/uye/cikis` | Oturumu sil |
| `GET /api/uye/ben` | Oturum durumu (istemci kapıları için), `no-store` |
| `POST /api/uye/yorum` | Yorum oluştur/güncelle |
| `DELETE /api/uye/hesap` | Üyelikten çık ve veriyi sil (KVKK) |
| `GET /api/yonetim/karar` | E-postadaki tek-tık onay/red (imzalı, tek kullanımlık) |
| `POST /api/yonetim/*` | Panel işlemleri (onay, red, yayınla, kaldır) |

**Yeniden kullanılan altyapı:** `lib/security/turnstile`,
`lib/security/rate-limit`, `lib/mail`, `lib/utils/validation` (Zod ve
`flattenZodErrors` hata anahtarı sözleşmesi), `components/inquiry/consent-checkbox`,
`components/inquiry/field`.

**Düzeltilecek mevcut kusur:** `checkRateLimit` şu an `serenity:inquiry` ön
ekini sabit kodluyor. Yeni endpoint'ler eklendiğinde hepsi talep formuyla aynı
kovayı paylaşır — bir üyenin yorum denemesi ziyaretçinin rezervasyon formunu
tüketebilir. Fonksiyon adlandırılmış kova parametresi alacak; mevcut çağrı
davranışı değişmeyecek.

## 10. Hata yönetimi

| Durum | Davranış |
|---|---|
| Geçersiz / kullanılmış / süresi geçmiş jeton | Nötr "bağlantı geçersiz" sayfası ve yeniden isteme bağlantısı. Hangisi olduğu söylenmez |
| Redis erişilemez | Yazma işlemleri 503 ve "sonra tekrar dene"; okuma yüzeyleri (üye sayısı, yorumlar) sessizce gizlenir, sayfa çökmez |
| Resend teslim edemez | Başvuru **kaydedilir** ve yönetime düşer; kullanıcıya başarı gösterilir. Mevcut `sendInquiryEmails` deseniyle aynı ödünç |
| Onaylı olmayan üye korumalı işlem denerse | 403; `pending` ve `rejected` için ayrı metin |
| Aynı e-posta ikinci kez başvurursa | 200 ve aynı nötr onay metni; ikinci kayıt oluşturulmaz |

## 11. KVKK ve kişisel veri

Ad, e-posta ve telefon saklamak yeni bir sorumluluktur:

- Başvuru formunda **açık onay** (mevcut `ConsentCheckbox`).
- `/kvkk` ve `/gizlilik` metinlerine üye verisi, saklama süresi ve WhatsApp
  grubu maddeleri eklenir.
- Üye alanında **"üyelikten çık ve verilerimi sil"** — `member:*` kayıtları,
  indeks, oturumlar ve yorumlar silinir. Silme hakkı vermeden kişisel veri
  toplamak KVKK'ya aykırıdır; bu isteğe bağlı bir özellik değildir.
- Reddedilen başvurular 12 ay sonra silinir (`members:rejected` skoruna göre
  yönetim panelinden toplu temizlik).
- Telefon numarası yalnızca yönetim yüzeyinde görünür.

## 12. Yol haritası — inşa edilmiyor

Kullanıcı kararı (2026-09-05): kaydedilsin, şimdilik üzerine düşünülmesin.

**Üyelik ön koşulları.** Üyelik açık başvuruya kapatılıp koşula bağlanacak:
başvuranın ya daha önce bir etkinliğe katılmış olması, ya da mevcut bir üyenin
referansı gerekecek — "üyelerin katıldığı etkinliklerde referanssız gelen
olmayacak". *Aşama B bunu şimdiden destekleyecek şekilde `referral` alanını
topluyor; denetim elle yapılıyor, kural motoru yazılmıyor.*

**Tanışma etkinlikleri.** Kimsenin kimseyi tanımadığı, yeni potansiyel üyelere
açık etkinlik türü — referans zincirinin giriş kapısı. Muhtemel biçim: `access`
alanına `'intro'` üçüncü bir değer olarak eklenmesi.

**Ücretli üyelik.** Üyelik ileride ücretli hale gelebilir. Bu, kapsam dışı
bırakılan online ödemeyi geri getirir ve ayrı bir tasarım turu gerektirir.

**Katılım sıralaması.** En çok etkinliğe katılan üyelerin sıralaması.
`attendance:<campSlug>` SET ve `members:attendanceCount` ZSET ile karşılanır;
katılım işaretlemesi `/yonetim`'den elle. Sıralamayı yayınlamak üye adlarını
ilişkilendirilebilir hale getirdiği için gizlilik açısından ayrıca düşünülmeli.

## 13. Test stratejisi

Mevcut yığın Vitest; DOM testi yok, testler saf mantığa ve içerik bütünlüğüne
odaklanıyor. Aynı çizgi sürdürülür:

- **Zod şemaları** — başvuru, giriş, yorum. `validation.error-keys.test.ts`
  deseniyle: her dal gerçek girdiyle taranıp İngilizce varsayılan mesaj
  sızdırmadığı doğrulanır.
- **HMAC** — imzala/doğrula turu; kurcalanmış imza, kırpılmış değer ve yanlış
  anahtar reddedilir.
- **Bağlantı jetonu** — özet saklanıyor (jetonun kendisi değil), tek
  kullanımlık (ikinci kullanım reddedilir), süresi geçmiş jeton reddedilir.
- **`bookingStateFor`** — beş durumun tamamı için doğruluk tablosu; sınır günü
  (`today === publicOpensAt`) açıkça test edilir.
- **Yorum uygunluğu** — bitmemiş kamp reddedilir, üye başına tek yorum,
  düzenleme `pending`'e düşürür.
- **Redis katmanı** — `@upstash/redis` bugün dinamik `import` ile yüklendiği
  için testler bellek içi bir taklit enjekte eder; gerçek servise bağlanılmaz.
- **Hız sınırı kova yalıtımı** — farklı adlandırılmış kovalar birbirini
  tüketmiyor.
- **İçerik bütünlüğü** — `content.test.ts`'e: her kampın `access` değeri
  geçerli, `publicOpensAt` biçimi doğru ve `startDate`'ten önce.

**Kasıtlı test edilmeyen:** e-posta teslimi (Resend), Turnstile'ın kendi
doğrulaması, Redis'in kendi dayanıklılığı.

## 14. Ortam değişkenleri

`.env.example`'a eklenir:

```
MEMBER_SESSION_SECRET=            # 32+ byte rastgele; oturum çerezi imzası
ADMIN_EMAIL=                      # yönetim girişine izinli tek e-posta
NEXT_PUBLIC_WHATSAPP_GROUP_URL=   # onaylı üyeye gösterilen grup davet bağlantısı
```

Mevcut `UPSTASH_REDIS_REST_*`, `RESEND_API_KEY` ve `TURNSTILE_*` değişkenleri
yeniden kullanılır; yeni servis yoktur.
