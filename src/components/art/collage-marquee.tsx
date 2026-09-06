import { MARQUEE_SLOTS } from '@/content/collage'
import type { AppLocale } from '@/i18n/routing'
import { CollageFrame } from './collage-frame'
import { SunMark } from './marks'

/**
 * Hero ile etkinlik showcase'i arasındaki kolaj şeridi — zine dilinin
 * hareketli parçası ve iki bölüm arasındaki geçiş.
 *
 * ŞERİT DÜZ DEĞİL, KONVEYÖR: parçalar tek bir düzlemde yan yana dizilmez;
 * dönüşümlü olarak öne ve arkaya yerleşir ve hafifçe döner. Bant kayarken
 * parçalar izleyicinin önünden farklı mesafelerde geçer — bir sergi
 * salonundaki döner vitrin gibi. Perspektif olmadan aynı hareket "kayan
 * görseller" okur; perspektifle "geçen nesneler" okur.
 *
 * İÇERİK NEDEN İKİ KEZ RENDER EDİLİYOR: `.marquee-track` animasyonu şeridi
 * `translateX(-50%)` kadar kaydırır. Bu, ancak şerit içeriği tam olarak iki
 * kopyadan oluşuyorsa kusursuz bir döngü verir — ikinci kopyanın başı,
 * birinci kopyanın başının tam olarak bulunduğu yere gelir ve sıçrama
 * görünmez. Tek kopyayla animasyonun sonunda şerit boşluğa kayardı.
 *
 * İkinci kopya `aria-hidden`: ekran okuyucu aynı içeriği iki kez duyurmamalı.
 * (Birinci kopyadaki görsellerin `alt` metinleri zaten sunuluyor.)
 *
 * `prefers-reduced-motion` altında animasyon tamamen durur ve şerit başlangıç
 * konumunda sabitlenir (bkz. globals.css) — süreyi 0.01ms'e indirmek şeridi
 * son karesinde, yani yarısı ekran dışında dondururdu. Perspektif de o
 * durumda devre dışı kalır (`.stage-3d` kuralı).
 */

/**
 * Konveyör üzerindeki her yuvanın açısı ve derinliği. Değerler döngüsel
 * uygulanır; dizi uzunluğu (4) slot sayısına (3) BÖLÜNMEZ ve bu kasıtlıdır:
 * iki sayı aralarında asal olduğu için desen 12 parçada bir tekrar eder, yani
 * bant gözle takip edilebilir bir ritim üretmez.
 */
const CONVEYOR = [
  { rotateY: 14, z: -70 },
  { rotateY: -8, z: 50 },
  { rotateY: 10, z: -30 },
  { rotateY: -14, z: 80 },
] as const

export function CollageMarquee({ locale }: { locale: AppLocale }) {
  const strip = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {MARQUEE_SLOTS.map((slot, index) => {
        const seat = CONVEYOR[index % CONVEYOR.length]
        return (
          <div
            className="flex shrink-0 items-center gap-8"
            key={`${ariaHidden ? 'b' : 'a'}-${slot.id}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* 3:4 DİKEY — kolaj panolarının kendi oranı. Yuva bir ara kareydi
                ve panoların yarısını kırpıyordu: kolajın anlamı parçaların bir
                arada okunmasında, kırpılmış bir kolaj yalnızca bir doku lekesi
                olur. */}
            {/* Koltuk dönüşümü satır içi `transform` DEĞİL, iki CSS
                değişkeni olarak veriliyor. Sebep hareket azaltma: `perspective`
                kapatıldığında satır içi bir `rotateY` yassı bir yatay
                sıkışmaya dönüşür ve parça bozuk görünür. Değişken biçimde,
                `.conveyor-seat` kuralı medya sorgusunda dönüşümü tamamen
                sıfırlayabiliyor (bkz. globals.css). */}
            <div
              className="conveyor-seat h-40 w-30 shrink-0 md:h-52 md:w-39"
              style={{ ['--seat-z' as string]: `${seat.z}px`, ['--seat-r' as string]: `${seat.rotateY}deg` }}
            >
              <CollageFrame
                index={index}
                intensity={1.2}
                locale={locale}
                sizes="(max-width: 768px) 120px, 156px"
                slot={slot}
              />
            </div>
            <SunMark className="ink-sun h-8 w-8 shrink-0 md:h-10 md:w-10" />
          </div>
        )
      })}
    </div>
  )

  return (
    <div
      className="stage-3d overflow-hidden border-y border-text bg-background py-10"
      style={{ ['--marquee-duration' as string]: '46s' }}
    >
      <div className="marquee-track" style={{ transformStyle: 'preserve-3d' }}>
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  )
}
