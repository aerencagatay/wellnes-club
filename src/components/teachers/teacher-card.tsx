import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Teacher } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'

export function TeacherCard({ teacher, locale }: { teacher: Teacher; locale: AppLocale }) {
  const t = useTranslations('camp')
  return (
    <article className="group">
      <Link className="relative block aspect-3/4 overflow-hidden rounded-md" href={`/hocalar/${teacher.slug}`}>
        {/* Yer tutucu hoca fotoğrafları SVG'dir; Next.js görüntü eniyileyicisi
            varsayılan olarak SVG'yi reddeder, bu yüzden unoptimized ile
            doğrudan dosyadan sunulur (bkz. teachers-preview.tsx). */}
        <Image
          alt={teacher.name}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 33vw"
          src={teacher.photo}
          unoptimized
        />
      </Link>
      <h3 className="mt-4 font-heading text-lg text-ink">
        <Link className="hover:text-accent-deep" href={`/hocalar/${teacher.slug}`}>
          {teacher.name}
        </Link>
      </h3>
      <p className="text-sm">{teacher.title[locale]}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {teacher.disciplines.map((discipline) => (
          <li
            className="rounded-full bg-cream-3 px-3 py-1 text-[11px] tracking-widest text-ink-3 uppercase"
            key={discipline}
          >
            {t(`program.${discipline}`)}
          </li>
        ))}
      </ul>
    </article>
  )
}
