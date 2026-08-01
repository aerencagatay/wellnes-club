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
    <footer className="border-t border-border bg-cream-2">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <Link className="font-heading text-xl tracking-tight text-ink" href="/">
            {site.name}
          </Link>
          <p className="mt-3 max-w-xs text-sm text-body">{site.tagline[locale]}</p>
        </div>

        <div>
          <Eyebrow>{tFooter('navTitle')}</Eyebrow>
          <ul className="mt-2 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link className="text-sm text-ink-3 transition-colors hover:text-ink" href={item.href}>
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Eyebrow>{tFooter('contactTitle')}</Eyebrow>
          <ul className="mt-2 flex flex-col gap-2 text-sm text-ink-3">
            <li>
              <a className="transition-colors hover:text-ink" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-ink" href={site.phoneHref}>
                {site.phone}
              </a>
            </li>
            <li>
              <a
                className="transition-colors hover:text-ink"
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
          <ul className="flex flex-col gap-2 text-sm text-ink-3">
            {FOOTER_LEGAL.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-ink" href={item.href}>
                  {tFooter(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page py-6 text-xs text-body">
          © {year} {site.name}. {tCommon('allRightsReserved')}
        </div>
      </div>
    </footer>
  )
}
