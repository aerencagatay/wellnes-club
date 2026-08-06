import { useTranslations } from 'next-intl'
import type { DailyFlowItem } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { RevealGroup } from '@/components/motion/reveal'

/**
 * Her madde için ortak içerik (nokta + saat + başlık + açıklama). Yatay ve dikey
 * varyant aynı içeriği farklı dot-konumlama sınıflarıyla render eder.
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
      <h3 className="mt-2 text-sm font-semibold tracking-wide text-olive uppercase">{item.title[locale]}</h3>
      <p className="mt-2 text-sm text-muted">{item.desc[locale]}</p>
    </>
  )
}

export function DailyFlow({
  items,
  locale,
  note,
}: {
  items: DailyFlowItem[]
  locale: AppLocale
  /** Başlığın hemen altında gösterilen, çağıran tarafından zaten çevrilmiş isteğe
   *  bağlı bir not (bkz. deneyim/page.tsx). Verilmezse hiçbir şey render edilmez —
   *  kamp detay sayfası bu prop'u hiç geçmediği için görünümü değişmez. */
  note?: string
}) {
  const t = useTranslations('campDetail')

  return (
    <div>
      <h2 className="type-title">{t('dailyFlow')}</h2>
      {note && <p className="type-lede mt-5 max-w-2xl">{note}</p>}

      {/*
        Masaüstü: yatay zaman çizgisi (brief §4.3). `className` verilmediği için
        `RevealGroup` burada hiçbir sarmalayıcı DOM düğümü render etmez (bkz.
        motion/reveal.tsx) — `li` öğeleri gerçekten `ol`'un doğrudan çocuklarıdır.
        (Önceki sürüm bir `display: contents` `div`'i kullanıyordu; gerçek bir
        Lighthouse taramasında bunun bazı tarayıcı erişilebilirlik ağaçlarında
        hâlâ bir düğüm olarak kaldığı ve axe'in `list`/`listitem` denetimini
        kırdığı görüldü — bkz. task-9-report.md.)
        Taşma olursa `overflow-x-auto` ile kaydırılır; birincil deneyim mobilde
        dikey kalır (`md:hidden`), bu yüzden yatay kaydırma bir kenar durumu.
      */}
      <div className="mt-10 hidden overflow-x-auto md:block">
        <ol className="flex min-w-max list-none gap-12 border-t border-sand pt-7">
          <RevealGroup itemAs="li" itemClassName="relative w-52 shrink-0">
            {items.map((item) => (
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

      {/* Mobil: dikey liste — yatay zaman çizgisi küçük ekranda okunmaz (brief §4.3). */}
      <ol className="mt-10 list-none border-l border-sand md:hidden">
        <RevealGroup itemAs="li" itemClassName="relative pb-8 pl-8 last:pb-0">
          {items.map((item) => (
            <FlowItemContent
              dotClassName="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-olive"
              item={item}
              key={`${item.time}-${item.title[locale]}`}
              locale={locale}
            />
          ))}
        </RevealGroup>
      </ol>
    </div>
  )
}
