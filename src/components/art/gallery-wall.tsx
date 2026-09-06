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
 * karede parça sayısı kadar `getBoundingClientRect()` çağrısı yapılır ve
 * tarayıcı her biri için layout'u yeniden hesaplardı (layout thrashing). Duvar
 * TEK bir ilerleme değeri ölçer, parçalar ondan türetilir.
 *
 * HAREKET AZALTMA: perspektif ve dönüş hiç KURULMAZ — parçalar düz ızgarada
 * durur. 3B dönüşüm vestibüler rahatsızlığın güçlü bir tetikleyicisidir;
 * süreyi kısaltmak burada yeterli bir uyum değildir.
 */

/**
 * Sütun düzeni: her yuvanın ızgaradaki yeri, duvardaki AÇISI ve DERİNLİĞİ.
 *
 * DÖRT PARÇA. İlk üçü dikey (kolaj panolarının kendi oranı), dördüncüsü kare
 * (duyuru posterinin oranı) — ızgara parçaların GERÇEK oranlarını izliyor,
 * onları ortak bir kalıba zorlamıyor. Kırpılmış bir kolaj kolaj olmaktan çıkar.
 *
 * GENİŞLİKLER NEDEN BİRBİRİNE YAKIN: poster bir ara dört sütun kaplıyordu ve
 * KARE olduğu için yüksekliği de genişliğiyle birlikte büyüyüp diğer üç
 * parçayı eziyordu (doğrulandı: tek başına duvarın yarısından fazlasını
 * kaplıyordu). Dikey bir görsele geniş sütun vermek aynı tuzağın diğer yüzü —
 * 4:5 bir parça ne kadar genişlerse o kadar UZAR. Bu yüzden dikeyler ikişer,
 * poster üç sütun; fark kompozisyona ritim verecek kadar var, hiyerarşiyi
 * bozacak kadar değil.
 *
 * Poster `col-start-3` ile ikinci sıraya kaydırılır: sağda ve solda kasıtlı
 * boşluk kalır. Dolu bir ızgara "galeri duvarı" değil "katalog" okur.
 *
 * Açı işareti sütunun hangi yanda olduğunu izler: soldaki parça sağa (pozitif
 * `rotateY`), sağdakiler sola döner. Böylece duvar merkeze doğru kapanan sığ
 * bir "V" oluşturur ve izleyici odanın içinde durur gibi olur. En geniş parça
 * en GERİDE (z: -140): büyük bir yüzey öne alındığında duvarı ezip diğer üçünü
 * kaybettiriyordu.
 */
const PIECES = [
  { className: 'col-span-1 md:col-span-2 aspect-4/5', rotateY: 8, z: -110, sizes: '(max-width: 768px) 50vw, 26vw' },
  { className: 'col-span-1 md:col-span-2 aspect-4/5', rotateY: -3, z: 60, sizes: '(max-width: 768px) 50vw, 26vw' },
  { className: 'col-span-1 md:col-span-2 aspect-4/5', rotateY: -9, z: -70, sizes: '(max-width: 768px) 50vw, 26vw' },
  { className: 'col-span-2 md:col-span-3 md:col-start-3 aspect-square', rotateY: 5, z: 100, sizes: '(max-width: 768px) 100vw, 40vw' },
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
      // `items-start`: her parça KENDİ yüksekliğini korur. Varsayılan `stretch`
      // satırdaki en uzun parçaya uydurup diğerlerinin oranını bozuyordu.
      className="mt-14 grid grid-cols-2 items-start gap-4 md:grid-cols-7 md:gap-5"
      data-testid="mood-wall"
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
