export type AccordionItem = { id: string; question: string; answer: string }

export function Accordion({
  items,
  onTintedBackground = false,
}: {
  items: AccordionItem[]
  /** Kamp detay sayfası bu bileşeni bir `Section background="surface"` içinde
   *  kullanır; orada düz gövde metni (answer paragrafı) WCAG AA eşiğinin altına
   *  düşer (bkz. globals.css'teki --color-muted token yorumu). `/sss` sayfası düz krem
   *  zeminde kullandığı için varsayılan `false` kalır. */
  onTintedBackground?: boolean
}) {
  const answerClass = onTintedBackground ? 'mt-4 max-w-3xl pr-12 text-muted' : 'mt-4 max-w-3xl pr-12'
  return (
    <div className="divide-y divide-sand border-y border-sand">
      {items.map((item) => (
        <details className="group py-6" key={item.id}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
            <span className="font-heading text-lg text-text">{item.question}</span>
            {/* İkon yerine ince bir +/− çizgi göstergesi (bkz. brief §1 — dev
             *  görsel dilinden ikon setine değil tipografik işaretlere öncelik).
             *  <details> yerel olarak açılıp kapandığından bu tamamen CSS'tir;
             *  JS gerekmez. */}
            <span aria-hidden className="relative size-4 shrink-0 text-olive">
              <span className="absolute inset-y-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
              <span className="absolute inset-x-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-opacity duration-200 group-open:opacity-0" />
            </span>
          </summary>
          <p className={answerClass}>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
