import { useTranslations } from 'next-intl'
import type { Program } from '@/content'

/** `TeacherCard` ve `TeacherBio` aynı rozet listesini birebir aynı sınıflarla
 *  çiziyordu, yalnızca dış margin'de farklılaşıyorlardı — burada tek bir yerde
 *  tutulur, `className` çağıran tarafın o margin'i ayarlamasını sağlar. */
export function DisciplineChips({ disciplines, className = '' }: { disciplines: Program[]; className?: string }) {
  const t = useTranslations('camp')
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`.trim()}>
      {disciplines.map((discipline) => (
        <li
          className="rounded-full border border-text/20 px-3 py-1 text-[11px] tracking-widest text-muted uppercase"
          key={discipline}
        >
          {t(`program.${discipline}`)}
        </li>
      ))}
    </ul>
  )
}
