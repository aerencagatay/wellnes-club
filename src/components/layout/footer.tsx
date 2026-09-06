import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { FOOTER_LEGAL, NAV_ITEMS, site } from '@/lib/config/site'
import { SunMark } from '@/components/art/marks'
import { BrandLockup } from './brand-lockup'

/**
 * KAPANIŞ BANDI — sayfanın son zeytin alanı.
 *
 * DESIGN.md bu rolü "Indigo Footer Band" olarak tanımlar: tam-taşma koyu bir
 * şerit, en güçlü renk karşıtlığı burada kurulur. Rolü aynen alıyoruz ama
 * RENGİ EDEN'inkiyle değiştiriyoruz — indigo bu sistemde yapısal bir blok
 * rengi değil, KALEM (bkz. globals.css başlığı). Kapanış bandı zeytin olunca
 * sayfa açıldığı yerde (hero'nun zeytin alanı) kapanır; kompozisyon kendi
 * içinde çerçevelenir.
 *
 * Dev bir kurumsal site haritası KASITLI olarak yok: site üç sayfadan
 * ibaret, dolayısıyla footer da o üçünü ve yasal bağlantıları gösterir.
 */
export async function Footer() {
  const locale = (await getLocale()) as AppLocale
  const tCommon = await getTranslations('common')
  const tFooter = await getTranslations('footer')
  const tNav = await getTranslations('nav')
  const year = new Date().getFullYear()

  return (
    <footer className="field-forest grain border-t border-text">
      <div className="container-page relative py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Link className="inline-block" href="/">
              <BrandLockup size="lg" transparent />
            </Link>
            <p className="type-lede mt-5 max-w-xs">{site.tagline[locale]}</p>
            <p className="mt-6 font-body text-[10px] font-semibold tracking-[0.26em] text-background/85 uppercase">
              Move · Breathe · Connect
            </p>
          </div>

          <nav aria-label={tFooter('siteMap')}>
            <ul className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    className="font-heading text-xl font-bold tracking-[-0.02em] text-background transition-opacity duration-200 hover:opacity-70"
                    href={item.href}
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-col gap-3 text-sm text-background/85">
            <li>
              <a
                className="transition-opacity duration-200 hover:opacity-70"
                href={site.instagram}
                rel="noopener noreferrer"
                target="_blank"
              >
                {tFooter('instagram')}
              </a>
            </li>
            <li>
              <a className="transition-opacity duration-200 hover:opacity-70" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="transition-opacity duration-200 hover:opacity-70" href={site.phoneHref}>
                {site.phone}
              </a>
            </li>
            {FOOTER_LEGAL.map((item) => (
              <li key={item.href}>
                <Link className="transition-opacity duration-200 hover:opacity-70" href={item.href}>
                  {tFooter(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-background/25 pt-6 text-xs text-background/85">
          <span>
            © {year} {site.name}. {tCommon('allRightsReserved')}
          </span>
          <SunMark className="ink-sun h-7 w-7" />
        </div>
      </div>
    </footer>
  )
}
