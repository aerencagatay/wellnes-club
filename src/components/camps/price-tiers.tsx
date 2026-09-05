import { useTranslations } from 'next-intl'
import type { PriceTier } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { formatPrice } from '@/lib/utils/price'

/**
 * Oda tipi × gece sayısı fiyat kademeleri. Gerçek bir `table` kullanılır:
 * satırlar iki bağımsız boyutun (oda tipi, gece) kesişimi olduğu için bu bir
 * liste değil tablo verisidir ve ekran okuyucu kullanıcısının başlıklarla
 * ilişkilendirebilmesi gerekir.
 *
 * Kademeler `camps.ts`'teki sıraya göre render edilir — orada tam programdan
 * kısa katılıma doğru dizilidir; burada yeniden sıralamak iki dosyanın
 * ayrışması demek olurdu.
 */
export function PriceTiers({
  tiers,
  currency,
  locale,
}: {
  tiers: PriceTier[]
  currency: string
  locale: AppLocale
}) {
  const t = useTranslations('campDetail')
  const tCamp = useTranslations('camp')

  return (
    <section>
      <h2 className="type-title">{t('pricing')}</h2>

      {/* Uzun para birimi biçimleri küçük ekranda taşabilir; tablo kendi
          içinde kaydırılır, sayfa gövdesi yatay kaymaz. */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-md border-collapse text-sm">
          <caption className="sr-only">{t('pricingCaption')}</caption>
          <thead>
            <tr className="border-b border-sand text-left">
              <th className="pb-3 font-semibold tracking-wide text-olive uppercase" scope="col">
                {t('roomType')}
              </th>
              <th className="pb-3 font-semibold tracking-wide text-olive uppercase" scope="col">
                {t('duration')}
              </th>
              <th className="pb-3 text-right font-semibold tracking-wide text-olive uppercase" scope="col">
                {t('perPerson')}
              </th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => (
              <tr className="border-b border-sand last:border-none" key={`${tier.occupancy}-${tier.nights}`}>
                <th className="py-3 pr-4 text-left font-normal text-text" scope="row">
                  {tCamp(`occupancy.${tier.occupancy}`)}
                </th>
                <td className="py-3 pr-4 text-muted">{tCamp('nights', { count: tier.nights })}</td>
                <td className="py-3 text-right font-semibold text-text tabular-nums">
                  {formatPrice(tier.price, currency, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted">{t('pricingNote')}</p>
    </section>
  )
}
