import { useTranslations } from 'next-intl'
import { ARCHIVE_SLOTS } from '@/content/collage'
import type { AppLocale } from '@/i18n/routing'
import { CollageFrame } from '@/components/art/collage-frame'
import { HandArrow, OliveBranch } from '@/components/art/marks'
import { BlurFade } from '@/components/motion/blur-fade'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'

/**
 * ARŞİV — "Previously at EDEN".
 *
 * DÜRÜSTLÜK NOTU (bu bölümün en önemli kısıtı): EDEN'in henüz GERÇEKLEŞMİŞ bir
 * etkinliği YOK — takvimdeki tek etkinlik Eylül 2026'da — ve geçmiş
 * etkinliklerden fotoğraf/video da yok. Bu bölüm 2026-09-05'te tam da bu
 * yüzden BOŞALTILMIŞTI.
 *
 * Bugün ızgara yeniden dolu, ama gösterilen şey "geçmiş etkinlikten kare"
 * DİYE SUNULMUYOR: yuvalar EDEN'in kendi duyuru POSTERİNİ taşıyor, her
 * yuvanın `alt` metni bunun bir poster olduğunu açıkça söylüyor ve başlığın
 * altındaki `empty` satırı ziyaretçiye ilk etkinliğin henüz yaşanmadığını
 * doğrudan bildiriyor. Yani bölüm bir arşiv TAKLİDİ yapmıyor; kolaj dili
 * kuruluyor ve arşivin ne zaman dolacağı söyleniyor.
 *
 * Gerçek etkinlik fotoğrafları geldiğinde tek yapılacak şey `ARCHIVE_SLOTS`
 * (src/content/collage.ts) içeriğini değiştirmek ve `empty` satırını
 * kaldırmak.
 */

/**
 * Asimetrik kolaj ızgarası. Yuva boyutları KASITLI olarak eşit değil — eşit
 * kareler bir "ürün ızgarası" okur, kolaj ise farklı boyda parçaların
 * yapıştırıldığı bir sayfa gibi durmalı.
 *
 * `sizes` her yuvanın geniş ekrandaki GERÇEK kolon payına göre verilir;
 * hepsine `100vw` vermek katlamanın altındaki bu bölümde gereksiz bayt
 * indirtirdi.
 */
const SLOT_LAYOUT = [
  { className: 'col-span-2 md:col-span-3 md:row-span-2 aspect-square', sizes: '(max-width: 768px) 100vw, 42vw' },
  { className: 'col-span-1 md:col-span-2 aspect-square', sizes: '(max-width: 768px) 50vw, 28vw' },
  { className: 'col-span-1 md:col-span-2 aspect-square', sizes: '(max-width: 768px) 50vw, 28vw' },
  { className: 'col-span-1 md:col-span-2 aspect-4/5', sizes: '(max-width: 768px) 50vw, 28vw' },
  { className: 'col-span-1 md:col-span-2 aspect-4/5', sizes: '(max-width: 768px) 50vw, 28vw' },
] as const

export function PastGallery({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.gallery')

  return (
    <Section background="surface" className="grain overflow-hidden">
      <OliveBranch className="ink-olive pointer-events-none absolute -right-10 top-16 hidden h-72 w-44 opacity-20 lg:block" />

      <BlurFade>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
          <h2 className="type-title">{t('title')}</h2>
          <HandArrow className="ink-pen hidden h-8 w-12 -rotate-6 sm:block" />
          {/* `empty` bir "boş durum" metni değil, kalıcı bir DÜRÜSTLÜK
              satırıdır: ızgarada gördükleri poster, geçmiş bir etkinliğin
              kaydı değil. Gerçek fotoğraflar geldiğinde kaldırılır. */}
          <p className="type-hand-sm max-w-xs">{t('empty')}</p>
        </div>
      </BlurFade>

      <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-7 md:gap-5" data-testid="past-gallery">
        {ARCHIVE_SLOTS.map((slot, index) => {
          const layout = SLOT_LAYOUT[index % SLOT_LAYOUT.length]
          return (
            <BlurFade as="li" className={layout.className} delay={0.05 * index} key={slot.id} offset={18}>
              <CollageFrame index={index} locale={locale} sizes={layout.sizes} slot={slot} tape={index % 3 === 0} />
            </BlurFade>
          )
        })}
      </ul>
    </Section>
  )
}
