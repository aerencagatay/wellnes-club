import type { ElementType, ReactNode } from 'react'

const BACKGROUNDS = {
  cream: 'bg-cream',
  'cream-2': 'bg-cream-2',
  'cream-3': 'bg-cream-3',
  ink: 'bg-ink text-cream [&_:where(h1,h2,h3,h4,h5)]:text-cream',
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
