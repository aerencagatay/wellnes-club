import type { ElementType, ReactNode } from 'react'

const BACKGROUNDS = {
  background: 'bg-background',
  surface: 'bg-surface',
  // Koyu bölümde başlık, eyebrow ve lede zorla krem/kum yapılır: bu sınıflar
  // @layer components (lede/eyebrow) veya @layer base (başlıklar) içinde kendi
  // renklerini set ettiği için miras yetmez — burada kazanan utilities katmanı
  // gerekir. `:where(&)` hem çapa (ancestor) hem de hedef seçiciyi sarmalı —
  // yalnızca hedefi sarmak özgüllüğü bir sınıfta bırakır ve bu, tek başına
  // bir `text-olive` gibi bir çağıran override'ıyla eşitlenip kaynak sırasına
  // kalır (doğrulandı: eşitlikte override kaybediyordu). İkisini de sarmak
  // kuralı gerçek sıfır özgüllüğe indirir: `@layer base`'i katman sırasıyla
  // hâlâ ezer, ama bir çağıranın tek sınıflık override'ı her zaman kazanır
  // (bkz. task-3-report.md doğrulama bölümü).
  dark: 'bg-dark text-background [:where(&)_:where(h1,h2,h3,h4,h5)]:text-background [:where(&)_:where(.type-lede)]:text-sand [:where(&)_:where(.type-eyebrow)]:text-sand', // contrast-guard-allow: kum, koyu zeminde 9.05:1 (brief §2) — metin olarak izinli
} as const

export function Section({
  as: Tag = 'section',
  background = 'background',
  size = 'py',
  className = '',
  children,
}: {
  as?: ElementType
  background?: keyof typeof BACKGROUNDS
  size?: 'py' | 'sm'
  className?: string
  children: ReactNode
}) {
  return (
    <Tag className={`${BACKGROUNDS[background]} ${size === 'py' ? 'section-py' : 'section-sm'}`}>
      <div className={`container-page ${className}`}>{children}</div>
    </Tag>
  )
}
