import { SunMark } from './marks'

/**
 * Hero ile etkinlik showcase'i arasındaki akan bant.
 *
 * ESKİDEN KOLAJ PANOLARINI TAŞIYORDU, ARTIK TİPOGRAFİK (2026-09-06). Sebep
 * doğrudan mood duvarı kararının sonucu: duvar aynı üç panoyu daha büyük ve
 * daha iyi bir kompozisyonda gösteriyor. Şerit de onları taşımaya devam
 * etseydi ziyaretçi aynı dört görseli tek sayfada iki kez görecekti — ve
 * tekrar, kolajın "her parça ayrı bir şey" iddiasını en hızlı bozan şeydir.
 *
 * Yerine geçen şey bir kayıp değil, üçüncü bir doku: harf. Zine dilinde akan
 * tipografi bandı (protest afişi, plak kapağı, fanzin arka kapağı) en az kolaj
 * kadar yerleşik bir öğe ve sayfaya görsel yerine RİTİM katıyor.
 *
 * METİN ÇEVRİLMEZ: "Move · Breathe · Connect" markanın kendi sloganı, "Assos"
 * ve "Çanakkale" ise yer adı. Bant bilgi taşımıyor, kimlik taşıyor — bu yüzden
 * `aria-hidden` ve ekran okuyucuya hiç duyurulmuyor. Aynı bilgiler sayfanın
 * gerçek metinlerinde zaten var.
 *
 * İÇERİK NEDEN İKİ KEZ RENDER EDİLİYOR: `.marquee-track` animasyonu şeridi
 * `translateX(-50%)` kadar kaydırır. Bu, ancak içerik tam olarak iki
 * kopyadan oluşuyorsa kusursuz bir döngü verir — ikinci kopyanın başı,
 * birincinin başının bulunduğu yere gelir ve sıçrama görünmez. Tek kopyayla
 * animasyonun sonunda şerit boşluğa kayardı.
 *
 * `prefers-reduced-motion` altında animasyon durur ve şerit başlangıç
 * konumunda sabitlenir (bkz. globals.css) — süreyi 0.01ms'e indirmek şeridi
 * yarısı ekran dışında dondururdu.
 */

/**
 * Bandın tek turu.
 *
 * "Assos" ve "Çanakkale" ÇIKARILDI (kullanıcı kararı, 2026-09-07). Sebep
 * yalnızca uzunluk değil: kulüp İstanbul çevresi, Ege ve Akdeniz'de çalışıyor,
 * tek bir yer adını markanın sloganıyla aynı bantta tekrarlamak kapsamı
 * olduğundan dar gösteriyordu. Kalanlar marka sözü ve faaliyet — ikisi de her
 * retreat için doğru.
 */
const WORDS = ['Move', 'Breathe', 'Connect', 'Yoga', 'Retreat']

export function CollageMarquee() {
  const strip = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center gap-10 pr-10" key={ariaHidden ? 'b' : 'a'}>
      {WORDS.map((word) => (
        <div className="flex shrink-0 items-center gap-10" key={word}>
          <span className="font-heading text-3xl font-bold tracking-[-0.03em] whitespace-nowrap text-text md:text-5xl">
            {word}
          </span>
          <SunMark className="ink-sun h-6 w-6 shrink-0 md:h-8 md:w-8" />
        </div>
      ))}
    </div>
  )

  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-text bg-background py-6 md:py-8"
      style={{ ['--marquee-duration' as string]: '38s' }}
    >
      <div className="marquee-track">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  )
}
