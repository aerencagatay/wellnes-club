import type { Testimonial } from './types'

/**
 * ============================================================
 * DİKKAT: BU YORUMLAR ÖRNEKTİR. GERÇEK KİŞİLERE AİT DEĞİLDİR.
 * SİTEYİ YAYINA ALMADAN ÖNCE GERÇEK KATILIMCI YORUMLARIYLA
 * DEĞİŞTİRİLMELİ VEYA BÖLÜM TAMAMEN KALDIRILMALIDIR.
 * ============================================================
 */
export const testimonials: Testimonial[] = [
  {
    id: 'ornek-1',
    author: 'Örnek Katılımcı',
    campSlug: 'yoga-nefes-ekim-2026',
    quote: {
      tr: 'Beş günün sonunda omuzlarımın yıllardır ilk kez aşağıda olduğunu fark ettim.',
      en: 'By the end of the five days I noticed my shoulders had dropped for the first time in years.',
    },
    isPlaceholder: true,
  },
  {
    id: 'ornek-2',
    author: 'Örnek Katılımcı',
    campSlug: 'pilates-mobilite-kasim-2026',
    quote: {
      tr: 'Tek başıma gittim ama ikinci günün sonunda ortak masada tanımadığım kimse kalmamıştı.',
      en: 'I went alone, but by the end of the second day there was no one left at the table I hadn’t met.',
    },
    isPlaceholder: true,
  },
  {
    id: 'ornek-3',
    author: 'Örnek Katılımcı',
    campSlug: 'yoga-pilates-nisan-2026',
    quote: {
      tr: 'Assos gezisiyle akşam yoga arasındaki geçiş, kampın en sevdiğim anıydı.',
      en: 'The transition from the Assos excursion to evening yoga was my favourite part of the retreat.',
    },
    isPlaceholder: true,
  },
]
