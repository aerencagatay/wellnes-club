import { useTranslations } from 'next-intl'
import type { WellnessEvent } from '@/content'
import { SunMark, Squiggle } from '@/components/art/marks'
import { Tilt } from '@/components/motion/tilt'
import { Button } from '@/components/ui/button'
import type { AppLocale } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'
import { formatEventDate, formatEventPrice, getReservationHref } from '@/lib/utils/event-display'

/**
 * ETKİNLİK KARTI = MİNİ POSTER.
 *
 * Kartın üst yarısı bir FOTOĞRAF DEĞİL, o etkinliğe ait üretilmiş bir
 * posterdir: zeytin alan, turuncu güneş, krem başlık, el yazısı tarih ve
 * "Move · Breathe · Connect" satırı — EDEN'in gerçek duyuru posterinin
 * kompozisyonu (bkz. public/img/poster/…-duyuru.jpeg).
 *
 * NEDEN ÜRETİLMİŞ POSTER, NEDEN GÖRSEL DEĞİL: her retreat'in kendi grafik
 * kimliği olması isteniyor (prompt §Upcoming Yoga Retreat Showcase), ama
 * elimizde etkinlik başına ayrı bir illüstrasyon YOK. İki kötü seçenek vardı —
 * her karta aynı stok fotoğrafı koymak (kartlar birbirinden ayrılmaz) veya
 * aynı poster görselini tekrarlamak (aynı sorun). Poster'ı tipografiyle KURMAK
 * üçüncü yolu açıyor: kompozisyon ortak, içerik (başlık, tarih, konum) her
 * etkinlikte farklı, dolayısıyla her kart kendi kimliğini kazanıyor — ve
 * gerçek illüstrasyonlar geldiğinde `media` alanı zaten yerinde duruyor.
 *
 * KARTIN İKİNCİ İŞİ GERÇEK/ÖRNEK AYRIMINI GÖRÜNÜR KILMAKTIR (bkz.
 * content/types.ts → `WellnessEvent.isPlaceholder`). `isPlaceholder: true`
 * kayıtlar henüz PLANLANMAMIŞ etkinliklerdir; site canlı bir işletmeye ait
 * olduğu için bunları gerçekmiş gibi göstermek müşteriyi yanıltır. Bu yüzden
 * örnek kartta:
 *   - görünür bir "ÖRNEK" rozeti vardır,
 *   - fiyat HİÇ render edilmez (sadece boş bırakılmaz — DOM'a girmez),
 *   - tarih yerine `dateTba` yazar,
 *   - CTA gerçek bir bağlantı değil, `disabled` bir `<button>`dur.
 *
 * `disabled` kararı `getReservationHref`in `undefined` dönüşüne bağlanmıştır,
 * `isPlaceholder`a ikinci kez bakılarak DEĞİL: tek kaynak kalsın ki ileride
 * "gerçek ama henüz kampa bağlanmamış" bir kayıt da kendiliğinden pasif CTA
 * alsın.
 */
export function EventCard({ event, locale }: { event: WellnessEvent; locale: AppLocale }) {
  const t = useTranslations('events')
  const tCategory = useTranslations('eventCategory')

  const reservationHref = getReservationHref(event)
  const isReal = !event.isPlaceholder && reservationHref !== undefined

  // Kart bir NESNE gibi ele alınır: işaretçi yaklaştığında duvardan öne gelir
  // ve imlecin köşesine doğru eğilir (bkz. motion/tilt.tsx).
  //
  // `mount` KAPALI — paspartu düzlemi çerçeveli baskılar içindir; bu kartın
  // kendi opak zemini zaten var ve arkasına ikinci bir düzlem koymak yalnızca
  // kenarlarda kum rengi bir sızıntı üretirdi.
  //
  // `intensity` DÜŞÜK (0.5): aynı açı, kolaj parçasından çok daha geniş bir
  // yüzeyde orantısız büyük bir hareket olarak okunur ve kartın içindeki metni
  // okunmaz hâle getirir.
  return (
    <Tilt className="h-full" intensity={0.5} mount={false}>
      <article
        className={cn(
          // Galeri çerçevesi: keskin köşe + siyah hairline, gölge YOK. Gerçek
          // etkinlik 2px'lik kalın çerçeveyle öne çıkar; örnekler ince çizgide
          // kalır. Kalınlık farkı tek başına taşımıyor — rozet, fiyat ve CTA
          // durumu da ayrımı tekrarlıyor (renk/kalınlık körlüğüne karşı).
          'group flex h-full flex-col bg-background transition-transform duration-300 ease-out hover:-translate-y-1',
          isReal ? 'border-2 border-text' : 'border border-text/45',
        )}
      >
        {/* ---- POSTER ALANI ---- */}
        <div className="field-forest grain relative flex aspect-4/5 flex-col items-center justify-center overflow-hidden px-6 text-center">
          <SunMark className="ink-sun h-14 w-14 shrink-0" />

          <h3 className="mt-5 font-heading text-2xl leading-[1.05] font-bold tracking-[-0.03em] text-background text-balance">
            {event.title[locale]}
          </h3>

          <p className="type-hand-sm mt-4">{formatEventDate(event, locale, t('dateTba'))}</p>

          <Squiggle className="ink-sun mt-3 h-2.5 w-16 shrink-0" />

          <p className="mt-3 font-body text-[10px] font-semibold tracking-[0.2em] text-background uppercase">
            {event.location[locale]}
          </p>

          {/* Posterin alt satırı — marka mottosu. Çevrilmez: EDEN'in kendi
              İngilizce sloganıdır (posterde de İngilizce duruyor). */}
          <p className="mt-auto pt-6 pb-1 font-body text-[9px] font-medium tracking-[0.26em] text-background/85 uppercase">
            Move · Breathe · Connect
          </p>

          {/* Kategori ve ÖRNEK rozetleri posterin üzerinde, iki üst köşede.
              Keskin köşeli ve dolgulu — highlighter işareti gibi. */}
          <span className="absolute top-0 left-0 bg-background px-2.5 py-1.5 text-[9px] font-bold tracking-[0.18em] text-text uppercase">
            {tCategory(event.category)}
          </span>
          {event.isPlaceholder && (
            <span className="absolute top-0 right-0 bg-yellow px-2.5 py-1.5 text-[9px] font-bold tracking-[0.18em] text-text uppercase">
              {t('placeholderBadge')}
            </span>
          )}
        </div>

        {/* ---- KÜNYE ---- */}
        <div className="flex flex-1 flex-col border-t border-text p-6">
          <p className="type-lede line-clamp-3 text-sm">{event.shortDescription[locale]}</p>

          {/* `mt-auto` kart yüksekliklerini eşitlerken CTA'ları aynı hizaya çeker. */}
          <div className="mt-auto pt-6">
            {isReal ? (
              <>
                <p className="mb-4 flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-bold tracking-[-0.02em] text-text">
                    {formatEventPrice(event, locale, t('priceTba'))}
                  </span>
                  <span className="type-eyebrow">{t('perPerson')}</span>
                </p>
                <Button className="w-full" href={reservationHref} variant="primary">
                  {t('reserve')}
                  {/* Hover'da beliren ince ok ipucu — dekoratif, ekran okuyucudan gizli. */}
                  <span
                    aria-hidden
                    className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    →
                  </span>
                </Button>
              </>
            ) : (
              <>
                <p className="mb-4 border-l-2 border-text/25 pl-4 text-sm text-muted">{t('placeholderNote')}</p>
                <Button className="w-full" disabled variant="ghost">
                  {t('reserveDisabled')}
                </Button>
              </>
            )}
          </div>
        </div>
      </article>
    </Tilt>
  )
}
