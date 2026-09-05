import type { Localized } from './types'

/**
 * =============================================================================
 * KOLAJ YER TUTUCU KAYDI
 * =============================================================================
 * Zine/kolaj tasarım yönü çok sayıda görsel parça ister (retreat posterleri,
 * arşiv kareleri, kolaj lekeleri). EDEN'in bu parçalar için gerçek illüstrasyon
 * varlıkları HENÜZ YOK — kullanıcı bunları kendisi üretecek (karar, 2026-09-05).
 *
 * O ana kadar her kolaj yuvası EDEN'in GERÇEK duyuru posterini gösterir. Bu
 * bilinçli bir tercih: stok fotoğraf veya uydurma bir görsel yolu koymak
 * yerine, sitede zaten var olan ve markayı doğru temsil eden tek görseli
 * kullanmak.
 *
 * NEDEN TEK BİR DOSYADA: kolaj yuvaları beş ayrı bileşene dağılmış durumda.
 * Her biri kendi yer tutucu yolunu tutsaydı, gerçek görseller geldiğinde beş
 * dosyada ayrı ayrı arama yapmak gerekirdi. Buradan geçirmek "yer tutucuyu
 * değiştir" işini tek bir düzenlemeye indirir.
 *
 * GERÇEK GÖRSELLER GELDİĞİNDE: `FILLER` yerine ilgili yuvaya gerçek dosyayı
 * yazın ve `isFiller` alanını `false` yapın. Arayüz `isFiller` olan yuvaları
 * geliştirme ortamında işaretler (bkz. CollageFrame), böylece yer tutucular
 * sessizce yayına kaçamaz.
 */

export type CollageSlot = {
  id: string
  src: string
  alt: Localized
  /** `true` olduğu sürece bu yuva gerçek bir varlık DEĞİL, yer tutucudur. */
  isFiller: boolean
}

/**
 * Tek gerçek varlık: 18-20 Eylül 2026 Assos retreat'inin duyuru posteri.
 * Kare (1:1) bir görseldir — kolaj yuvaları bunu bilerek kırpar.
 */
const FILLER_SRC = '/img/poster/canakkale-18-20-eylul-2026-duyuru.jpeg'

const FILLER_ALT: Localized = {
  tr: 'EDEN Wellness Club yoga retreat duyuru posteri: zeytin yeşili zemin üzerinde turuncu güneş, el çizimi yoga figürleri ve "18-20 Eylül, Asos, Çanakkale" yazısı',
  en: 'EDEN Wellness Club yoga retreat announcement poster: an orange sun on an olive green field, hand-drawn yoga figures and the line "September 18-20, Asos, Çanakkale"',
}

/**
 * Bir kolaj yuvası üretir. `id` yalnızca React anahtarı ve geliştirme
 * ortamındaki yer tutucu işareti için kullanılır.
 */
export function fillerSlot(id: string): CollageSlot {
  return { id, src: FILLER_SRC, alt: FILLER_ALT, isFiller: true }
}

/**
 * Arşiv ("Previously at EDEN") ızgarasının yuvaları.
 *
 * DÜRÜSTLÜK NOTU: EDEN'in henüz GERÇEKLEŞMİŞ bir etkinliği yok — takvimdeki
 * tek etkinlik Eylül 2026'da. Bu yüzden bu yuvalar "geçmiş etkinlikten kare"
 * DİYE SUNULMAZ; bölüm başlığının altındaki açıklama ziyaretçiye durumu
 * doğrudan söyler ve her yuvanın `alt` metni ne görüldüğünü olduğu gibi
 * anlatır (bir poster). İlk etkinlik yaşandığında gerçek fotoğraflar buraya
 * gelir.
 */
export const ARCHIVE_SLOTS: CollageSlot[] = [
  fillerSlot('archive-1'),
  fillerSlot('archive-2'),
  fillerSlot('archive-3'),
  fillerSlot('archive-4'),
  fillerSlot('archive-5'),
]

/** Akan kolaj şeridinin parçaları. */
export const MARQUEE_SLOTS: CollageSlot[] = [
  fillerSlot('marquee-1'),
  fillerSlot('marquee-2'),
  fillerSlot('marquee-3'),
  fillerSlot('marquee-4'),
]
