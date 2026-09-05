import type { Venue } from './types'

/**
 * Görseller otel repo'sundaki img/ klasöründen alınıp public/img/venue/ altına
 * kopyalanmıştır, ardından web için WebP'ye dönüştürülüp yeniden boyutlandırılmıştır
 * (uzun kenar en fazla 2400px, kalite ~80). Orijinal JPEG/PNG dosyaları bu adımdan
 * sonra kaldırılmıştır; kaynak format artık korunmamaktadır çünkü amaç web
 * performansıdır.
 */
export const venues: Venue[] = [
  {
    slug: 'karadut-tas-otel',
    name: 'Asos Karadut Taş Otel',
    shortDescription: {
      tr: "Büyükhusun köyünde, yerel taştan örülmüş butik bir otel. Asos'un sakinliği, zeytinlikler ve Ege ışığı.",
      en: 'A boutique hotel built from local stone in Büyükhusun village. The calm of Asos, olive groves and Aegean light.',
    },
    location: { tr: 'Büyükhusun, Ayvacık / Çanakkale', en: 'Büyükhusun, Ayvacık / Çanakkale' },
    highlights: {
      tr: [
        'Asos antik kentine 7 dakika',
        "Kadırga Koyu'na 5 km",
        'Yerel taş mimari',
        'Havuz ve bahçe',
        'Otel restoranı',
      ],
      en: [
        '7 minutes to ancient Asos',
        '5 km to Kadırga Bay',
        'Local stone architecture',
        'Pool and garden',
        'On-site restaurant',
      ],
    },
    gallery: [
      '/img/venue/hero.webp',
      '/img/venue/dis-cephe.webp',
      '/img/venue/balkon.webp',
      '/img/venue/hotel.webp',
      '/img/venue/havuz.webp',
      '/img/venue/bahce.webp',
      '/img/venue/kusbakisi.webp',
    ],
    mapEmbedUrl: 'https://www.google.com/maps?q=39.4869,26.3389&output=embed',
    websiteUrl: 'https://www.karaduttasotel.com/',
    coordinates: { lat: 39.4869, lng: 26.3389 },
  },
]
