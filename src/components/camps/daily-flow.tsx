import { useTranslations } from 'next-intl'
import type { DailyFlowItem } from '@/content'
import type { AppLocale } from '@/i18n/routing'

export function DailyFlow({ items, locale }: { items: DailyFlowItem[]; locale: AppLocale }) {
  const t = useTranslations('campDetail')
  return (
    <div>
      <h2 className="type-section-title">{t('dailyFlow')}</h2>
      <ol className="mt-8 border-l border-border">
        {items.map((item) => (
          <li className="relative pb-8 pl-8 last:pb-0" key={`${item.time}-${item.title[locale]}`}>
            <span aria-hidden className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent" />
            <span className="block text-xs font-semibold tracking-widest text-accent-deep">{item.time}</span>
            <h3 className="mt-1 font-heading text-lg text-ink">{item.title[locale]}</h3>
            <p className="mt-1 text-sm">{item.desc[locale]}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
