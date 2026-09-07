import { useTranslations } from 'next-intl'
import type { CampDay, DailyFlowItem } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { RevealGroup } from '@/components/motion/reveal'
import { formatDateLong } from '@/lib/utils/dates'

/**
 * Her madde için ortak içerik (nokta + saat + başlık + varsa açıklama). Yatay
 * ve dikey varyant aynı içeriği farklı dot-konumlama sınıflarıyla render eder.
 *
 * `desc` İSTEĞE BAĞLI: kullanıcıdan gelen program yalnızca saat ve başlık
 * içeriyor (bkz. content/types.ts). Açıklama uydurmak yerine satır kısa kalır.
 */
function FlowItemContent({
  item,
  locale,
  dotClassName,
}: {
  item: DailyFlowItem
  locale: AppLocale
  dotClassName: string
}) {
  return (
    <>
      <span aria-hidden className={dotClassName} />
      <span className="block font-heading text-2xl text-text">{item.time}</span>
      <h4 className="mt-2 text-sm font-semibold tracking-wide text-olive uppercase">{item.title[locale]}</h4>
      {item.desc && <p className="mt-2 text-sm text-muted">{item.desc[locale]}</p>}
    </>
  )
}

/**
 * Program — GÜN GÜN.
 *
 * 2026-09-07'ye kadar tek bir "tipik gün" gösteriyordu; güne bölünmüş
 * doğrulanmış bir program olmadığı için öyle sunuluyordu. Kullanıcı gerçek üç
 * günlük programı verince yapı da güne bölündü.
 *
 * Her gün KENDİ zaman çizgisini alıyor, hepsi tek bir uzun şeride
 * dizilmiyor: on üç maddelik tek bir yatay şerit, masaüstünde bile kaydırma
 * gerektirir ve günlerin nerede başlayıp bittiği kaybolur.
 */
export function DailyFlow({
  days,
  locale,
  note,
}: {
  days: CampDay[]
  locale: AppLocale
  /** Başlığın hemen altında gösterilen, çağıran tarafından zaten çevrilmiş
   *  isteğe bağlı bir not. Verilmezse hiçbir şey render edilmez. */
  note?: string
}) {
  const t = useTranslations('campDetail')

  return (
    <div>
      <h2 className="type-title">{t('dailyFlow')}</h2>
      {note && <p className="type-lede mt-5 max-w-2xl">{note}</p>}

      <div className="mt-10 flex flex-col gap-12">
        {days.map((day) => (
          <section key={day.label[locale]}>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-heading text-2xl font-bold tracking-[-0.02em] text-text">{day.label[locale]}</h3>
              {day.date && <span className="type-eyebrow">{formatDateLong(day.date, locale)}</span>}
            </div>

            {/*
              Masaüstü: yatay zaman çizgisi. `className` verilmediği için
              `RevealGroup` burada hiçbir sarmalayıcı DOM düğümü render etmez
              (bkz. motion/reveal.tsx) — `li` öğeleri gerçekten `ol`'un doğrudan
              çocuklarıdır. (Önceki bir sürüm `display: contents` kullanıyordu;
              gerçek bir Lighthouse taramasında bunun bazı erişilebilirlik
              ağaçlarında hâlâ düğüm olarak kaldığı ve axe'in `list`/`listitem`
              denetimini kırdığı görüldü.)
            */}
            <div className="mt-6 hidden overflow-x-auto md:block">
              <ol className="flex min-w-max list-none gap-12 border-t border-sand pt-7">
                <RevealGroup itemAs="li" itemClassName="relative w-48 shrink-0">
                  {day.items.map((item) => (
                    <FlowItemContent
                      dotClassName="absolute -top-[33px] left-0 size-2.5 rounded-full bg-olive"
                      item={item}
                      key={`${item.time}-${item.title[locale]}`}
                      locale={locale}
                    />
                  ))}
                </RevealGroup>
              </ol>
            </div>

            {/* Mobil: dikey liste — yatay zaman çizgisi küçük ekranda okunmaz. */}
            <ol className="mt-6 list-none border-l border-sand md:hidden">
              <RevealGroup itemAs="li" itemClassName="relative pb-8 pl-8 last:pb-0">
                {day.items.map((item) => (
                  <FlowItemContent
                    dotClassName="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-olive"
                    item={item}
                    key={`${item.time}-${item.title[locale]}`}
                    locale={locale}
                  />
                ))}
              </RevealGroup>
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}
