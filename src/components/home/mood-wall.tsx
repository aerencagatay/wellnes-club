import { useTranslations } from 'next-intl'
import { MOOD_SLOTS } from '@/content/collage'
import type { AppLocale } from '@/i18n/routing'
import { DrawIn } from '@/components/art/draw-in'
import { GalleryWall } from '@/components/art/gallery-wall'
import { HandArrow, OliveBranch } from '@/components/art/marks'
import { BlurFade } from '@/components/motion/blur-fade'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'

/**
 * MOOD DUVARI — "EDEN'in Dünyası".
 *
 * BU BÖLÜM ESKİDEN BİR ARŞİVDİ ("Geçmiş Retreatlerden / Previously at EDEN")
 * ve 2026-09-06'da kullanıcı kararıyla mood duvarına çevrildi.
 *
 * NEDEN: EDEN'in henüz gerçekleşmiş bir etkinliği YOK — ilk retreat 18-20
 * Eylül 2026'da. "Geçmiş" başlığı altında ne gösterilirse gösterilsin,
 * ziyaretçi onu yaşanmış bir etkinliğin kaydı sanma riski taşıyordu ve bölüm
 * bunu bir özür satırıyla ("kareler etkinlikten sonra burada olacak")
 * dengelemeye çalışıyordu. Bölümün İDDİASINI değiştirmek, o özrü yazmaktan
 * daha doğru bir çözüm: duvar artık kulübün GÖRSEL DÜNYASINI gösteriyor,
 * geçmişini değil. Özür satırı da kalktı.
 *
 * Dördü de gerçek EDEN varlığı — üç kolaj panosu ve kulübün kendi duyuru
 * posteri. Yer tutucu YOK (bkz. content/collage.ts → MOOD_SLOTS).
 *
 * Gerçek etkinlik fotoğrafları geldiğinde AYRI bir arşiv bölümü açılabilir;
 * bu duvar o zaman da kendi işini görmeye devam eder.
 */
export function MoodWall({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.mood')

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
          <p className="type-hand-sm max-w-xs">{t('note')}</p>
        </div>
      </BlurFade>

      <GalleryWall locale={locale} slots={MOOD_SLOTS} />
    </Section>
  )
}
