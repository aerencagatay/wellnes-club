import { Plus } from 'lucide-react'

export type AccordionItem = { id: string; question: string; answer: string }

export function Accordion({ items }: { items: AccordionItem[] }) {
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
          <p className="mt-4 max-w-3xl pr-12">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
