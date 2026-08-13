import { cn } from '@/lib/utils/cn'

const SIZES = {
  sm: { main: 'text-lg', sub: 'text-[8px] tracking-[0.35em]' },
  md: { main: 'text-2xl', sub: 'text-[9px] tracking-[0.4em]' },
  // Ortalanmış navbar'ın marka satırı: sayfayı marka adı "ortalasın" istendiği
  // için (kullanıcı isteği, 2026-08-13) lockup navbar'da artık bir yardımcı
  // öğe değil, kompozisyonun merkezi — bu yüzden kendi ölçeği var.
  nav: { main: 'text-[28px] md:text-[34px]', sub: 'text-[9px] tracking-[0.45em] md:text-[10px]' },
  lg: { main: 'text-4xl md:text-5xl', sub: 'text-[10px] tracking-[0.45em]' },
} as const

/**
 * Markanın METİN karşılığı — navbar ve footer'da gerçek logo görselinin yerine
 * kullanılır (görsel yalnızca hero'da, orada tek merkez öğe olarak duruyor).
 *
 * Tipografi artık logoyu TAKLİT EDİYOR, ondan uzaklaşmıyor: "EDEN" başlık
 * fontuyla (Fraunces, groovy serif) ve dolgun bir ağırlıkla yazılıyor —
 * logodaki şişkin gövdeli EDEN'in karşılığı. Altındaki "WELLNESS CLUB" ise
 * gövde fontuyla (Poppins) ve geniş harf aralığıyla, tıpkı logodaki ikinci
 * satır gibi.
 *
 * Eski kurulum ikisini de Montserrat ExtraLight ile yazıyordu; bu, groovy
 * serifte anlamsız (şişkin gövdeler kaybolur) ve logoyla akrabalığı yoktu.
 */
export function BrandLockup({
  transparent = false,
  size = 'md',
}: {
  transparent?: boolean
  size?: keyof typeof SIZES
}) {
  const { main, sub } = SIZES[size]
  return (
    <span
      className={cn(
        'flex flex-col items-center leading-none transition-colors duration-300',
        transparent ? 'text-background' : 'text-text',
      )}
    >
      <span className={cn('font-heading font-semibold tracking-[0.04em]', main)}>EDEN</span>
      <span className={cn('mt-2 font-body font-medium uppercase', sub)}>Wellness Club</span>
    </span>
  )
}
