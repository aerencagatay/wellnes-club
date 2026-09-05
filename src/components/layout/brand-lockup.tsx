import { cn } from '@/lib/utils/cn'

const SIZES = {
  sm: { main: 'text-lg', sub: 'text-[8px] tracking-[0.35em]', rule: 'w-3' },
  md: { main: 'text-2xl', sub: 'text-[9px] tracking-[0.4em]', rule: 'w-4' },
  // Ortalanmış navbar'ın marka satırı: sayfayı marka adı "ortalasın" istendiği
  // için (kullanıcı isteği, 2026-08-13) lockup navbar'da bir yardımcı öğe
  // değil, kompozisyonun merkezi — bu yüzden kendi ölçeği var.
  nav: { main: 'text-[30px] md:text-[38px]', sub: 'text-[9px] tracking-[0.42em] md:text-[10px]', rule: 'w-5' },
  lg: { main: 'text-4xl md:text-5xl', sub: 'text-[10px] tracking-[0.45em]', rule: 'w-6' },
} as const

/**
 * Markanın METİN karşılığı — navbar ve footer'da kullanılır.
 *
 * Tipografi logoyu ve posteri TAKLİT EDER: "EDEN" display serif (Fraunces) ve
 * dolgun ağırlıkla; altındaki "WELLNESS CLUB" grotesk (Inter) ve çok geniş
 * harf aralığıyla, İKİ YANINDA KISA ÇİZGİYLE — posterdeki ikinci satırın
 * birebir karşılığı. Çizgiler `aria-hidden`: dekoratif ayraçlar, bilgi
 * taşımazlar.
 *
 * Bir zamanlar ikisi de Montserrat ExtraLight ile yazılıyordu; bu, groovy bir
 * serifte anlamsız (şişkin gövdeler kaybolur) ve logoyla akrabalığı yoktu.
 */
export function BrandLockup({
  transparent = false,
  size = 'md',
}: {
  transparent?: boolean
  size?: keyof typeof SIZES
}) {
  const { main, sub, rule } = SIZES[size]
  return (
    <span
      className={cn(
        'flex flex-col items-center leading-none transition-colors duration-300',
        transparent ? 'text-background' : 'text-text',
      )}
    >
      <span className={cn('font-heading font-bold tracking-[-0.01em]', main)}>EDEN</span>
      <span className="mt-2 flex items-center gap-2">
        <span aria-hidden className={cn('h-px bg-current opacity-70', rule)} />
        <span className={cn('font-body font-semibold uppercase', sub)}>Wellness Club</span>
        <span aria-hidden className={cn('h-px bg-current opacity-70', rule)} />
      </span>
    </span>
  )
}
