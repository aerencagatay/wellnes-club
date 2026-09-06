import { setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { CollageMarquee } from '@/components/art/collage-marquee'
import { CommunityWall } from '@/components/home/community-wall'
import { EventShowcase } from '@/components/home/event-showcase'
import { HeroHome } from '@/components/home/hero-home'
import { MoodWall } from '@/components/home/mood-wall'

// `today` render anında hesaplanır — ama sayfa statik render edildiği için (bkz.
// (public)/layout.tsx → setRequestLocale) bu değer build zamanında donar ve bir
// sonraki deploy'a kadar yenilenmez. `revalidate` olmadan tarihi geçmiş bir
// etkinlik "yaklaşan" olarak görünmeye ve canlı rezervasyon CTA'sına bağlantı
// vermeye devam ederdi. Saatlik yenileme, build hızını korurken bu içeriği
// makul bir tazelikte tutar.
export const revalidate = 3600

/**
 * Ana sayfa KASITLI OLARAK sade (brief §6): hero → etkinlik showcase → üye
 * deneyimleri → kareler → footer. Bundan fazlası yok.
 *
 * Buradan KALDIRILAN bölümler (TrustStrip, Manifesto, DailyFlow, IncludesList,
 * BenefitsSection, TeachersPreview, FoodMoment, NewsletterCta, CampPanel,
 * Marquee şeridi ve eski Testimonials) bir yerde saklanmadı — ilgili bileşen
 * dosyaları silindi (kullanıcı isteği, 2026-08-14: "gereksiz kullanmadığımız
 * alanları kaldırabilirsin"). Hâlâ başka sayfalarda kullanılanlar
 * (TeachersPreview ve BenefitBlock → /hakkimizda) korundu.
 *
 * Ziyaretçinin saniyeler içinde anlaması gereken şey (brief §20): burası EDEN
 * Wellness Club, katılabileceği yaklaşan etkinlikler var ve topluluk gerçek.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <HeroHome />
      {/* Hero (zeytin alan) ile showcase (krem kağıt) arasındaki geçiş bandı.
          Bir bölüm değil, iki bölümü birbirine bağlayan tipografik bir şerit. */}
      <CollageMarquee />
      <EventShowcase locale={locale} today={today} />
      <CommunityWall locale={locale} />
      <MoodWall locale={locale} />
    </>
  )
}
