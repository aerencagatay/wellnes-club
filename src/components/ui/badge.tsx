import type { ReactNode } from 'react'

// Palette'te kırmızı/amber tonu yok (bkz. editorial redesign brief §2). Vurgu
// renkle değil dolgu/kenarlık ve ağırlıkla yapılır: "coral" (aciliyet) dolu bir
// kum şeridi + kalın metin alır, "amber" (bekleme listesi) ince bir zeytin
// çerçeve alır — ikisi de yalnızca izin verilen metin token'larını kullanır.
//
// Tone adları kasıtlı olarak korunmuştur (bkz. task-3-report.md): `camp-status.ts`
// buradan `CampBadge` değerleri üretiyor ve çağıranlar (`camp-card.tsx`,
// `camp-cta-card.tsx`) Task 7'nin kapsamında. İsimleri burada değiştirmek o iki
// dosyayı da güncellemeyi gerektirir; bu görev yalnızca yedi temel bileşenin
// görselini değiştiriyor.
const TONES = {
  olive: 'bg-olive text-background',
  coral: 'bg-sand text-text font-semibold',
  amber: 'border border-olive text-olive',
  neutral: 'border border-text/20 text-muted',
} as const

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-none px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
