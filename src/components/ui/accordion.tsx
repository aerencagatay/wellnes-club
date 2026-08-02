import { Plus } from 'lucide-react'

export type AccordionItem = { id: string; question: string; answer: string }

export function Accordion({
  items,
  onTintedBackground = false,
}: {
  items: AccordionItem[]
  /** Kamp detay sayfası bu bileşeni bir `Section background="cream-2"` içinde
   *  kullanır; orada düz gövde metni (answer paragrafı) WCAG AA eşiğinin altına
   *  düşer (bkz. globals.css'teki -deep token yorumu). `/sss` sayfası düz krem
   *  zeminde kullandığı için varsayılan `false` kalır. */
  onTintedBackground?: boolean
}) {
  const answerClass = onTintedBackground ? 'mt-4 max-w-3xl pr-12 text-body-deep' : 'mt-4 max-w-3xl pr-12'
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details className="group py-5" key={item.id}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
            <span className="font-heading text-lg text-ink">{item.question}</span>
            <Plus
              aria-hidden
              className="size-5 shrink-0 text-accent-deep transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className={answerClass}>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
