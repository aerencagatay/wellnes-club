import type { ElementType, ReactNode } from 'react'

const BACKGROUNDS = {
  cream: 'bg-background',
  'cream-2': 'bg-surface',
  'cream-3': 'bg-surface',
  ink: 'bg-dark text-background [&_:where(h1,h2,h3,h4,h5)]:text-background',
} as const

export function Section({
  as: Tag = 'section',
  background = 'cream',
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
