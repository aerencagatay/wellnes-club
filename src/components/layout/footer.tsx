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
    <footer className="border-t border-sand bg-surface">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <Link className="font-heading text-xl tracking-tight text-text" href="/">
            {site.name}
          </Link>
          {/* text-muted: footer bg-surface zemininde, düz text-muted orada WCAG AA
              eşiğinin altında kalır (bkz. globals.css'teki --color-muted token yorumu). */}
          <p className="mt-3 max-w-xs text-sm text-muted">{site.tagline[locale]}</p>
        </div>

        <div>
          <Eyebrow>{tFooter('navTitle')}</Eyebrow>
          <ul className="mt-2 flex flex-col gap-2">
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
          <ul className="mt-2 flex flex-col gap-2 text-sm text-muted">
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
          <ul className="flex flex-col gap-2 text-sm text-muted">
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

      <div className="border-t border-sand">
        {/* text-muted: bkz. yukarıdaki tagline notu — aynı cream-2 zemini. */}
        <div className="container-page py-6 text-xs text-muted">
          © {year} {site.name}. {tCommon('allRightsReserved')}
        </div>
      </div>
    </footer>
  )
}
