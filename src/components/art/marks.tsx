import { cn } from '@/lib/utils/cn'

/**
 * =============================================================================
 * EL ÇİZİMİ İŞARETLER — YER TUTUCU KATMAN
 * =============================================================================
 * Bunlar EDEN'in nihai illüstrasyonları DEĞİLDİR. Kullanıcı gerçek el çizimi
 * varlıkları (yoga figürleri, doodle'lar, kolaj parçaları) kendisi üretecek
 * (karar, 2026-09-05); buradaki işaretler o varlıklar gelene kadar zine dilinin
 * ayakta durmasını sağlar.
 *
 * NEDEN SVG, NEDEN GÖRSEL DOSYASI DEĞİL: yer tutucu olarak bir görsel dosyası
 * koymak, o dosyanın gerçek bir varlık sanılması ve sitede kalması riskini
 * taşırdı. Inline SVG hem tek renkli (`currentColor`) olduğu için paletle
 * kendiliğinden uyumlu, hem de değiştirileceği apaçık.
 *
 * ORTAK KURALLAR:
 *   - `fill="none"` + `stroke="currentColor"`: renk çağırandan gelir, işaretin
 *     içine gömülmez. Böylece zeytin alanda krem, krem alanda zeytin olur.
 *   - `strokeLinecap="round"`: kalem ucu hissi. Köşeli uç dijital görünür.
 *   - `aria-hidden`: hepsi DEKORATİFTİR. Hiçbiri bilgi taşımaz, dolayısıyla
 *     ekran okuyucuya duyurulmaz. Bilgi taşıyan bir işaret gerekirse `role="img"`
 *     ve `<title>` ile AYRI bir bileşen yazılmalıdır.
 */

/**
 * Posterin turuncu güneşi. Işınlar kasıtlı olarak eşit aralıklı DEĞİL —
 * matematiksel bir yıldız, elle çizilmiş bir güneş gibi durmaz.
 */
export function SunMark({ className = '' }: { className?: string }) {
  // Işın uçlarının açıları (derece) ve uzunlukları elle seçilmiştir; düzenli
  // bir `map(i => i * 30)` üretmek istenen düzensizliği yok ederdi.
  const rays: [angle: number, length: number][] = [
    [0, 21], [26, 17], [53, 20], [78, 16], [104, 21], [131, 18],
    [155, 20], [180, 17], [206, 21], [232, 16], [258, 20], [284, 18],
    [310, 21], [336, 17],
  ]
  return (
    <svg aria-hidden className={cn('block', className)} fill="none" viewBox="0 0 100 100">
      <circle cx="50" cy="50" fill="currentColor" r="21" />
      {rays.map(([angle, length]) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 50 + Math.cos(rad) * 24
        const y1 = 50 + Math.sin(rad) * 24
        const x2 = 50 + Math.cos(rad) * (24 + length)
        const y2 = 50 + Math.sin(rad) * (24 + length)
        return (
          <line
            key={angle}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
            x1={x1}
            x2={x2}
            y1={y1}
            y2={y2}
          />
        )
      })}
    </svg>
  )
}

/**
 * Posterin tarih satırının altındaki dalgalı kalem çizgisi. Bölüm başlıklarının
 * altında ayraç olarak da kullanılır.
 */
export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={cn('block', className)} fill="none" viewBox="0 0 120 14">
      <path
        d="M2 8C10 2 18 2 26 8s16 6 24 0 16-6 24 0 16 6 24 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}

/**
 * Elle çizilmiş altı çizgisi — bir kelimenin altına marker'la çekilmiş çizgi.
 * Tek bir düz çizgi değil, hafifçe kavisli ve kalınlığı değişen bir yol.
 */
export function HandUnderline({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={cn('block w-full', className)} fill="none" preserveAspectRatio="none" viewBox="0 0 200 10">
      <path
        d="M3 7.2C38 3.4 76 2.2 116 3.4c28 .9 51 2.4 81 4.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  )
}

/**
 * Zeytin dalı — EDEN'in Assos/Ege bağlamının işareti. Bölüm köşelerinde ve
 * kolaj boşluklarında kullanılır.
 */
export function OliveBranch({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={cn('block', className)} fill="none" viewBox="0 0 80 120">
      <path d="M40 116C40 82 38 46 30 8" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
      {[
        [30, 24, -1], [33, 44, 1], [35, 62, -1], [37, 80, 1], [38, 96, -1],
      ].map(([x, y, dir]) => (
        <ellipse
          cx={x + dir * 13}
          cy={y}
          key={`${x}-${y}`}
          rx="13"
          ry="6"
          stroke="currentColor"
          strokeWidth="2.2"
          transform={`rotate(${dir * 28} ${x + dir * 13} ${y})`}
        />
      ))}
    </svg>
  )
}

/**
 * Elle çizilmiş ok — "buraya bak" anotasyonu. Kalemle çizilmiş gibi hafif
 * kavisli bir gövde ve iki kısa uç.
 */
export function HandArrow({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={cn('block', className)} fill="none" viewBox="0 0 60 40">
      <path d="M4 8C18 8 34 14 50 30" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
      <path d="M50 30L36 29M50 30L48 16" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  )
}

/**
 * Bir kelimenin etrafına elle çizilmiş oval — posterdeki "vurgu daireleri".
 * `preserveAspectRatio="none"` ile sarmaladığı metnin genişliğine uyar.
 */
export function HandCircle({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 200 60"
    >
      <path
        d="M100 4C152 4 194 16 194 30c0 15-44 26-96 26C50 56 6 45 6 30 6 16 46 5 96 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  )
}
