import type { ReactNode } from 'react'

/** `className` isteğe bağlıdır — koyu zeminde kullanan bir çağıran (ör. `text-background`)
 *  `.type-eyebrow`'un varsayılan `muted` rengini yeniden kapsayabilsin diye vardır;
 *  `.type-eyebrow` artık `@layer components` içinde olduğundan (bkz. hero-home.tsx'teki not)
 *  eklenen bir utilities sınıfı bu rengi güvenle ezebilir. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`type-eyebrow ${className}`.trim()}>{children}</span>
}
