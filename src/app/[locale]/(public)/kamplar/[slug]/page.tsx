import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllCamps, getCampBySlug, getFaq, getTeachersForCamp, getVenueForCamp } from '@/content'
import { routing, type AppLocale } from '@/i18n/routing'
import { CampCtaBar } from '@/components/camps/camp-cta-bar'
import { CampCtaCard } from '@/components/camps/camp-cta-card'
import { CampDetailHero } from '@/components/camps/camp-detail-hero'
import { DailyFlow } from '@/components/camps/daily-flow'
import { IncludesExcludes } from '@/components/camps/includes-excludes'
import { Accordion } from '@/components/ui/accordion'
import { GalleryStrip } from '@/components/ui/gallery-strip'
import { Section } from '@/components/ui/section'
import { site } from '@/lib/config/site'
import { buildCampEventJsonLd } from '@/lib/seo/jsonld'

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
    alternates: {
      canonical: path,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/kamplar/${slug}`])),
    },
    openGraph: {
      title: camp.title[locale],
      description: camp.summary[locale],
      images: [camp.heroImage],
      url: `${site.url}${path}`,
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
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-16">
          <div className="flex flex-col gap-16">
            <p className="type-lede">{camp.summary[locale]}</p>

            <DailyFlow items={camp.dailyFlow} locale={locale} />

            <IncludesExcludes excludes={camp.excludes[locale]} includes={camp.includes[locale]} />

            <section>
              <h2 className="type-section-title">{t('teachers')}</h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {teachers.map((teacher) => (
                  <div className="flex gap-4" key={teacher.slug}>
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-cream-3">
                      {/* Yer tutucu hoca fotoğrafları SVG'dir; unoptimized ile doğrudan
                          sunulur (bkz. teachers-preview.tsx). */}
                      <Image
                        alt={teacher.name}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={teacher.photo}
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-heading text-lg text-ink">{teacher.name}</p>
                      <p className="text-sm text-body">{teacher.title[locale]}</p>
                      <p className="mt-2 text-sm">{teacher.bio[locale]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="type-section-title">{t('venue')}</h2>
              <p className="mt-4 text-sm text-body">{venue.location[locale]}</p>
              <p className="mt-4 text-sm">{venue.shortDescription[locale]}</p>
              <ul className="mt-6 flex flex-col gap-2 text-sm text-ink-3">
                {venue.highlights[locale].map((item) => (
                  <li className="flex items-center gap-2" key={item}>
                    <span aria-hidden className="size-1 shrink-0 rounded-full bg-accent-deep" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="type-section-title">{t('gallery')}</h2>
              <div className="mt-8">
                <GalleryStrip images={camp.gallery.map((src) => ({ src, alt: camp.title[locale] }))} />
              </div>
            </section>
          </div>

          <div className="mt-16 lg:mt-0">
            <CampCtaCard camp={camp} locale={locale} />
          </div>
        </div>
      </Section>

      <Section background="cream-2" className="pb-28 lg:pb-0">
        <h2 className="type-section-title">{t('faq')}</h2>
        <div className="mt-10">
          <Accordion
            items={faqItems.map((item) => ({
              id: item.id,
              question: item.question[locale],
              answer: item.answer[locale],
            }))}
          />
        </div>
      </Section>

      <CampCtaBar camp={camp} locale={locale} />
    </>
  )
}
