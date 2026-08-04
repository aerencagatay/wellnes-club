import Image from 'next/image'
import { Award, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Teacher } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { DisciplineChips } from './discipline-chips'

export function TeacherBio({ teacher, locale }: { teacher: Teacher; locale: AppLocale }) {
  const tTeachers = useTranslations('teachers')

  return (
    <div className="grid gap-10 md:grid-cols-[360px_1fr] md:gap-16">
      <div className="relative aspect-3/4 overflow-hidden rounded-md">
        {/* Yer tutucu hoca fotoğrafları SVG'dir; unoptimized ile doğrudan
            sunulur (bkz. teachers-preview.tsx). */}
        <Image
          alt={teacher.name}
          className="object-cover"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 360px"
          src={teacher.photo}
          unoptimized
        />
      </div>
      <div>
        <h1 className="font-heading text-3xl text-text md:text-4xl">{teacher.name}</h1>
        <p className="mt-2 text-muted">{teacher.title[locale]}</p>
        <DisciplineChips className="mt-4" disciplines={teacher.disciplines} />
        <p className="type-lede mt-6">{teacher.bio[locale]}</p>

        {/* h2 yerine bilinçli olarak font-body: Instrument Serif yalnızca 400
            ağırlığında yayınlanıyor (bkz. lib/fonts.ts), bu küçük etiket ise
            font-semibold gerektiriyor — tarayıcı taklit-bold üretmesin diye
            gövde fontuna geçilir; sayfa hiyerarşisi için hâlâ bir h2'dir. */}
        <h2 className="mt-8 font-body text-sm font-semibold tracking-[0.12em] text-muted uppercase">
          {tTeachers('certifications')}
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {teacher.certifications[locale].map((certification) => (
            <li className="flex items-center gap-2 text-sm" key={certification}>
              <Award aria-hidden className="size-4 shrink-0 text-olive" />
              {certification}
            </li>
          ))}
        </ul>

        {teacher.instagram && (
          <a
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-olive hover:underline"
            href={teacher.instagram}
            rel="noopener noreferrer"
            target="_blank"
          >
            {tTeachers('instagram')}
            <ExternalLink aria-hidden className="size-4" />
          </a>
        )}
      </div>
    </div>
  )
}
