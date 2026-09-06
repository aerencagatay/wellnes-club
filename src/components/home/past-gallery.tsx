import { useTranslations } from 'next-intl'
import { ARCHIVE_SLOTS } from '@/content/collage'
import type { AppLocale } from '@/i18n/routing'
import { DrawIn } from '@/components/art/draw-in'
import { GalleryWall } from '@/components/art/gallery-wall'
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

export function PastGallery({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.gallery')

  return (
    <Section background="surface" className="grain overflow-hidden">
      {/* Zeytin dalı kaydırmayla ÇİZİLİR — uzun bir yol olduğu için süre de
          uzun. Dekoratif, bu yüzden `aria-hidden` zaten işaretin içinde. */}
      <DrawIn
        className="ink-olive pointer-events-none absolute -right-10 top-16 hidden opacity-20 lg:block"
        duration={2.2}
      >
        <OliveBranch className="h-72 w-44" />
      </DrawIn>

      <BlurFade>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
          <h2 className="type-title">{t('title')}</h2>
          <DrawIn className="ink-pen hidden -rotate-6 sm:block" delay={0.35}>
            <HandArrow className="h-8 w-12" />
          </DrawIn>
          {/* `empty` bir "boş durum" metni değil, kalıcı bir DÜRÜSTLÜK
              satırıdır: ızgarada gördükleri poster, geçmiş bir etkinliğin
              kaydı değil. Gerçek fotoğraflar geldiğinde kaldırılır. */}
          <p className="type-hand-sm max-w-xs">{t('empty')}</p>
        </div>
      </BlurFade>

      <GalleryWall locale={locale} slots={ARCHIVE_SLOTS} />

    </Section>
  )
}
