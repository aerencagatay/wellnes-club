import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, type AppLocale } from '@/i18n/routing'
import { instrumentSerif, manrope } from '@/lib/fonts'
import { site } from '@/lib/config/site'
import { buildOrganizationJsonLd } from '@/lib/seo/jsonld'
import { buildAlternates, localeToOgLocale } from '@/lib/seo/metadata'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    metadataBase: new URL(site.url),
    title: { default: t('defaultTitle'), template: `%s — ${site.name}` },
    description: t('defaultDescription'),
    alternates: buildAlternates(`/${locale}`),
    openGraph: {
      siteName: site.name,
      locale: localeToOgLocale(locale as AppLocale),
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const jsonLd = buildOrganizationJsonLd({ siteUrl: site.url, locale })

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${instrumentSerif.variable} ${manrope.variable}`}>
        {/* JSON-LD yalnızca kendi içeriğimizden üretilir; `<` içermez, kaçışa gerek yok. */}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
