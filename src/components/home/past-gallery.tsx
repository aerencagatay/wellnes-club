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

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: '/img/venue/kusbakisi.webp',
    alt: { tr: 'Koya bakan tepeden mekânın kuşbakışı görünümü', en: 'Aerial view of the property above the bay' },
    className: 'col-span-2 aspect-16/9 md:col-span-4',
  },
  {
    src: '/img/venue/havuz.webp',
    alt: { tr: 'Otelin havuzu ve çevresindeki taş teras', en: 'The hotel pool and the stone terrace around it' },
    className: 'col-span-1 aspect-3/4 md:col-span-2 md:row-span-2',
  },
  {
    src: '/img/wellness_goals/yogo foto.jpg',
    alt: { tr: 'Yoga pratiği sırasında bir duruş', en: 'A posture held during yoga practice' },
    className: 'col-span-1 aspect-square md:col-span-2',
  },
  {
    src: '/img/yemek fotoğrafı.jpeg',
    alt: { tr: 'Ortak masada paylaşılan vejetaryen tabaklar', en: 'Vegetarian plates shared at the communal table' },
    className: 'col-span-2 aspect-4/3 md:col-span-2 md:aspect-square',
  },
  {
    src: '/img/venue/bahce.webp',
    alt: { tr: 'Zeytin ağaçlarının arasındaki bahçe', en: 'The garden among the olive trees' },
    className: 'col-span-1 aspect-square md:col-span-3 md:aspect-16/9',
  },
  {
    src: '/img/yoga hocası foto.jpeg',
    alt: { tr: 'Eğitmen bir seans öncesi mat başında', en: 'An instructor at the mat before a session' },
    className: 'col-span-1 aspect-square md:col-span-3 md:aspect-16/9',
  },
]

export function PastGallery({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.gallery')

  // `GALLERY_ITEMS` yukarıda sabit bir dizi — boş durum dalı ulaşılamaz kod
  // olurdu, bu yüzden yok. Gerçek arşiv verisi bir içerik dosyasına taşınırsa
  // (ve boş olabilir hâle gelirse) o dal geri eklenmeli.
  return (
    <Section>
      <BlurFade>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="type-title">{t('title')}</h2>
          {/* Buradaki görseller GEÇMİŞ ETKİNLİK FOTOĞRAFI DEĞİL — mekanın
              atmosfer kareleri, yer tutucu olarak duruyorlar (kullanıcı isteği,
              2026-08-14: bölüm çalışıyormuş gibi kalsın, gerçek fotoğraflar
              sonra eklenecek). Bu rozet, o gerçeği gizlemeden bölümün canlı
              görünmesini sağlar; gerçek arşiv geldiğinde tek satır silinir. */}
          <span className="border border-sand px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-muted uppercase">
            {t('willBeUpdated')}
          </span>
        </div>
      </BlurFade>

      <div
        className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4"
        data-testid="past-gallery"
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
                <div className={cn('group relative h-full w-full overflow-hidden bg-sand/40')}>
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
