'use client'

import { useParams } from 'next/navigation'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

/**
 * `transparent`: `Navbar`, hero üzerinde şeffaf + açık metin durumundayken bunu
 * `true` geçirir, böylece bu buton çifti de logo/menü ile aynı anda karanlık
 * hero fotoğrafı üzerinde okunur kalır. Varsayılan `false` — krem zemindeki
 * normal (koyu metin) görünüm.
 */
export function LanguageSwitcher({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const current = params.locale as string
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-1 text-xs font-semibold tracking-widest">
      {routing.locales.map((locale) => (
        <button
          aria-current={locale === current ? 'true' : undefined}
          className={`px-2 py-1 transition-colors duration-300 ${
            transparent
              ? locale === current
                ? 'text-background'
                : 'text-background/70 hover:text-background'
              : locale === current
                ? 'text-text'
                : 'text-muted hover:text-text'
          } ${isPending ? 'opacity-50' : ''}`}
          disabled={isPending || locale === current}
          key={locale}
          onClick={() => startTransition(() => router.replace(pathname, { locale }))}
          type="button"
        >
          {/* Metin GERÇEKTEN büyük harf yazılır, `uppercase` sınıfıyla görsel
              olarak dönüştürülmez. `text-transform` yalnızca boyamayı etkiler:
              DOM'daki içerik "tr" olarak kalır, kopyala-yapıştırda ve bazı
              ekran okuyucularda küçük harf olarak çıkar. Sabit iki harflik
              dil kodları için içeriği doğrudan büyük yazmak daha dürüst.

              `toUpperCase()` yerelden bağımsız (invariant) kuralları kullanır —
              Türkçe'nin noktalı/noktasız i kuralı burada devreye girmez; zaten
              'tr'/'en' kodlarının hiçbirinde 'i' yok. */}
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
