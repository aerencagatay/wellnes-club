import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { FOOTER_LEGAL, site } from '@/lib/config/site'
import { BrandLockup } from './brand-lockup'

/**
 * Minimal footer (brief §11): marka, Instagram, iletişim, yasal bağlantılar,
 * telif. Dev bir kurumsal site haritası KASITLI olarak yok — eskiden burada
 * `NAV_ITEMS`'ın tamamı üç kolon hâlinde listeleniyordu.
 *
 * Bu, footer'ı `NAV_ITEMS`'a olan bağımlılığından da kurtarır: navigasyon
 * yapısı değiştiğinde (birincil nav 3 maddeye indi) footer'ın sessizce ölü
 * bağlantı göstermesi artık mümkün değil, çünkü footer artık yalnızca kendi
 * kısa listesini tanıyor.
 */
export async function Footer() {
  const locale = (await getLocale()) as AppLocale
  const tCommon = await getTranslations('common')
  const tFooter = await getTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-sand bg-background">
      <div className="container-page py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Link className="inline-block" href="/">
              <BrandLockup size="lg" />
            </Link>
            <p className="type-lede mt-4 max-w-xs">{site.tagline[locale]}</p>
          </div>

          <ul className="flex flex-col gap-3 text-sm text-muted">
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
          </ul>

          <ul className="flex flex-col gap-3 text-sm text-muted">
            {FOOTER_LEGAL.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-text" href={item.href}>
                  {tFooter(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 border-t border-sand pt-6 text-xs text-muted">
          © {year} {site.name}. {tCommon('allRightsReserved')}
        </div>
      </div>
    </footer>
  )
}
