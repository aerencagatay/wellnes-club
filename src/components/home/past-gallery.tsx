import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Localized } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { BlurFade } from '@/components/motion/blur-fade'
import { VideoDialog } from '@/components/motion/video-dialog'
import { cn } from '@/lib/utils/cn'

/**
 * ARŞİV / GEÇMİŞ ETKİNLİKLER bölümü.
 *
 * DÜRÜSTLÜK NOTU (bu bölümün en önemli kısıtı): EDEN'in henüz GERÇEKLEŞMİŞ bir
 * etkinliği yok — takvimdeki tek etkinlik Eylül 2026'da — ve elimizde geçmiş
 * etkinliklerden fotoğraf/video YOK. Bu yüzden buradaki görseller mekânın ve
 * atmosferin GERÇEK fotoğraflarıdır ve hiçbiri "etkinlikten bir an" diye
 * sunulmaz: `alt` metinleri ne görüldüğünü olduğu gibi anlatır ve başlığın
 * hemen altında `home.gallery.empty` ("İlk etkinliğimizin fotoğrafları yakında
 * burada olacak.") ziyaretçiye durumu açıkça söyler. Gerçek etkinlik
 * fotoğrafları geldiğinde `GALLERY_ITEMS` onlarla değiştirilmelidir.
 *
 * VİDEO: `video-dialog.tsx` hazır ve bu ızgara video öğelerini destekliyor,
 * ama elimizde gerçek bir video dosyası olmadığı için hiçbir öğede `videoSrc`
 * YOK — var olmayan bir dosya yolu uydurmak, çalışmayan bir oynat düğmesi
 * üretirdi. Bir video eklendiğinde ilgili öğeye `videoSrc` yazmak yeterli:
 * görsel otomatik olarak postere, kutu da lightbox tetikleyicisine dönüşür.
 */

type GalleryItem = {
  src: string
  alt: Localized
  /** Izgara içindeki yeri — asimetrik editoryal ritim buradan gelir. */
  className: string
  /** Yalnızca gerçek bir video dosyası varsa doldurulur (bkz. üstteki not). */
  videoSrc?: string
}

// `sizes`, öğenin geniş ekrandaki gerçek kolon payına göre verilir — hepsine
// `100vw` vermek katlamanın altındaki bu bölümde gereksiz bayt indirtirdi.
const WIDE_SIZES = '(max-width: 768px) 100vw, 66vw'
const HALF_SIZES = '(max-width: 768px) 100vw, 50vw'
const NARROW_SIZES = '(max-width: 768px) 50vw, 33vw'

/**
 * BOŞ (kullanıcı isteği, 2026-09-05): buradaki altı görsel geçmiş etkinlik
 * fotoğrafı DEĞİL, mekânın atmosfer kareleriydi ve bölüm çalışıyormuş gibi
 * dursun diye konmuşlardı. Kullanıcı hepsinin kaldırılmasını istedi.
 *
 * Dizi silinmedi, BOŞALTILDI: aşağıdaki ızgara, `sizes` hesabı ve video
 * desteği olduğu gibi duruyor. İlk etkinlik (18-20 Eylül 2026) yaşandığında
 * gerçek fotoğrafları buraya eklemek yeterli — bölüm kendiliğinden geri gelir.
 */
const GALLERY_ITEMS: GalleryItem[] = []

export function PastGallery({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.gallery')

  // Boş durum dalı ARTIK GERÇEK DURUM: dizi bugün boş (bkz. yukarıdaki not).
  // Bölüm sayfadan tamamen kaldırılmadı çünkü başlığı ziyaretçiye kulübün
  // arşivi olduğunu ve ilk etkinliğin henüz yaşanmadığını söylüyor — boş bir
  // ızgara çerçevesi göstermek yerine tek satırlık bir açıklama gösterilir.
  const isEmpty = GALLERY_ITEMS.length === 0

  return (
    <Section>
      <BlurFade>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="type-title">{t('title')}</h2>
          {/* Rozet YALNIZCA gerçek fotoğraf varken anlamlı: "güncellenecek"
              demek, gösterilenlerin nihai olmadığını söyler. Hiç fotoğraf
              yokken bunun yerine durumu doğrudan anlatan `empty` gösterilir. */}
          {!isEmpty && (
            <span className="rounded-full border border-sand px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-muted uppercase">
              {t('willBeUpdated')}
            </span>
          )}
        </div>
        {isEmpty && <p className="type-lede mt-5 max-w-xl">{t('empty')}</p>}
      </BlurFade>

      <div
        className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4"
        data-testid="past-gallery"
        hidden={isEmpty}
      >
        {GALLERY_ITEMS.map((item, index) => {
          const sizes = item.className.includes('md:col-span-4')
            ? WIDE_SIZES
            : item.className.includes('md:col-span-3')
              ? HALF_SIZES
              : NARROW_SIZES

          return (
            <BlurFade className={item.className} delay={0.05 * index} key={item.src} offset={16}>
              {item.videoSrc ? (
                <VideoDialog
                  className="h-full"
                  closeLabel={t('close')}
                  playLabel={t('play')}
                  posterAlt={item.alt[locale]}
                  posterSrc={item.src}
                  sizes={sizes}
                  videoSrc={item.videoSrc}
                />
              ) : (
                // Hover: hafif büyütme + ince bir koyu üst katman. Öğe
                // tıklanabilir değil (bir lightbox'a bağlanmıyor), bu yüzden
                // düğme değil düz bir kutu olarak kalır.
                <div
                  className={cn(
                    // Görsel çerçevesi: medya yarıçapı + yumuşak gölge, hover'da
                    // gölge derinleşir. `overflow-hidden` köşe kırpması için şart.
                    'group relative h-full w-full overflow-hidden rounded-[var(--radius-media)] bg-sand/40',
                    'shadow-[var(--shadow-card)] transition-all duration-300 ease-out hover:shadow-[var(--shadow-card-hover)]',
                  )}
                >
                  <Image
                    alt={item.alt[locale]}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    fill
                    loading="lazy"
                    sizes={sizes}
                    src={item.src}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-dark/0 transition-colors duration-500 group-hover:bg-dark/15"
                  />
                </div>
              )}
            </BlurFade>
          )
        })}
      </div>
    </Section>
  )
}
