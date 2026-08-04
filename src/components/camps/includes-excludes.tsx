import { Check, Minus } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function IncludesExcludes({ includes, excludes }: { includes: string[]; excludes: string[] }) {
  const t = useTranslations('campDetail')

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <div>
        <h2 className="font-heading text-2xl text-text">{t('includes')}</h2>
        <ul className="mt-6 flex flex-col gap-3">
          {includes.map((item) => (
            <li className="flex items-start gap-3 text-sm" key={item}>
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-olive" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-heading text-2xl text-text">{t('excludes')}</h2>
        <ul className="mt-6 flex flex-col gap-3">
          {excludes.map((item) => (
            <li className="flex items-start gap-3 text-sm" key={item}>
              <Minus aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
