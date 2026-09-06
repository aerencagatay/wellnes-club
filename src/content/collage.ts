import type { Localized } from './types'

/**
 * =============================================================================
 * KOLAJ KAYDI
 * =============================================================================
 * Zine/kolaj tasarım yönü çok sayıda görsel parça ister (retreat posterleri,
 * arşiv kareleri, kolaj lekeleri). Bu dosya o parçaların TEK kaydıdır.
 *
 * NEDEN TEK BİR DOSYADA: kolaj yuvaları birden çok bileşene dağılmış durumda.
 * Her biri kendi görsel yolunu tutsaydı, varlıklar değiştiğinde ayrı ayrı
 * arama yapmak gerekirdi. Buradan geçirmek "görselleri değiştir" işini tek bir
 * düzenlemeye indirir.
 *
 * `isFiller` ALANI NE İŞE YARAR: `true` olan yuva gerçek bir varlık DEĞİL, yer
 * tutucudur. `CollageFrame` bu yuvaları YALNIZCA geliştirme ortamında sarı bir
 * "filler" rozetiyle işaretler, böylece yer tutucular sessizce yayına kaçamaz.
 *
 * BUGÜN HİÇ YER TUTUCU YOK — buradaki yuvaların hepsi gerçek EDEN varlığı.
 * Alan yine de duruyor: ileride gerçek varlık gelmeden yeni bir yuva açmak
 * gerekirse işaretleme mekanizması hazır olsun (ve o yuva sessizce yayına
 * kaçamasın).
 */

export type CollageSlot = {
  id: string
  src: string
  alt: Localized
  /** `true` olduğu sürece bu yuva gerçek bir varlık DEĞİL, yer tutucudur. */
  isFiller: boolean
}

/**
 * Retreat duyuru posteri — 18-20 Eylül 2026, Assos. Kare (1:1) bir görsel.
 */
const POSTER_SRC = '/img/poster/canakkale-18-20-eylul-2026-duyuru.jpeg'

const POSTER_ALT: Localized = {
  tr: 'EDEN Wellness Club yoga retreat duyuru posteri: zeytin yeşili zemin üzerinde turuncu güneş, el çizimi yoga figürleri ve "18-20 Eylül, Asos, Çanakkale" yazısı',
  en: 'EDEN Wellness Club yoga retreat announcement poster: an orange sun on an olive green field, hand-drawn yoga figures and the line "September 18-20, Asos, Çanakkale"',
}

/**
 * KOLAJ PANOLARI — kullanıcının ürettiği GERÇEK varlıklar (2026-09-06),
 * `public/img/collage/`. Üçü de 3:4 dikey; şerit yuvaları bu orana göre
 * kurulmuştur (bkz. CollageMarquee), kare bir çerçeve panoların yarısını
 * kırpardı.
 *
 * ALT METİNLERİ NE DER, NE DEMEZ — ÖNEMLİ: bu panolar birer MOOD BOARD'dur;
 * içlerindeki fotoğraflar EDEN'in gerçekleşmiş bir etkinliğinden DEĞİLDİR
 * (kulübün ilk retreat'i Eylül 2026'da). Bu yüzden `alt` metinleri panonun ne
 * olduğunu — kolaj panosu — söyler ve hiçbiri "etkinlikten bir an" diye
 * sunulmaz. Bu, sitenin genelindeki dürüstlük kuralının aynısı (bkz.
 * events.ts ve past-gallery.tsx).
 */
export const COLLAGE_BOARDS: CollageSlot[] = [
  {
    id: 'pano-1',
    src: '/img/collage/eden_pano1.jpeg',
    alt: {
      tr: 'Kolaj panosu: "Nature is the new nightclub" yazısı, bir bardak buzlu matcha, meditasyon yapan figürün üzerine yapıştırılmış pembe-sarı güneş, yoga pozlarından oluşan kontakt baskı ve denizde yüzen iki kişi',
      en: 'Collage board: the line "Nature is the new nightclub", a glass of iced matcha, a pink and yellow sun pasted over a seated meditating figure, a contact sheet of yoga poses, and two people swimming in the sea',
    },
    isFiller: false,
  },
  {
    id: 'pano-2',
    src: '/img/collage/eden_pano2.jpeg',
    alt: {
      tr: 'Kolaj panosu: çimenlik üzerine yerleştirilmiş "lay on the ground" yazılı çizim kartı, mavi tükenmez kalemle çizilmiş zeytin dalı, ormanda devrilmiş bir ağaç gövdesine uzanmış kişi ve bir kâse yaban mersini',
      en: 'Collage board: a drawn card reading "lay on the ground" laid over grass, an olive branch sketched in blue ballpoint, a person stretched out on a fallen tree trunk in a forest, and a bowl of blueberries',
    },
    isFiller: false,
  },
  {
    id: 'pano-3',
    src: '/img/collage/eden_pano3.jpeg',
    alt: {
      tr: 'Kolaj panosu: mavi kalemle işaretlenmiş yoga pozu kontakt baskısı, uzun masada suluboya yapan bir grup, rüzgârda dalgalanan çayır, "Yes to new adventures" yazılı yol tabelası ve meyveli bir kâse',
      en: 'Collage board: a contact sheet of yoga poses annotated in blue pen, a group painting with watercolours at a long table, a meadow moving in the wind, a road sign reading "Yes to new adventures", and a bowl of fruit',
    },
    isFiller: false,
  },
]

/**
 * MOOD DUVARI — "EDEN'in Dünyası".
 *
 * BU BÖLÜM BİR ARŞİV DEĞİLDİR ve öyle olduğunu iddia etmez. Daha önce
 * "Geçmiş Retreatlerden / Previously at EDEN" başlığını taşıyordu; EDEN'in
 * henüz gerçekleşmiş bir etkinliği olmadığı için (ilk retreat 18-20 Eylül
 * 2026) o başlığın altında ne gösterilirse gösterilsin, ziyaretçi onu
 * yaşanmış bir etkinliğin kaydı sanma riski taşıyordu. Bölüm 2026-09-06'da
 * mood duvarına çevrildi (kullanıcı kararı): kulübün GÖRSEL DÜNYASINI
 * gösteriyor, geçmişini değil.
 *
 * Bu değişikliğin ikinci bir kazancı: artık YER TUTUCU YOK. Duvardaki dört
 * parçanın dördü de gerçek EDEN varlığı — üç kolaj panosu ve kulübün kendi
 * duyuru posteri. Sayıyı dörtte tutmak bilinçli: elimizde gerçek beşinci bir
 * parça yok ve bir yuvayı doldurmak için yer tutucu koymak, bölümü yeniden
 * "boşluk kapatan" bir şeye çevirirdi.
 *
 * Gerçek etkinlik fotoğrafları geldiğinde AYRI bir arşiv bölümü açılabilir;
 * bu duvar o zaman da kendi işini görmeye devam eder.
 */
export const MOOD_SLOTS: CollageSlot[] = [
  ...COLLAGE_BOARDS,
  {
    id: 'poster-assos',
    src: POSTER_SRC,
    alt: POSTER_ALT,
    isFiller: false,
  },
]

/** Akan şerit artık görsel taşımıyor (tipografik banda dönüştü), bu yüzden
 *  burada bir yuva listesi de tutulmuyor. Bkz. art/collage-marquee.tsx. */
