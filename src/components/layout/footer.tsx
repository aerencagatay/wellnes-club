import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { Eyebrow } from '@/components/ui/eyebrow'
import { FOOTER_LEGAL, NAV_ITEMS, site } from '@/lib/config/site'

export async function Footer() {
  const locale = (await getLocale()) as AppLocale
  const tNav = await getTranslations('nav')
  const tCommon = await getTranslations('common')
  const tFooter = await getTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background">
      <div className="container-page pt-20 pb-12 md:pt-28">
        <Link className="font-heading text-4xl tracking-tight text-text md:text-5xl" href="/">
          {site.name}
        </Link>
        <p className="type-lede mt-4 max-w-sm">{site.tagline[locale]}</p>

        <div className="mt-12 border-t border-sand" />

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          <div>
            <Eyebrow>{tFooter('navTitle')}</Eyebrow>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link className="text-sm text-muted transition-colors hover:text-text" href={item.href}>
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow>{tFooter('contactTitle')}</Eyebrow>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <li>
                <a className="transition-colors hover:text-text" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-text" href={site.phoneHref}>
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-text"
                  href={site.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {tFooter('instagram')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            {/* Yasal kolonun bir başlığı yok — mevcut i18n mesajlarında karşılığı
                bulunmuyor ve bu görev yalnızca navbar/footer/page-hero dosyalarını
                değiştirebiliyor (bkz. task-4-brief.md kapsam sınırı). */}
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted sm:mt-9">
              {FOOTER_LEGAL.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-text" href={item.href}>
                    {tFooter(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-sand pt-6 text-xs text-muted">
          © {year} {site.name}. {tCommon('allRightsReserved')}
        </div>
      </div>
    </footer>
  )
}
