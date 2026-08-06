import { useTranslations } from 'next-intl'

// İkon setinden vazgeçildi (brief §7-adım3): editorial yönde ikon yerine ince
// `+`/`−` işaretleri ve madde başına `border-sand` ayırıcı çizgi kullanılır.
export function IncludesExcludes({ includes, excludes }: { includes: string[]; excludes: string[] }) {
  const t = useTranslations('campDetail')

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <div>
        <h2 className="type-title">{t('includes')}</h2>
        <ul className="mt-6 flex flex-col">
          {includes.map((item) => (
            <li className="flex items-start gap-3 border-b border-sand py-3 text-sm first:pt-0 last:border-none" key={item}>
              <span aria-hidden className="mt-0.5 shrink-0 text-sm font-semibold text-olive">
                +
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="type-title">{t('excludes')}</h2>
        <ul className="mt-6 flex flex-col">
          {excludes.map((item) => (
            <li className="flex items-start gap-3 border-b border-sand py-3 text-sm first:pt-0 last:border-none" key={item}>
              <span aria-hidden className="mt-0.5 shrink-0 text-sm font-semibold text-muted">
                −
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
