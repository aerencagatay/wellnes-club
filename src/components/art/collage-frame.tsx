import Image from 'next/image'
import type { CollageSlot } from '@/content/collage'
import type { AppLocale } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'

/**
 * Kolaj parçası: hairline çerçeveli, hafifçe eğik, isteğe bağlı olarak bandla
 * yapıştırılmış bir görsel.
 *
 * EĞİKLİK NEDEN SABİT BİR LİSTEDEN GELİYOR (`ROTATIONS`) VE RASTGELE DEĞİL:
 * bu bileşen sunucuda render ediliyor. `Math.random()` sunucu ve istemcide
 * farklı değer üretir ve hydration uyuşmazlığına yol açardı. Deterministik bir
 * dizi, kolajın istenen "elle yapıştırılmış" düzensizliğini hydration'ı
 * bozmadan verir.
 *
 * ÇERÇEVE GÖLGE DEĞİL: sistemde gölge yok (bkz. globals.css). Parçanın
 * kağıttan ayrılmasını sağlayan şey 1px siyah hairline; hover'da parça
 * doğrulur (`rotate-0`) ve çerçeve kalınlaşır.
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
}) {
  const rotation = ROTATIONS[index % ROTATIONS.length]

  return (
    <div
      className={cn(
        'group relative h-full w-full transition-transform duration-500 ease-out hover:rotate-0',
        tape && 'tape',
        className,
      )}
      style={{ rotate: rotation }}
    >
      <div className="relative h-full w-full overflow-hidden border border-text bg-surface transition-[border-width] duration-300">
        <Image
          alt={slot.alt[locale]}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          fill
          priority={priority}
          sizes={sizes}
          src={slot.src}
        />
      </div>

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
