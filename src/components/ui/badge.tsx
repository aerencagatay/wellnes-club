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
      // Hap biçimi (`rounded-full`) — MagicUI'nin rozet dili. Harf aralığı
      // 0.12em'den 0.06em'e indi: rozetler kısa metinler olduğu için geniş
      // aralık onları "2010'lar" hissi veren birer etiket bandına çeviriyordu
      // (kullanıcı geri bildirimi, 2026-08-14).
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
