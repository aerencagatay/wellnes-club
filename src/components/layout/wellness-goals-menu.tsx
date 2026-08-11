'use client'

import {
  Flame,
  Dumbbell,
  Globe,
  Stethoscope,
  Flower2,
  Home,
  Sparkles,
  BrainCircuit,
  HeartPulse,
  Leaf,
  Droplets,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { WELLNESS_GOALS } from '@/lib/config/site'

const ICONS: Record<(typeof WELLNESS_GOALS)[number], typeof Flame> = {
  detoxWeightLoss: Flame,
  fitnessSport: Dumbbell,
  slowTravel: Globe,
  medispasClinics: Stethoscope,
  yogaMeditation: Flower2,
  wellnessRetreats: Home,
  antiAgingLongevity: Sparkles,
  stressManagement: BrainCircuit,
  mentalHealth: HeartPulse,
  ayurveda: Leaf,
  luxurySpas: Droplets,
}

const PREVIEW_IMAGES = [
  { src: '/img/yoga dersi.jpg', alt: 'yogaMeditation' },
  { src: '/img/yemek fotoğrafı.jpeg', alt: 'detoxWeightLoss' },
  { src: '/img/venue/havuz.webp', alt: 'wellnessRetreats' },
] as const

/**
 * Luxe Wellness Club'ın "Wellness Goals" mega menüsüne yapısal karşılık (bkz.
 * kullanıcı referans ekran görüntüsü). Kategorilerin henüz karşılık geldiği bir
 * sayfa yok (kullanıcı isteği, 2026-08-10) — öğeler tıklanamaz, yalnızca önizleme.
 */
export function WellnessGoalsMenu({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations('nav')
  const tGoals = useTranslations('wellnessGoals')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={open}
        className={`text-xs uppercase tracking-[0.14em] transition-colors duration-300 ${
          transparent ? 'text-background/80 hover:text-background' : 'text-muted hover:text-text'
        }`}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {t('wellnessGoals')}
      </button>

      {open && (
        <div className="absolute top-full left-1/2 z-50 mt-6 w-[min(90vw,880px)] -translate-x-1/2 border border-sand bg-background p-10 shadow-[var(--shadow-lift)]">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            {WELLNESS_GOALS.map((key) => {
              const Icon = ICONS[key]
              return (
                <span className="flex items-center gap-2 text-sm text-muted" key={key}>
                  <Icon aria-hidden className="size-4 text-taupe" strokeWidth={1.5} />
                  {tGoals(key)}
                </span>
              )
            })}
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {PREVIEW_IMAGES.map((image) => (
              <div className="relative aspect-4/3 overflow-hidden" key={image.src}>
                <Image alt="" className="object-cover" fill sizes="200px" src={image.src} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
