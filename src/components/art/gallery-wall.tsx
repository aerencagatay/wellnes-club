'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { CollageSlot } from '@/content/collage'
import type { AppLocale } from '@/i18n/routing'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { CollageFrame } from './collage-frame'

/**
 * =============================================================================
 * GALERİ DUVARI — SİTENİN "ÖZEL SERGİ" ANI
 * =============================================================================
 * Parçalar düz bir ızgarada değil, KIRIK BİR DUVARDA asılı: her sütun kendi
 * açısına ve kendi derinliğine sahip, böylece duvar izleyiciye doğru hafifçe
 * kavislenir. Kaydırma boyunca duvarın tamamı Y ekseninde döner — bir sergi
 * salonunda duvarın önünden yürürken parçaların açısının değişmesi gibi.
 *
 * DÜZ IZGARADAN FARKI NEDEN ÖNEMLİ: düz bir ızgara "ürün listesi" okur. Aynı
 * görseller, aynı boyutlar, aynı boşluklar — ama farklı açı ve derinlikte —
 * "asılmış nesne" okur. Fark tamamen mekânsal; hiçbir görsel efekt eklenmiyor.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NEDEN TEK BİR KAYDIRMA ÖLÇÜMÜ: her parça kendi `useScroll`unu kursaydı, aynı
 * karede beş ayrı `getBoundingClientRect()` çağrısı yapılır ve tarayıcı her
 * biri için layout'u yeniden hesaplardı (layout thrashing). Duvar tek bir
 * ilerleme değeri ölçer, parçalar ondan türetilir.
 *
 * HAREKET AZALTMA: perspektif ve dönüş hiç KURULMAZ — parçalar düz ızgarada
 * durur. 3B dönüşüm vestibüler rahatsızlığın güçlü bir tetikleyicisidir;
 * süreyi kısaltmak burada yeterli bir uyum değildir.
 */

/**
 * Sütun düzeni: her yuvanın ızgaradaki yeri, duvardaki AÇISI ve DERİNLİĞİ.
 *
 * Açı işareti sütunun hangi yanda olduğunu izler: soldaki parçalar sağa
 * (pozitif `rotateY`), sağdakiler sola döner. Böylece duvar merkeze doğru
 * kapanan sığ bir "V" oluşturur ve izleyici odanın içinde durur gibi olur.
 * Merkez sütun düz kalır ve en öndedir — bakışın dinlendiği yer.
 */
const PIECES = [
  { className: 'col-span-2 md:col-span-3 md:row-span-2 aspect-square', rotateY: 9, z: -140, sizes: '(max-width: 768px) 100vw, 42vw' },
  { className: 'col-span-1 md:col-span-2 aspect-square', rotateY: -5, z: 40, sizes: '(max-width: 768px) 50vw, 28vw' },
  { className: 'col-span-1 md:col-span-2 aspect-square', rotateY: -9, z: -90, sizes: '(max-width: 768px) 50vw, 28vw' },
  { className: 'col-span-1 md:col-span-2 aspect-4/5', rotateY: -4, z: 90, sizes: '(max-width: 768px) 50vw, 28vw' },
  { className: 'col-span-1 md:col-span-2 aspect-4/5', rotateY: -10, z: -50, sizes: '(max-width: 768px) 50vw, 28vw' },
] as const

export function GalleryWall({ slots, locale }: { slots: CollageSlot[]; locale: AppLocale }) {
  const ref = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Yay, tekerleğin her tık'ındaki sıçramayı emer. 3B dönüşümde ham kaydırma
  // değeri "titreme" olarak görünür; yay onu vinç hareketine çevirir.
  const eased = useSpring(scrollYProgress, { stiffness: 70, damping: 24, restDelta: 0.001 })

  // Duvar, görünümden geçerken -7° → +7° döner. Aralık DAR tutuldu: daha
  // geniş bir dönüş parçaların kenarlarını kısaltıp metni okunmaz hâle
  // getiriyordu (perspektif kısalması).
  const wallRotate = useTransform(eased, [0, 1], [-7, 7])
  // Duvar aynı anda hafifçe yaklaşır: uzaktan yakına, bir adım atmak gibi.
  const wallZ = useTransform(eased, [0, 0.5, 1], [-120, 20, -120])

  return (
    <ul
      className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-7 md:gap-5"
      data-testid="past-gallery"
      ref={ref}
      style={reduced ? undefined : { perspective: '1600px', transformStyle: 'preserve-3d' }}
    >
      {slots.map((slot, index) => {
        const piece = PIECES[index % PIECES.length]
        return (
          <WallPiece
            className={piece.className}
            index={index}
            key={slot.id}
            locale={locale}
            piece={piece}
            reduced={reduced}
            slot={slot}
            wallRotate={wallRotate}
            wallZ={wallZ}
          />
        )
      })}
    </ul>
  )
}

function WallPiece({
  slot,
  locale,
  index,
  className,
  piece,
  wallRotate,
  wallZ,
  reduced,
}: {
  slot: CollageSlot
  locale: AppLocale
  index: number
  className: string
  piece: (typeof PIECES)[number]
  wallRotate: ReturnType<typeof useTransform<number, number>>
  wallZ: ReturnType<typeof useTransform<number, number>>
  reduced: boolean
}) {
  // Parçanın kendi sabit açısı, duvarın döner açısıyla TOPLANIR: duvar
  // dönerken parçalar arasındaki açı farkı korunur, hepsi birlikte hareket
  // eder. Aksi halde duvar dönerken parçalar birbirine göre kayardı ve
  // bütünlük hissi (aynı duvara asılı olma) kaybolurdu.
  const rotateY = useTransform(wallRotate, (value) => value + piece.rotateY)
  const translateZ = useTransform(wallZ, (value) => value + piece.z)

  if (reduced) {
    return (
      <li className={className}>
        <CollageFrame index={index} locale={locale} sizes={piece.sizes} slot={slot} />
      </li>
    )
  }

  return (
    <motion.li
      className={className}
      // `initial`/`whileInView`: parça görünüme girerken kendi düzleminde
      // belirir. `once: true` — her kaydırmada yeniden oynayan bir giriş,
      // sayfayı ileri geri gezen ziyaretçi için yorucu olur.
      initial={{ opacity: 0, y: 40 }}
      style={{ rotateY, translateZ, transformStyle: 'preserve-3d' }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <CollageFrame
        index={index}
        // Büyük parçalarda eğim şiddeti düşürülür: aynı açı, geniş bir yüzeyde
        // orantısız büyük bir hareket olarak okunur.
        intensity={piece.className.includes('row-span-2') ? 0.6 : 1}
        locale={locale}
        sizes={piece.sizes}
        slot={slot}
        tape={index % 3 === 0}
      />
    </motion.li>
  )
}
