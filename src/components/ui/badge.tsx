import type { ReactNode } from 'react'

// Palette'te kırmızı/amber tonu yok (bkz. editorial redesign brief §2). Vurgu
// renkle değil dolgu/kenarlık ve ağırlıkla yapılır: "sand-fill" (aciliyet) dolu
// bir kum şeridi + kalın metin alır, "olive-outline" (bekleme listesi) ince bir
// zeytin çerçeve alır — ikisi de yalnızca izin verilen metin token'larını kullanır.
//
// Tone adları Task 7 kapsamında yeniden adlandırıldı (bkz. task-3-report.md ve
// task-7-report.md): eski `coral`/`amber` adları rengin adını taşıyordu ama
// palette'te ne kırmızı ne amber var — çağıranlar (`camp-card.tsx`,
// `camp-cta-card.tsx`) da bu görevin kapsamında olduğundan isimler burada ve
// her iki çağıran dosyada birlikte güncellendi.
const TONES = {
  olive: 'bg-olive text-background',
  'sand-fill': 'bg-sand text-text font-semibold',
  'olive-outline': 'border border-olive text-olive',
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
