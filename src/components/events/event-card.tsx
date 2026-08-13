import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { WellnessEvent } from '@/content'
import { BorderBeam } from '@/components/motion/border-beam'
import { Button } from '@/components/ui/button'
import type { AppLocale } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'
import { formatEventDate, formatEventPrice, getReservationHref } from '@/lib/utils/event-display'

/**
 * Editoryal etkinlik kartı — SaaS fiyat kartı değil: ağırlık görselde ve
 * başlıkta, meta veriler (tarih/konum) ince bir alt satırda durur.
 *
 * KARTIN ASIL İŞİ GERÇEK/ÖRNEK AYRIMINI GÖRÜNÜR KILMAKTIR (bkz.
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
  // Video kayıtlarda poster zorunludur (types.ts); yine de `src`e düşerek
  // kartın hiçbir koşulda görselsiz kalmamasını garanti ediyoruz.
  const imageSrc = event.media.type === 'video' ? (event.media.poster ?? event.media.src) : event.media.src

  return (
    <article
      className={cn(
        // Yumuşak kart yüzeyi: yuvarlatılmış köşe + hafif gölge; hover'da
        // gölge derinleşir ve kart bir tık kalkar. `overflow-hidden` şart,
        // yoksa görsel yuvarlatılmış köşenin dışına taşar.
        'group relative flex h-full flex-col overflow-hidden bg-surface rounded-[var(--radius-card)]',
        'shadow-[var(--shadow-card)] transition-all duration-300 ease-out',
        'hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]',
        // Gerçek etkinlik zeytin çerçeveyle öne çıkar; örnekler soluk kum
        // çizgide kalır. Renk farkı tek başına taşımıyor: rozet, fiyat ve CTA
        // durumu da ayrımı tekrarlıyor (renk körlüğü için).
        isReal ? 'border border-olive/35' : 'border border-sand/70',
      )}
    >
      <div className="relative aspect-4/5 overflow-hidden">
        {/* `priority` bilinçli olarak YOK: rail hero'nun (min-h-svh) altında,
            ilk ekranın dışında kalır — buradaki bir preload gerçek LCP öğesiyle
            bant genişliği için yarışırdı. */}
        <Image
          alt={event.media.alt[locale]}
          className={cn(
            'object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]',
            // Örnek kayıtların görseli hafifçe geri çekilir — bunlar zaten
            // etkinliğin kendi fotoğrafı değil, atmosfer görselidir.
            !isReal && 'opacity-90 saturate-[0.85]',
          )}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 340px, 420px"
          src={imageSrc}
        />
        {/* Kategori etiketi görselin üzerinde: kartın ilk okunan öğesi başlık
            değil "bu ne tür bir buluşma" olsun. */}
        {/* Rozetler hap biçiminde: yuvarlatılmış kart diliyle aynı yumuşaklık. */}
        <span className="absolute top-4 left-4 rounded-full bg-background/92 px-3 py-1.5 text-[10px] font-medium tracking-[0.22em] text-text uppercase">
          {tCategory(event.category)}
        </span>
        {event.isPlaceholder && (
          <span className="absolute top-4 right-4 rounded-full border border-text/20 bg-background/92 px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-muted uppercase">
            {t('placeholderBadge')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-2xl leading-tight font-medium text-text">{event.title[locale]}</h3>

        <p className="mt-3 text-sm text-muted transition-colors duration-300 group-hover:text-text">
          {formatEventDate(event, locale, t('dateTba'))}
        </p>
        <p className="mt-1 text-sm text-muted transition-colors duration-300 group-hover:text-text">
          {event.location[locale]}
        </p>

        {/* `mt-auto` kart yüksekliklerini eşitlerken CTA'ları aynı hizaya çeker. */}
        <div className="mt-auto pt-6">
          {isReal ? (
            <>
              <p className="mb-4 text-sm text-text">
                <span className="font-heading text-lg">{formatEventPrice(event, locale, t('priceTba'))}</span>{' '}
                <span className="text-muted">{t('perPerson')}</span>
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
              <p className="mb-4 text-sm text-muted">{t('placeholderNote')}</p>
              <Button className="w-full" disabled variant="ghost">
                {t('reserveDisabled')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Dolaşan ışık hüzmesi YALNIZCA gerçek etkinlikte: hareket burada
          "gerçekten katılabileceğin şey bu" anlamını taşıyor. */}
      {isReal && <BorderBeam duration={10} size={90} />}
    </article>
  )
}
