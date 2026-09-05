import type { ElementType, ReactNode } from 'react'

/**
 * Bölüm zemini. `dark` ve `forest` için başlık/lede/eyebrow renkleri ZORLA
 * krem yapılır: bu sınıflar @layer components (lede/eyebrow) veya @layer base
 * (başlıklar) içinde kendi renklerini set ettiği için miras yetmez.
 *
 * `:where(&)` hem çapa (ancestor) hem de hedef seçiciyi sarmalıdır — yalnızca
 * hedefi sarmak özgüllüğü bir sınıfta bırakır ve bu, tek başına bir
 * `text-olive` gibi bir çağıran override'ıyla eşitlenip kaynak sırasına kalır
 * (doğrulandı: eşitlikte override kaybediyordu). İkisini de sarmak kuralı
 * gerçek sıfır özgüllüğe indirir: @layer base'i katman sırasıyla hâlâ ezer,
 * ama bir çağıranın tek sınıflık override'ı her zaman kazanır.
 *
 * `forest` ayrıca `.field-forest` üzerinden globals.css'te de tanımlıdır;
 * buradaki liste o kuralın Section API'sine açılmış hâlidir.
 */
const BACKGROUNDS = {
  background: 'bg-background',
  surface: 'bg-surface',
  paper: 'bg-paper',
  forest:
    'field-forest grain [:where(&)_:where(h1,h2,h3,h4,h5)]:text-background [:where(&)_:where(.type-lede)]:text-[#E4E9DC] [:where(&)_:where(.type-eyebrow)]:text-[#E4E9DC]',
  dark: 'bg-dark text-background [:where(&)_:where(h1,h2,h3,h4,h5)]:text-background [:where(&)_:where(.type-lede)]:text-[#E4E9DC] [:where(&)_:where(.type-eyebrow)]:text-[#E4E9DC]',
} as const

export function Section({
  as: Tag = 'section',
  background = 'background',
  size = 'py',
  className = '',
  innerClassName = '',
  children,
}: {
  as?: ElementType
  background?: keyof typeof BACKGROUNDS
  size?: 'py' | 'sm'
  /** Dış (tam genişlik) katmana eklenir — zemin/çerçeve için. */
  className?: string
  /** `container-page` katmanına eklenir — içerik hizası için. */
  innerClassName?: string
  children: ReactNode
}) {
  return (
    <Tag
      className={`relative ${BACKGROUNDS[background]} ${size === 'py' ? 'section-py' : 'section-sm'} ${className}`}
    >
      <div className={`container-page relative ${innerClassName}`}>{children}</div>
    </Tag>
  )
}
