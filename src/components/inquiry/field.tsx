import type { ReactNode } from 'react'

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-text" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted" id={`${htmlFor}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs font-medium text-text" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// İnce alt çizgili input: dolgu/çerçeve yerine tek bir zemin çizgisi (bkz.
// Task 8 brief §3). Odak durumunda hem çizgi zeytine döner hem de klavye
// kullanıcıları için görünür bir outline korunur — yalnızca renk değişimine
// güvenmek erişilebilirlik açısından yetersiz olurdu.
export const inputClass =
  'w-full rounded-none border-0 border-b border-text/25 bg-transparent px-1 py-3 text-text placeholder:text-muted focus:border-olive focus:outline-2 focus:outline-offset-1 focus:outline-olive'

/**
 * `Field` yukarıda hata/hint paragraflarının kimliğini `${htmlFor}-error` /
 * `${htmlFor}-hint` olarak üretir. Alanın kendisi (input/select/textarea) bu kimliğe
 * `aria-describedby` ile bağlanmazsa ekran okuyucu kullanıcısı hatayı asla duymaz — bu
 * yardımcı o eşleşmeyi TEK bir yerde tutar, her alanda elle tekrarlanan
 * `error ? 'x-error' : hint ? 'x-hint' : undefined` mantığının bir kopyasının
 * unutulup tutarsızlık yaratmasını önler. Hata her zaman hint'ten önceliklidir —
 * `Field` da hint'i `!error` koşuluyla gizler, burası onunla senkron.
 */
export function fieldDescribedBy(htmlFor: string, options: { error?: string; hint?: string } = {}): string | undefined {
  if (options.error) return `${htmlFor}-error`
  if (options.hint) return `${htmlFor}-hint`
  return undefined
}
