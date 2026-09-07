import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllCamps, getCampBySlug, getFaq, getTeachersForCamp, getVenueForCamp } from '@/content'
import { routing, type AppLocale } from '@/i18n/routing'
import { CampCtaBar } from '@/components/camps/camp-cta-bar'
import { CampCtaCard } from '@/components/camps/camp-cta-card'
import { CampDetailHero } from '@/components/camps/camp-detail-hero'
import { DailyFlow } from '@/components/camps/daily-flow'
import { IncludesExcludes } from '@/components/camps/includes-excludes'
import { PriceTiers } from '@/components/camps/price-tiers'
import { TeacherCard } from '@/components/teachers/teacher-card'
import { Accordion } from '@/components/ui/accordion'
import { GalleryStrip } from '@/components/ui/gallery-strip'
import { Section } from '@/components/ui/section'
import { VenueLocation } from '@/components/venue/venue-location'
import { site } from '@/lib/config/site'
import { buildCampEventJsonLd, trimSlash } from '@/lib/seo/jsonld'
import { buildAlternates, localeToOgLocale } from '@/lib/seo/metadata'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllCamps().map((camp) => ({ locale, slug: camp.slug })))
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  const camp = getCampBySlug(slug)
  if (!camp) return {}
  const path = `/${locale}/kamplar/${slug}`
  return {
    title: camp.title[locale],
    description: camp.summary[locale],
    alternates: buildAlternates(path),
    openGraph: {
      // `[locale]/layout.tsx`'in generateMetadata'sı zaten `siteName`/`locale` alanlarını
      // kurar, ama Next.js'in metadata birleştirmesi `openGraph` nesnesinde SIĞ'dır: bu
      // sayfa kendi `openGraph` nesnesini döndürünce üst katmanınkinin YERİNE geçer,
      // üstüne eklenmez. Paylaşılan alanları burada da açıkça tekrarlamazsak
      // `og:locale`/`og:site_name` bu sayfada hiç render edilmez.
      siteName: site.name,
      locale: localeToOgLocale(locale),
      title: camp.title[locale],
      description: camp.summary[locale],
      // metadataBase kök layout'ta tanımlı (Task 15) ama burada yine de mutlak URL
      // kuruyoruz: jsonld.ts'teki Event JSON-LD'nin `image` alanıyla aynı kalıp,
      // tek bir doğru kaynaktan (site.url) türetilir ve metadataBase'e bağımlı kalmaz.
      images: [`${trimSlash(site.url)}${camp.heroImage}`],
      url: `${trimSlash(site.url)}${path}`,
      type: 'website',
    },
  }
}

export default async function CampDetailPage({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const camp = getCampBySlug(slug)
  if (!camp) notFound()

  const venue = getVenueForCamp(camp)
  const teachers = getTeachersForCamp(camp)
  const faqItems = getFaq().slice(0, 4)
  const t = await getTranslations('campDetail')
  const jsonLd = buildCampEventJsonLd({ camp, venue, locale, siteUrl: site.url })

  return (
    <>
      {/* JSON-LD yalnızca kendi içeriğimizden üretilir; `<` içermez, kaçışa gerek yok. */}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

      <CampDetailHero camp={camp} locale={locale} venue={venue} />

      <Section>
        {/* `minmax(0,1fr)` — `1fr` DEĞİL. Bir grid track'inin varsayılan
            `min-width` değeri `auto`dur: içeriğinin en küçük boyutunun altına
            İNEMEZ. Fiyat tablosu bu track'i 1759px'e şişiriyordu (kap 1152px)
            ve sayfanın TAMAMI yatayda taşıyordu — `container-page` sol kenarı
            -64px'e kayıyor, fiyat sütunu ekranın sağında görünmez alanda
            kalıyordu (kullanıcı bildirimi: "fiyatlar gözükmüyor", 2026-09-07).

            `minmax(0,1fr)` alt sınırı sıfıra çeker; track kabına sığar ve
            tablonun kendi `overflow-x-auto` sarmalayıcısı işini yapabilir. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <div className="flex flex-col gap-16">
            <p className="type-lede">{camp.summary[locale]}</p>

            <DailyFlow days={camp.dailyFlow} locale={locale} />

            <IncludesExcludes excludes={camp.excludes[locale]} includes={camp.includes[locale]} />

            {/* Fiyat tablosu, "dahil olanlar/olmayanlar"ın hemen ardından gelir:
                bir kademenin neyi kapsadığı ancak o iki liste okunduktan sonra
                anlam taşıyor. Kenar çubuğundaki `CampCtaCard` tek bir başlangıç
                fiyatı gösterir; kademelerin tamamı burada durur. */}
            <PriceTiers currency={camp.currency} locale={locale} tiers={camp.priceTiers} />

            <section>
              <h2 className="type-title">{t('teachers')}</h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {teachers.map((teacher) => (
                  <TeacherCard key={teacher.slug} locale={locale} teacher={teacher} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="type-title">{t('venue')}</h2>
              <div className="mt-8">
                <VenueLocation locale={locale} venue={venue} />
              </div>
            </section>

            <section>
              <h2 className="type-title">{t('gallery')}</h2>
              <div className="mt-8">
                {/* Galerideki her görsele aynı alt (kamp başlığı) verilmesi ekran okuyucu
                    kullanıcısının görselleri birbirinden ayırt etmesini imkansız kılardı.
                    İçerik katmanında görsel başına açıklama yok; dürüst ve ayırt edici
                    tek seçenek indeksli bir biçim ("<başlık> — görsel N / M"). */}
                <GalleryStrip
                  images={camp.gallery.map((src, index) => ({
                    src,
                    alt: t('galleryImageAlt', { title: camp.title[locale], index: index + 1, total: camp.gallery.length }),
                  }))}
                />
              </div>
            </section>
          </div>

          <div className="mt-16 lg:mt-0">
            <CampCtaCard camp={camp} locale={locale} />
          </div>
        </div>
      </Section>

      <Section background="surface" className="pb-28 lg:pb-0">
        <h2 className="type-title">{t('faq')}</h2>
        <div className="mt-10">
          <Accordion
            items={faqItems.map((item) => ({
              id: item.id,
              question: item.question[locale],
              answer: item.answer[locale],
            }))}
            onTintedBackground
          />
        </div>
      </Section>

      <CampCtaBar camp={camp} locale={locale} />
    </>
  )
}
