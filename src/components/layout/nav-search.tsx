'use client'

import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'

/**
 * Navbar arama ikonu: tıklanınca genişleyen bir metin kutusu açar, Enter'da
 * `/kamplar?q=...`'a yönlendirir (bkz. `filterCamps`'teki `query` filtresi).
 * Gerçek bir arama sonuçları paneli yok — mevcut kamp listesi sayfasının
 * filtre altyapısını yeniden kullanır.
 */
export function NavSearch({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations('nav')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function submit() {
    const trimmed = value.trim()
    setOpen(false)
    router.push(trimmed ? `/kamplar?q=${encodeURIComponent(trimmed)}` : '/kamplar')
  }

  if (open) {
    return (
      <form
        className="flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <input
          className={`w-40 border-b bg-transparent py-1 text-sm outline-none placeholder:text-current/50 sm:w-56 ${
            transparent ? 'border-background/40 text-background' : 'border-sand text-text'
          }`}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t('searchPlaceholder')}
          ref={inputRef}
          type="search"
          value={value}
        />
        <button aria-label={t('closeSearch')} onClick={() => setOpen(false)} type="button">
          <X className={`size-4 ${transparent ? 'text-background' : 'text-text'}`} />
        </button>
      </form>
    )
  }

  return (
    <button aria-label={t('searchLabel')} onClick={() => setOpen(true)} type="button">
      <Search className={`size-[18px] transition-colors duration-300 ${transparent ? 'text-background/85 hover:text-background' : 'text-muted hover:text-text'}`} />
    </button>
  )
}
