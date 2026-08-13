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
 * EDEN LOGO.jpeg'in tipografisine karşılık gelen metin logosu (ince, geniş
 * aralıklı EDEN + altında dar "WELLNESS CLUB" alt yazısı). Logonun kendi taupe
 * zeminli karesi navbar/footer'ın beyaz zeminine oturmadığı için görsel yerine
 * metin kullanılır (bkz. 2026-08-10 tasarım notu).
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
      <span className={cn('font-heading font-extralight tracking-[0.18em]', main)}>EDEN</span>
      <span className={cn('mt-2 font-heading font-light uppercase', sub)}>Wellness Club</span>
    </span>
  )
}
