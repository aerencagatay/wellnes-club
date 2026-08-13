import type { Testimonial } from './types'

/**
 * ============================================================
 * DİKKAT: BU YORUMLAR ÖRNEKTİR. GERÇEK KİŞİLERE AİT DEĞİLDİR.
 * SİTEYİ YAYINA ALMADAN ÖNCE GERÇEK KATILIMCI YORUMLARIYLA
 * DEĞİŞTİRİLMELİ VEYA BÖLÜM TAMAMEN KALDIRILMALIDIR.
 * ============================================================
 *
 * İSİM KONVANSİYONU: `author` alanı BİLEREK gerçek bir isim gibi durmaz
 * ("Örnek Katılımcı", "Örnek Üye — A.K."). Site canlı bir işletmeye ait;
 * uydurulmuş tam isimlerle ("Zeynep Yılmaz") sahte müşteri yorumu yayınlamak
 * gerçek ziyaretçiyi yanıltır. Arayüz (`community-wall.tsx`) ayrıca
 * `isPlaceholder: true` olan her kartta görünür bir "ÖRNEK" rozeti gösterir.
 *
 * `campSlug` NEDEN BOŞ: bu alan yalnızca camps.ts'te GERÇEKTEN var olan bir
 * slug'a işaret edebilir ve bugün tek kamp geleceğe (Eylül 2026) ait — henüz
 * yaşanmamış bir kampı "katıldığı etkinlik" diye göstermek, örnek yorumun
 * üstüne ikinci bir yanlış bilgi koyardı. Gerçek yorumlar geldiğinde `campSlug`
 * doldurulabilir; arayüz slug çözülebiliyorsa kamp adını kendiliğinden gösterir.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'ornek-1',
    author: 'Örnek Katılımcı',
    quote: {
      tr: 'Beş günün sonunda omuzlarımın yıllardır ilk kez aşağıda olduğunu fark ettim.',
      en: 'By the end of the five days I noticed my shoulders had dropped for the first time in years.',
    },
    isPlaceholder: true,
  },
  {
    id: 'ornek-2',
    author: 'Örnek Katılımcı',
    quote: {
      tr: 'Tek başıma gittim ama ikinci günün sonunda ortak masada tanımadığım kimse kalmamıştı.',
      en: 'I went alone, but by the end of the second day there was no one left at the table I hadn’t met.',
    },
    isPlaceholder: true,
  },
  {
    id: 'ornek-3',
    author: 'Örnek Katılımcı',
    quote: {
      tr: 'Assos gezisiyle akşam yoga arasındaki geçiş, kampın en sevdiğim anıydı.',
      en: 'The transition from the Assos excursion to evening yoga was my favourite part of the retreat.',
    },
    isPlaceholder: true,
  },
  {
    id: 'ornek-4',
    author: 'Örnek Üye — A.K.',
    quote: {
      tr: 'Çanakkale’deki yoga kampında sabah seansı zeytinliğin kenarında yapıldı; nefesimi ilk kez o kadar net duydum.',
      en: 'At the Çanakkale yoga retreat the morning session was held beside the olive grove; I heard my own breath clearly for the first time.',
    },
    isPlaceholder: true,
  },
  {
    id: 'ornek-5',
    author: 'Örnek Üye — S.T.',
    quote: {
      tr: 'Belgrad Ormanı koşusuna tek başıma kaydoldum, dönüşte kahveyi altı kişilik bir masada içiyordum.',
      en: 'I signed up for the Belgrad Forest run alone and ended up having coffee at a table of six on the way back.',
    },
    isPlaceholder: true,
  },
  {
    id: 'ornek-6',
    author: 'Örnek Üye — M.D.',
    quote: {
      tr: 'Boğaz kıyısındaki pilates seansı bir haftanın en sakin kırk beş dakikasıydı; vapur sesleri metronom gibiydi.',
      en: 'The pilates session by the Bosphorus was the calmest forty-five minutes of my week; the ferry horns worked like a metronome.',
    },
    isPlaceholder: true,
  },
  {
    id: 'ornek-7',
    author: 'Örnek Üye — E.B.',
    quote: {
      tr: 'Cihangir’deki kitap buluşmasında kimse kimseye ne iş yaptığını sormadı — sadece okuduğumuz sayfaları konuştuk.',
      en: 'At the Cihangir book meetup nobody asked what anyone did for a living — we only talked about the pages we had read.',
    },
    isPlaceholder: true,
  },
]
