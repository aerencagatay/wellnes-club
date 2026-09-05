import { useTranslations } from 'next-intl'
import { getAllTeachers } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { RevealGroup } from '@/components/motion/reveal'
import { TeacherPortrait } from '@/components/teachers/teacher-portrait'
import { cn } from '@/lib/utils/cn'

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
      {/* Üç kolonluk ızgara ve kaydırılmış dikey ofsetler YALNIZCA birden fazla
          hoca varken uygulanır: tek hocada üç kolonun ikisi boş kalır ve portre
          sayfanın solunda kazara unutulmuş gibi durur. */}
      <RevealGroup
        className={cn('mt-16 grid gap-x-8 gap-y-16', teachers.length > 1 ? 'sm:grid-cols-3' : 'max-w-xs')}
        itemClassName={teachers.length > 1 ? 'sm:[&:nth-child(2)]:mt-10 sm:[&:nth-child(3)]:mt-20' : undefined}
      >
        {teachers.map((teacher) => (
          <Link className="group block" href={`/hocalar/${teacher.slug}`} key={teacher.slug}>
            <div className="relative aspect-3/4 overflow-hidden bg-surface">
              <TeacherPortrait sizes="(max-width: 640px) 100vw, 33vw" teacher={teacher} />
            </div>
            <p className="mt-5 font-heading text-2xl text-text group-hover:text-olive">{teacher.name}</p>
            <Eyebrow className="mt-1">{teacher.title[locale]}</Eyebrow>
            {teacher.bio && <p className="type-lede mt-3 line-clamp-2">{teacher.bio[locale]}</p>}
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
