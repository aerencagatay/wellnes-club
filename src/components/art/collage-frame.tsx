import Image from 'next/image'
import type { CollageSlot } from '@/content/collage'
import { Tilt } from '@/components/motion/tilt'
import type { AppLocale } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'

/**
 * Kolaj parçası: hairline çerçeveli, hafifçe eğik, isteğe bağlı olarak bandla
 * yapıştırılmış bir görsel — ve işaretçi yaklaştığında duvardan öne gelen bir
 * nesne (bkz. motion/tilt.tsx).
 *
 * İKİ AYRI EĞİKLİK VAR, KARIŞTIRMAYIN:
 *
 *   1. `ROTATIONS` — 2B, SABİT, kaydırmadan bağımsız. "Panoya elle
 *      yapıştırılmışlık" açısı. Sunucuda hesaplanır.
 *   2. `Tilt` — 3B, işaretçiye tepki veren, geçici. Parçayı ele alma jesti.
 *
 * Birincisi parçanın DURUŞU, ikincisi parçayla KURULAN İLİŞKİ. Tek bir
 * dönüşümde birleştirilemezler: biri kalıcı ve deterministik olmak zorunda
 * (hydration), diğeri istemcide yaşıyor.
 *
 * EĞİKLİK NEDEN SABİT BİR LİSTEDEN GELİYOR VE RASTGELE DEĞİL: bu bileşen
 * sunucuda render ediliyor. `Math.random()` sunucu ve istemcide farklı değer
 * üretir ve hydration uyuşmazlığına yol açardı. Deterministik bir dizi,
 * kolajın istenen "elle yapıştırılmış" düzensizliğini hydration'ı bozmadan
 * verir.
 *
 * ÇERÇEVE GÖLGE DEĞİL: sistemde gölge yok (bkz. globals.css). Parçanın
 * kağıttan ayrılmasını sağlayan şey 1px siyah hairline ve arkasındaki gerçek
 * paspartu düzlemi — bir CSS gölgesi değil, çerçeveli bir baskının arkasındaki
 * montaj kartonunun karşılığı.
 */

/** Derece cinsinden; index'e göre döngüsel olarak uygulanır. */
const ROTATIONS = ['-1.8deg', '1.4deg', '-0.9deg', '2.1deg', '-2.4deg', '1.1deg']

export function CollageFrame({
  slot,
  locale,
  index = 0,
  sizes,
  className = '',
  tape = false,
  priority = false,
  /** 3B eğim şiddeti — büyük parçalarda düşürülür (bkz. Tilt). */
  intensity = 1,
}: {
  slot: CollageSlot
  locale: AppLocale
  /** Eğiklik açısını seçer — aynı index aynı açıyı verir. */
  index?: number
  sizes: string
  className?: string
  /** Üstüne washi bant yapıştırır (bkz. globals.css `.tape`). */
  tape?: boolean
  priority?: boolean
  intensity?: number
}) {
  const rotation = ROTATIONS[index % ROTATIONS.length]

  return (
    <div
      className={cn('group relative h-full w-full', tape && 'tape', className)}
      style={{ rotate: rotation }}
    >
      <Tilt className="relative h-full w-full" intensity={intensity}>
        <div className="relative h-full w-full overflow-hidden border border-text bg-surface">
          <Image
            alt={slot.alt[locale]}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            fill
            priority={priority}
            sizes={sizes}
            src={slot.src}
          />
        </div>
      </Tilt>

      {/* Yalnızca geliştirme ortamında görünen yer tutucu işareti: bu yuvanın
          gerçek bir varlık taşımadığını, poster dolgusu olduğunu söyler.
          Yayında hiç render edilmez — ziyaretçi için bir anlamı yok, ama
          varlıkları yerleştirecek kişi için hangi yuvaların boş olduğunu
          görmenin tek yolu bu. */}
      {process.env.NODE_ENV !== 'production' && slot.isFiller && (
        <span
          className="pointer-events-none absolute bottom-2 left-2 z-3 bg-yellow px-1.5 py-0.5 text-[9px] font-bold tracking-[0.12em] text-text uppercase"
          data-testid="collage-filler-badge"
        >
          filler
        </span>
      )}
    </div>
  )
}
