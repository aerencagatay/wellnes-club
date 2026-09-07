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
/**
 * SAYDAM TONLAR KENDİ ZEMİNİNİ TAŞIR (`bg-background`).
 *
 * Önce bunu çağıranlar yapıyordu: rozetin etrafına `bg-background` veren bir
 * sarmalayıcı `div`. Ama rozet YUVARLAK (hap), sarmalayıcı KESKİN köşeliydi —
 * hapın köşelerinden krem kutunun köşeleri taşıyordu ve poster üzerinde beyaz
 * bir leke olarak görünüyordu (kullanıcı bildirimi, 2026-09-07). Zemini tonun
 * kendisine taşımak sarmalayıcıyı gereksiz kılıyor ve leke ortadan kalkıyor.
 */
const TONES = {
  olive: 'bg-olive text-background',
  'sand-fill': 'bg-sand text-text font-semibold',
  'olive-outline': 'border border-olive bg-background text-olive',
  neutral: 'border border-text/20 bg-background text-muted',
} as const

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <span
      // KESKİN KÖŞE — hap DEĞİL. Sistemde tek eğri pill butondadır (bkz.
      // eden-design-system skill §2); rozet dolu bir mürekkep bloğudur,
      // tıpkı etkinlik kartındaki "ÖRNEK"/kategori etiketleri gibi. Eski
      // `rounded-full` hap, poster üzerindeki krem sarmalayıcıyla birlikte
      // görünür bir kusur üretiyordu.
      className={`inline-flex items-center px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
