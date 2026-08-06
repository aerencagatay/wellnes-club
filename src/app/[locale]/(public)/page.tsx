import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getUpcomingCamps } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { DailyFlow } from '@/components/camps/daily-flow'
import { CampPanel } from '@/components/home/camp-panel'
import { HeroHome } from '@/components/home/hero-home'
import { TrustStrip } from '@/components/home/trust-strip'
import { Manifesto } from '@/components/home/manifesto'
import { IncludesList } from '@/components/home/includes-list'
import { BenefitsSection } from '@/components/home/benefits-section'
import { TeachersPreview } from '@/components/home/teachers-preview'
import { FoodMoment } from '@/components/home/food-moment'
import { Testimonials } from '@/components/home/testimonials'
import { NewsletterCta } from '@/components/home/newsletter-cta'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Marquee } from '@/components/motion/marquee'
import { formatDateRange } from '@/lib/utils/dates'

// `today` aşağıda `getUpcomingCamps` için render anında hesaplanır — ama sayfa artık
// statik render edildiği için (bkz. (public)/layout.tsx → setRequestLocale) bu değer
// build zamanında donar ve bir sonraki deploy'a kadar asla yenilenmez. `revalidate`
// olmadan geçmiş bir kamp, tarihi geçtikten sonra bile "yaklaşan" olarak görünmeye
// devam eder ve canlı başvuru CTA'sına bağlantı vermeyi sürdürür. Saatlik yenileme,
// build hızını korurken bu içeriği makul bir tazelikte tutar.
export const revalidate = 3600

export default async function HomePage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })
  // Sunucuda render anında hesaplanır ve seçicilere parametre olarak geçer.
  const today = new Date().toISOString().slice(0, 10)
  // Günlük akış bölümü, kamp panelinin gösterdiği aynı yaklaşan kampın programını
  // kullanır — yaklaşan kamp yoksa (bkz. camp-panel.tsx'in `null` dönüşü) bu bölüm
  // de hiç render edilmez, boşluk bırakmaz.
  const [upcomingCamp] = getUpcomingCamps(today, 1)

  return (
    <>
      <HeroHome />
      <CampPanel locale={locale} today={today} />
      <TrustStrip />

      {/* Dekoratif, yavaş kayan metin şeridi — bkz. brief §5. `aria-hidden` olduğu
          için ekran okuyucu kullanıcı için gürültü yaratmaz. */}
      <div aria-hidden className="border-y border-sand bg-surface py-6">
        <Marquee items={[t('marquee.items')]} />
      </div>

      <Manifesto />
      {upcomingCamp && (
        <Section>
          <DailyFlow items={upcomingCamp.dailyFlow} locale={locale} />
        </Section>
      )}
      <IncludesList />
      <BenefitsSection />
      <TeachersPreview locale={locale} />
      {/* VenuePreview ve ComingSoon kaldırıldı (kullanıcı isteği, 2026-08-06):
          ana sayfada otel/mekan fotoğrafı istenmiyor (yalnızca /mekan ve kamp
          detay sayfasında) ve şu an gerçek/yaklaşan tek etkinlik var — kurgusal
          "çok yakında" listesi bu tekliğe aykırı. Bileşen dosyaları silinmedi,
          gerçek çoklu-etkinlik/mekan verisi geldiğinde yeniden bağlanabilir. */}
      <FoodMoment />
      <Testimonials locale={locale} />
      <NewsletterCta />

      {/* Kapanış CTA — tam ekran hissi veren koyu bölüm (brief §4.7). `Section`'ın
          `dark` varyantı başlık/eyebrow/lede renklerini zorla krem/kum yapar (bkz.
          section.tsx) — burada elle bir metin rengi seçilmiyor. */}
      <Section background="dark" className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <Eyebrow>{t('finalCta.eyebrow')}</Eyebrow>
        <h2 className="type-display max-w-4xl">{t('finalCta.title')}</h2>
        <p className="type-lede mt-6">
          {upcomingCamp
            ? `${formatDateRange(upcomingCamp.startDate, upcomingCamp.endDate, locale)} · Assos, Çanakkale`
            : t('finalCta.noUpcoming')}
        </p>
        <div className="mt-10">
          <Button href="/basvuru" size="lg">
            {t('finalCta.cta')}
          </Button>
        </div>
      </Section>
    </>
  )
}
