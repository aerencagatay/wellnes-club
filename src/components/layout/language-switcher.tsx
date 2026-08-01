'use client'

import { useParams } from 'next/navigation'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const current = params.locale as string
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest">
      {routing.locales.map((locale) => (
        <button
          aria-current={locale === current ? 'true' : undefined}
          className={`px-2 py-1 transition-opacity ${locale === current ? 'text-ink' : 'text-body hover:text-ink'} ${isPending ? 'opacity-50' : ''}`}
          disabled={isPending || locale === current}
          key={locale}
          onClick={() => startTransition(() => router.replace(pathname, { locale }))}
          type="button"
        >
          {locale}
        </button>
      ))}
    </div>
  )
}
