import Image from 'next/image'
import type { Teacher } from '@/content'
import { cn } from '@/lib/utils/cn'

/**
 * Hoca portresi — fotoğraf VARSA fotoğraf, YOKSA isimden türetilmiş monogram.
 *
 * Bu bileşen üç yerde (kart, profil, ana sayfa önizlemesi) aynı kararı
 * vermek zorunda olduğu için tek yerde tutulur; üçüne ayrı ayrı kopyalansaydı
 * biri fotoğrafsız hocada kırık bir `<Image src={undefined}>` render ederdi.
 *
 * Monogram BİR YER TUTUCU FOTOĞRAF DEĞİLDİR ve öyle görünmemelidir: stok bir
 * portre koymak, o fotoğraftaki kişiyi hocaymış gibi göstermek olurdu (site
 * canlı bir işletmeye ait). Monogram ızgara düzenini korur ve fotoğrafın
 * yokluğunu gizlemeden kasıtlı gösterir.
 */

/** "Melike Göktan" → "MG". Tek kelimelik adlarda tek harf döner. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase('tr-TR'))
    .join('')
}

export function TeacherPortrait({
  teacher,
  sizes,
  priority = false,
  monogramClassName,
}: {
  teacher: Teacher
  /** `next/image` `sizes` — yalnızca fotoğraf varsa kullanılır. */
  sizes: string
  priority?: boolean
  /** Monogramın tipografi ölçeği çağırana göre değişir (profil kartından büyük). */
  monogramClassName?: string
}) {
  if (!teacher.photo) {
    return (
      // aria-hidden: hocanın adı zaten çevredeki başlıkta metin olarak var —
      // monogramı ayrıca seslendirmek ekran okuyucuda adı iki kez okuturdu.
      <span
        aria-hidden
        className={cn(
          'flex h-full w-full items-center justify-center bg-sand/40 font-heading text-4xl text-text/45',
          monogramClassName,
        )}
      >
        {initials(teacher.name)}
      </span>
    )
  }

  return (
    <Image
      alt={teacher.name}
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      fill
      loading={priority ? undefined : 'lazy'}
      priority={priority}
      sizes={sizes}
      // Yer tutucu hoca fotoğrafları SVG olabiliyor; Next.js görüntü
      // eniyileyicisi varsayılan olarak SVG'yi reddeder, bu yüzden unoptimized
      // ile doğrudan dosyadan sunulur.
      src={teacher.photo}
      unoptimized
    />
  )
}
