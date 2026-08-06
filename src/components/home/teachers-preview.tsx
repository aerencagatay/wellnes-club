import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getAllTeachers } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { RevealGroup } from '@/components/motion/reveal'

// Dergi düzeni: kart yok, çerçeve yok. Büyük portre + isim + uzmanlık + iki
// satır bio, sıradaki hocaya göre kaydırılmış (asimetrik) dikey ofset — bkz.
// brief §4.5. `TeacherCard` (components/teachers/teacher-card.tsx) aynı
// görsel dile ayrıca uyarlanmıştır ve `/hocalar` ile kamp detay sayfasında
// kullanılır.
export function TeachersPreview({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.teachers')
  const teachers = getAllTeachers().slice(0, 3)

  return (
    <Section background="surface">
      <div className="max-w-xl">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="type-title">{t('title')}</h2>
      </div>
      <RevealGroup
        className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-3"
        itemClassName="sm:[&:nth-child(2)]:mt-10 sm:[&:nth-child(3)]:mt-20"
      >
        {teachers.map((teacher) => (
          <Link className="group block" href={`/hocalar/${teacher.slug}`} key={teacher.slug}>
            <div className="relative aspect-3/4 overflow-hidden bg-surface">
              {/* Yer tutucu hoca fotoğrafları SVG'dir; Next.js görüntü eniyileyicisi
                  varsayılan olarak SVG'yi reddeder, bu yüzden unoptimized ile
                  doğrudan dosyadan sunulur (bkz. index.ts hocalar/[slug]). */}
              <Image
                alt={teacher.name}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                src={teacher.photo}
                unoptimized
              />
            </div>
            <p className="mt-5 font-heading text-2xl text-text group-hover:text-olive">{teacher.name}</p>
            <Eyebrow className="mt-1">{teacher.title[locale]}</Eyebrow>
            <p className="type-lede mt-3 line-clamp-2">{teacher.bio[locale]}</p>
          </Link>
        ))}
      </RevealGroup>
      <div className="mt-12">
        <Button href="/hocalar" variant="ghost">
          {t('viewAll')}
        </Button>
      </div>
    </Section>
  )
}
