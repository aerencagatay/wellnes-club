import type { Teacher } from './types'

/**
 * YER TUTUCU VERİ — yayına almadan önce gerçek hoca bilgileriyle değiştirin.
 *
 * Fotoğraflar hakkında: bu üç hoca tamamen kurgusaldır. `elif-demir`'in fotoğrafı
 * kullanıcı isteğiyle (2026-08-06) stok bir fotoğrafla ("yoga hocası foto.jpeg")
 * dolduruldu — kullanıcı bunun stok olduğunu biliyor, gerçek hoca bulununca
 * değiştirilecek. Diğer ikisi (`can-yilmaz`, `zeynep-arslan`) hâlâ
 * public/img/teachers/ altındaki .svg yer tutucularını kullanıyor — otelin
 * sitesindeki gerçek kişilerin fotoğrafları DEĞİLDİR.
 */
export const teachers: Teacher[] = [
  {
    slug: 'elif-demir',
    name: 'Elif Demir',
    title: { tr: 'Yoga ve Nefes Eğitmeni', en: 'Yoga & Breathwork Teacher' },
    disciplines: ['yoga'],
    bio: {
      tr: 'On yılı aşkın süredir vinyasa ve hatha yoga çalışıyor. Derslerinde nefesi hareketin merkezine alır; her seviyeye açık, yarışmasız bir pratik kurar.',
      en: 'She has practised vinyasa and hatha yoga for over a decade. Her classes place breath at the centre of movement, building a non-competitive practice open to every level.',
    },
    certifications: {
      tr: ['Yoga Alliance RYT-500', 'Nefes Terapisi Sertifikası'],
      en: ['Yoga Alliance RYT-500', 'Breathwork Therapy Certificate'],
    },
    photo: '/img/yoga hocası foto.jpeg',
    instagram: 'https://instagram.com/',
  },
  {
    slug: 'can-yilmaz',
    name: 'Can Yılmaz',
    title: { tr: 'Pilates ve Mobilite Eğitmeni', en: 'Pilates & Mobility Coach' },
    disciplines: ['pilates'],
    bio: {
      tr: 'Mat pilates ve fonksiyonel mobilite üzerine çalışıyor. Masa başı çalışanların sırt ve kalça kısıtlarını çözmeye odaklanan bir yaklaşımı var.',
      en: 'He works on mat pilates and functional mobility, with an approach focused on releasing the back and hip restrictions of desk-bound bodies.',
    },
    certifications: {
      tr: ['BASI Pilates Mat Sertifikası', 'FRC Mobility Specialist'],
      en: ['BASI Pilates Mat Certificate', 'FRC Mobility Specialist'],
    },
    photo: '/img/teachers/can-yilmaz.svg',
  },
  {
    slug: 'zeynep-arslan',
    name: 'Zeynep Arslan',
    title: { tr: 'Yin Yoga ve Meditasyon Rehberi', en: 'Yin Yoga & Meditation Guide' },
    disciplines: ['yoga', 'yoga-pilates'],
    bio: {
      tr: 'Yin yoga ve farkındalık meditasyonu çalışıyor. Akşam seanslarında uzun tutuşlar ve sessizlik üzerine kurulu bir dinlenme pratiği yönetiyor.',
      en: 'She practises yin yoga and mindfulness meditation, leading evening sessions built on long holds and stillness.',
    },
    certifications: {
      tr: ['Yin Yoga 300 Saat', 'MBSR Uygulayıcı Eğitimi'],
      en: ['Yin Yoga 300 Hours', 'MBSR Practitioner Training'],
    },
    photo: '/img/teachers/zeynep-arslan.svg',
  },
]
