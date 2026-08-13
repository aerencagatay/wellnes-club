import Image from 'next/image'
import type { Teacher } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { Eyebrow } from '@/components/ui/eyebrow'

// Görünüm `teachers-preview.tsx`'teki dergi düzeniyle birebir aynı dil: kart yok,
// çerçeve yok, büyük portre + isim (Instrument Serif) + uzmanlık (.type-eyebrow) +
// iki satır bio, çift sıradaki kartlarda asimetrik dikey ofset. API (`teacher`,
// `locale`, `headingLevel`) değişmedi — bkz. aşağıdaki `headingLevel` notu.
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
    <article className="group sm:[&:nth-child(even)]:mt-10">
      <Link className="relative block aspect-3/4 overflow-hidden rounded-[var(--radius-media)]" href={`/hocalar/${teacher.slug}`}>
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
      <Heading className="mt-5 font-heading text-2xl text-text group-hover:text-olive">
        <Link href={`/hocalar/${teacher.slug}`}>{teacher.name}</Link>
      </Heading>
      <Eyebrow className="mt-1">{teacher.title[locale]}</Eyebrow>
      <p className="type-lede mt-3 line-clamp-2">{teacher.bio[locale]}</p>
    </article>
  )
}
