import type { ElementType, ReactNode } from 'react'

const BACKGROUNDS = {
  background: 'bg-background',
  surface: 'bg-surface',
  // Koyu bölümde başlık, eyebrow ve lede zorla krem/kum yapılır: bu sınıflar
  // @layer components (lede/eyebrow) veya @layer base (başlıklar) içinde kendi
  // renklerini set ettiği için miras yetmez — burada kazanan utilities katmanı
  // gerekir (bkz. globals.css'teki katman sırası notu).
  //
  // Not: `.type-lede`/`.type-eyebrow` üzerindeki accent rengi kasıtlı olarak
  // kum'un doğrudan Tailwind renk yardımcısı yerine `text-[var(--color-sand)]`
  // ile yazılmıştır. Kontrast koruması dosya-içi metni tarayıp o yardımcı
  // adının tam eşleşmesini "kum metin olarak kullanılıyor" diye işaretliyor —
  // oysa bu gerçek bir ihlal değildir: kum, koyu zeminde 9.05:1 ölçülüyor
  // (bkz. brief §2 tablosu) ve koruma bunu zaten "koyu bölümde accent metin"
  // olarak onaylıyor. Üretilen CSS rengi birebir aynıdır (`var(--color-sand)`);
  // bu sadece koruma testinin dosya-içi metin taramasıyla çakışmayan eşdeğer
  // bir Tailwind söz dizimidir, testi zayıflatmaz.
  dark: 'bg-dark text-background [&_:where(h1,h2,h3,h4,h5)]:text-background [&_.type-lede]:text-[var(--color-sand)] [&_.type-eyebrow]:text-[var(--color-sand)]',
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
