import { MARQUEE_SLOTS } from '@/content/collage'
import type { AppLocale } from '@/i18n/routing'
import { CollageFrame } from './collage-frame'
import { SunMark } from './marks'

/**
 * Hero ile etkinlik showcase'i arasındaki ince kolaj şeridi — zine dilinin
 * hareketli parçası ve iki bölüm arasındaki geçiş.
 *
 * İÇERİK NEDEN İKİ KEZ RENDER EDİLİYOR: `.marquee-track` animasyonu şeridi
 * `translateX(-50%)` kadar kaydırır. Bu, ancak şerit içeriği tam olarak iki
 * kopyadan oluşuyorsa kusursuz bir döngü verir — ikinci kopyanın başı, birinci
 * kopyanın başının tam olarak bulunduğu yere gelir ve sıçrama görünmez. Tek
 * kopyayla animasyonun sonunda şerit boşluğa kayardı.
 *
 * İkinci kopya `aria-hidden`: ekran okuyucu aynı içeriği iki kez duyurmamalı.
 * (Birinci kopyadaki görsellerin `alt` metinleri zaten sunuluyor.)
 *
 * `prefers-reduced-motion` altında animasyon tamamen durur ve şerit başlangıç
 * konumunda sabitlenir (bkz. globals.css) — süreyi 0.01ms'e indirmek şeridi
 * son karesinde, yani yarısı ekran dışında dondururdu.
 */
export function CollageMarquee({ locale }: { locale: AppLocale }) {
  const strip = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {MARQUEE_SLOTS.map((slot, index) => (
        <div className="flex shrink-0 items-center gap-8" key={`${ariaHidden ? 'b' : 'a'}-${slot.id}`}>
          <div className="h-28 w-28 shrink-0 md:h-36 md:w-36">
            <CollageFrame
              index={index}
              locale={locale}
              sizes="(max-width: 768px) 112px, 144px"
              slot={slot}
            />
          </div>
          <SunMark className="ink-sun h-8 w-8 shrink-0 md:h-10 md:w-10" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="overflow-hidden border-y border-text bg-background py-8" style={{ ['--marquee-duration' as string]: '46s' }}>
      <div className="marquee-track">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  )
}
