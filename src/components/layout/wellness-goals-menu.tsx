'use client'

import {
  Bike,
  BookOpen,
  ChevronDown,
  Flower2,
  Footprints,
  Mountain,
  Sailboat,
  Tent,
  Waves,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { BlurFade } from '@/components/motion/blur-fade'
import { WELLNESS_GOALS } from '@/lib/config/site'
import { cn } from '@/lib/utils/cn'

const ICONS: Record<(typeof WELLNESS_GOALS)[number], LucideIcon> = {
  yogaPilates: Flower2,
  hiking: Mountain,
  running: Footprints,
  canoeing: Sailboat,
  reading: BookOpen,
  meditationBreathwork: Wind,
  cycling: Bike,
  swimming: Waves,
  wellnessRetreats: Tent,
}

// Yalnızca public/ altında GERÇEKTEN bulunan dosyalar — eksik bir yol Next'in
// görsel optimizasyonunda 400 döndürür ve panelde boş kutu bırakır.
const PREVIEW_IMAGES = [
  { src: '/img/wellness_goals/yogo foto.jpg', altKey: 'altYoga', captionKey: 'yogaPilates' },
  { src: '/img/wellness_goals/meditasyon foto.jpg', altKey: 'altMeditation', captionKey: 'meditationBreathwork' },
  { src: '/img/venue/bahce.webp', altKey: 'altGarden', captionKey: 'reading' },
  { src: '/img/venue/havuz.webp', altKey: 'altPool', captionKey: 'swimming' },
] as const

/**
 * Panelin İÇERİĞİ hem masaüstü mega menüsünde hem de mobil akordeonda aynı
 * kaynaktan gelsin diye ayrı bir bileşen: kategori listesi iki yerde
 * kopyalansaydı `WELLNESS_GOALS` büyüdüğünde biri sessizce eskir.
 */
function GoalsList({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('nav')
  const tGoals = useTranslations('wellnessGoals')

  return (
    <ul className={cn('grid gap-x-8 gap-y-4', compact ? 'grid-cols-1' : 'grid-cols-2')}>
      {WELLNESS_GOALS.map((key) => {
        const Icon = ICONS[key]
        return (
          // Kategorilerin karşılık gelen sayfası yok (kullanıcı isteği): bunlar
          // link DEĞİL, düz metin. `cursor-default` ile de tıklanabilir
          // görünmemeleri sağlanır — sahte bir bağlantı, klavye kullanıcısını
          // hiçbir yere gitmeyen bir sekme durağına sokardı.
          <li className="flex cursor-default items-center gap-3 text-sm text-muted" key={key}>
            <Icon aria-hidden className="size-4 shrink-0 text-taupe" strokeWidth={1.25} />
            {tGoals(key)}
          </li>
        )
      })}
      <li className="type-eyebrow col-span-full mt-2 text-muted normal-case">{t('goalsComingSoon')}</li>
    </ul>
  )
}

/**
 * Masaüstü mega menüsü: geniş, editoryal bir panel (kategoriler + 4 gerçek
 * fotoğraf). Hover VEYA klavye odağıyla açılır; Escape ve dışarı tıklama
 * kapatır.
 */
export function WellnessGoalsMenu({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations('nav')
  const tGoals = useTranslations('wellnessGoals')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Hover yalnızca gerçek imleçli cihazlarda açsın: dokunmatik bir ekranda
  // `mouseenter` dokunuşla birlikte ateşlenir ve hemen ardından gelen `click`
  // menüyü yeniden kapatırdı (tek dokunuşta hiç açılmamış gibi görünür).
  const hoverCapable = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  return (
    <div
      className="relative"
      onBlur={(event) => {
        // Odak panelin dışına çıktığında kapat — ama panel içindeki bir öğeden
        // diğerine geçerken kapanmasın.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
      onFocus={() => setOpen(true)}
      onMouseEnter={() => hoverCapable() && setOpen(true)}
      onMouseLeave={() => hoverCapable() && setOpen(false)}
      ref={containerRef}
    >
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={cn(
          'flex items-center gap-1.5 text-[11px] uppercase transition-colors duration-300 tracking-[0.22em]',
          transparent ? 'text-background/80 hover:text-background' : 'text-muted hover:text-text',
          open && (transparent ? 'text-background' : 'text-text'),
        )}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {t('wellnessGoals')}
        <ChevronDown
          aria-hidden
          className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        // Konumlandırma sarmalayıcısı ile animasyon sarmalayıcısı AYRI: BlurFade
        // `transform`u satır içi stille sürdüğü için `-translate-x-1/2` sınıfı
        // aynı öğede olsaydı ezilir ve panel ortalanmazdı. Üstteki `pt-6` de
        // tetikleyici ile panel arasında imleç için kesintisiz bir köprü bırakır
        // (aradaki boşlukta `mouseleave` ateşlenip menü kapanırdı).
        <div className="absolute top-full left-1/2 z-50 w-[min(88vw,1040px)] -translate-x-1/2 pt-6">
          <BlurFade blur="10px" duration={0.28} offset={10}>
            <div
              aria-label={t('wellnessGoalsMenuLabel')}
              className="grid gap-10 border border-sand bg-background p-8 shadow-[var(--shadow-lift)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:p-10"
              id={panelId}
              role="group"
            >
              <div>
                <p className="type-eyebrow text-olive">{tGoals('eyebrow')}</p>
                <p className="mt-4 max-w-sm font-heading text-2xl font-extralight text-text">{tGoals('intro')}</p>
                <div className="mt-8">
                  <GoalsList />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {PREVIEW_IMAGES.map((image) => (
                  <figure key={image.src}>
                    <div className="relative aspect-4/5 overflow-hidden bg-surface">
                      <Image
                        alt={tGoals(image.altKey)}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1024px) 240px, 40vw"
                        src={image.src}
                      />
                    </div>
                    <figcaption className="type-eyebrow mt-2 text-muted">{tGoals(image.captionKey)}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      )}
    </div>
  )
}

/**
 * Mobil tam ekran menüdeki karşılığı: aynı kategoriler, akordeon olarak.
 * Mega panel dar ekranda okunmaz olurdu, bu yüzden görseller burada yok.
 */
export function WellnessGoalsAccordion() {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="border-b border-sand">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left font-heading text-2xl font-light text-text"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {t('wellnessGoals')}
        <ChevronDown
          aria-hidden
          className={cn('size-5 text-muted transition-transform duration-300', open && 'rotate-180')}
          strokeWidth={1.5}
        />
      </button>
      {open && (
        <div className="pb-6" id={panelId}>
          <GoalsList compact />
        </div>
      )}
    </div>
  )
}
