import type { ReactNode } from 'react'

// Palette'te kırmızı/amber tonu yok (bkz. editorial redesign brief §2). Vurgu
// renkle değil dolgu/kenarlık ve ağırlıkla yapılır: "coral" (aciliyet) dolu bir
// kum şeridi + kalın metin alır, "amber" (bekleme listesi) ince bir zeytin
// çerçeve alır — ikisi de yalnızca izin verilen metin token'larını kullanır.
const TONES = {
  olive: 'bg-olive/12 text-olive',
  coral: 'bg-sand/40 text-text font-semibold',
  amber: 'border border-olive text-olive',
  neutral: 'bg-dark/8 text-muted',
} as const

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
