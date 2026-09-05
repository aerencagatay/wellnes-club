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
 * Gerçek görsel konduğunda alan `false` yapılır ve rozet kendiliğinden kaybolur.
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
 * Poster taşıyan bir yer tutucu yuva üretir. Gerçek bir varlık koyulana kadar
 * kullanılır; `isFiller: true` olduğu için geliştirmede işaretli görünür.
 */
export function fillerSlot(id: string): CollageSlot {
  return { id, src: POSTER_SRC, alt: POSTER_ALT, isFiller: true }
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
 * Arşiv ("Previously at EDEN") ızgarasının yuvaları.
 *
 * DÜRÜSTLÜK NOTU: EDEN'in henüz GERÇEKLEŞMİŞ bir etkinliği yok — takvimdeki
 * tek etkinlik Eylül 2026'da. Bu yuvalar "geçmiş etkinlikten kare" DİYE
 * SUNULMAZ: bugün duyuru posterini taşıyorlar, her yuvanın `alt` metni bunun
 * bir poster olduğunu söylüyor ve bölüm başlığının altındaki açıklama
 * ziyaretçiye durumu doğrudan bildiriyor. İlk etkinlik yaşandığında gerçek
 * fotoğraflar buraya gelir.
 */
export const ARCHIVE_SLOTS: CollageSlot[] = [
  fillerSlot('archive-1'),
  fillerSlot('archive-2'),
  fillerSlot('archive-3'),
  fillerSlot('archive-4'),
  fillerSlot('archive-5'),
]

/** Akan kolaj şeridinin parçaları — gerçek kolaj panoları. */
export const MARQUEE_SLOTS: CollageSlot[] = COLLAGE_BOARDS
