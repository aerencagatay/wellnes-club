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
      <label className="text-sm font-semibold text-ink" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-body" id={`${htmlFor}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs font-semibold text-coral-deep" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const inputClass =
  'w-full rounded-sm border border-border bg-cream px-4 py-3 text-ink placeholder:text-body-light focus:border-accent-deep focus:outline-2 focus:outline-offset-1 focus:outline-accent-deep'

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
