import { ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Teacher } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Eyebrow } from '@/components/ui/eyebrow'
import { DisciplineChips } from './discipline-chips'
import { TeacherPortrait } from './teacher-portrait'

// Dergi profili: sabit 360px portre + kaydırılmış (asimetrik) metin kolonu —
// `teacher-card.tsx`/`teachers-preview.tsx`'teki aynı görsel dilin tekil-profil
// hâli. Sertifikalar ikon rozeti değil "ince çizgili liste"dir (brief'in Task 8
// dilinde istediği tam biçim): `divide-y` ile ayrılmış düz satırlar, madde
// işareti veya ikon yok.
export function TeacherBio({ teacher, locale }: { teacher: Teacher; locale: AppLocale }) {
  const tTeachers = useTranslations('teachers')

  return (
    <div className="grid gap-10 md:grid-cols-[360px_1fr] md:gap-16">
      <div className="relative aspect-3/4 overflow-hidden rounded-[var(--radius-media)]">
        <TeacherPortrait
          monogramClassName="text-6xl"
          priority
          sizes="(max-width: 768px) 100vw, 360px"
          teacher={teacher}
        />
      </div>
      <div className="md:mt-10">
        <h1 className="type-title">{teacher.name}</h1>
        <Eyebrow className="mt-3">{teacher.title[locale]}</Eyebrow>
        <DisciplineChips className="mt-4" disciplines={teacher.disciplines} />
        {teacher.bio && <p className="type-lede mt-6">{teacher.bio[locale]}</p>}

        {/* Sertifika bölümü, doğrulanmış bir liste YOKKEN tamamen render
            edilmez — başlığı boş bir listeyle göstermek, hocanın sertifikası
            olmadığını ima ederdi; oysa bilgi yalnızca henüz elimizde değil
            (bkz. content/types.ts). */}
        {teacher.certifications && (
          <>
            {/* h2 yerine bilinçli olarak font-body: Instrument Serif yalnızca 400
                ağırlığında yayınlanıyor (bkz. lib/fonts.ts), bu küçük etiket ise
                font-semibold gerektiriyor — tarayıcı taklit-bold üretmesin diye
                gövde fontuna geçilir; sayfa hiyerarşisi için hâlâ bir h2'dir. */}
            <h2 className="mt-10 font-body text-sm font-semibold tracking-[0.12em] text-muted uppercase">
              {tTeachers('certifications')}
            </h2>
            <ul className="mt-3 flex flex-col divide-y divide-text/10 border-t border-text/10">
              {teacher.certifications[locale].map((certification) => (
                <li className="py-2.5 text-sm text-text" key={certification}>
                  {certification}
                </li>
              ))}
            </ul>
          </>
        )}

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
