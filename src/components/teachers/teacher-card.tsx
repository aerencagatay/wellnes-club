import Image from 'next/image'
import type { Teacher } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { DisciplineChips } from './discipline-chips'

export function TeacherCard({
  teacher,
  locale,
  headingLevel = 'h3',
}: {
  teacher: Teacher
  locale: AppLocale
  /** `/hocalar` listesi bu kartı sayfanın `h1`'inden hemen sonra, ARA bir `h2` bölüm
   *  başlığı olmadan yerleştirir — orada `h2` verilmelidir, aksi halde `h1 → h3` atlar.
   *  Bir `h2` bölüm başlığının (ör. "Hocalarımız") altına yerleştirilen çağrılarda
   *  varsayılan `h3` doğru iç içe geçmeyi korur. */
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
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
      <Heading className="mt-4 font-heading text-lg text-ink">
        <Link className="hover:text-accent-deep" href={`/hocalar/${teacher.slug}`}>
          {teacher.name}
        </Link>
      </Heading>
      <p className="text-sm">{teacher.title[locale]}</p>
      <DisciplineChips className="mt-2" disciplines={teacher.disciplines} />
    </article>
  )
}
