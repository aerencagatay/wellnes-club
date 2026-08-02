import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getAllTeachers } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'

export function TeachersPreview({ locale }: { locale: AppLocale }) {
  const t = useTranslations('home.teachers')
  const teachers = getAllTeachers().slice(0, 3)

  return (
    <Section background="cream-2">
      <div className="max-w-xl">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="type-section-title">{t('title')}</h2>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {teachers.map((teacher) => (
          <Link className="group block" href={`/hocalar/${teacher.slug}`} key={teacher.slug}>
            <div className="relative aspect-square overflow-hidden rounded-md bg-cream-3">
              {/* Yer tutucu hoca fotoğrafları SVG'dir; Next.js görüntü eniyileyicisi
                  varsayılan olarak SVG'yi reddeder, bu yüzden unoptimized ile
                  doğrudan dosyadan sunulur (bkz. next/dist/server/image-optimizer.js). */}
              <Image
                alt={teacher.name}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                src={teacher.photo}
                unoptimized
              />
            </div>
            <p className="mt-4 font-heading text-lg text-ink group-hover:text-accent-deep">{teacher.name}</p>
            {/* text-body-deep: bu bölüm cream-2 zemininde, düz text-body orada WCAG AA
                eşiğinin altında kalır (bkz. globals.css'teki -deep token yorumu). */}
            <p className="text-sm text-body-deep">{teacher.title[locale]}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12">
        <Button href="/hocalar" variant="ghost">
          {t('viewAll')}
        </Button>
      </div>
    </Section>
  )
}
