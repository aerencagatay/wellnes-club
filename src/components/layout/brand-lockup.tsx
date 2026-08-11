const SIZES = {
  sm: { main: 'text-lg', sub: 'text-[8px] tracking-[0.35em]' },
  md: { main: 'text-2xl', sub: 'text-[9px] tracking-[0.4em]' },
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
  const color = transparent ? 'text-background' : 'text-text'
  const { main, sub } = SIZES[size]
  return (
    <span className={`flex flex-col items-center leading-none ${color}`}>
      <span className={`font-heading font-extralight ${main}`}>EDEN</span>
      <span className={`mt-1 font-heading font-light uppercase ${sub}`}>Wellness Club</span>
    </span>
  )
}
